const express = require('express')
const { setupDatabase, pool } = require('./db');
const { insertUserToDb, checkUsernameAndEmail } = require('./dbMethods');
const app = express()
const port = 3000

setupDatabase(pool).then(() => {
    console.log('Database is ready');
});

app.use(express.json())
var user={
    username: 'admin',
    password: 'password'
}

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (username==null || password==null) {
        return res.status(400).send('Username and password are required!');
    }
    if(username !== user.username || password !== user.password) {
        return res.status(401).send('Invalid username or password');
    }

    res.status(200).send('Login successful');
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.post('/register', async (req, res) => {
    const {username, email, password}=req.body;
    if (username==null || email==null || password==null) {
        return res.status(400).send('Username, email and password are required!');
    }
    try {
        const result = await checkUsernameAndEmail(pool, username, email);
        if (result.username && result.email) {
            return res.status(409).send('Username and email already exist');
        } else if (result.username) {
            return res.status(409).send('Username already exists');
        } else if (result.email) {
            return res.status(409).send('Email already exists');
        }

        const newUser = await insertUserToDb(pool, username, email, password);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
});
