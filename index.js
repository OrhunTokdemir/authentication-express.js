const express = require('express')
const { setupDatabase, pool } = require('./db');
const { insertUserToDb, checkUsernameAndEmail, checkForLogin } = require('./dbMethods');
const { generateToken, verifyToken } = require('./authUtils');
const { hashPassword, comparePassword } = require('./authUtils');


const app = express()
const port = 3000

setupDatabase(pool).then(() => {
    console.log('Database is ready');
});

app.use(express.json())
//var user={
//    username: 'admin',
//    password: 'password'
//}

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if (username==null || password==null) {
        return res.status(400).send('Username and password are required!');
    }
    try {
        const user = await checkForLogin(pool, username, password, comparePassword);
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        // Generate JWT token
        const payload = { 
            id: user.id,
            username: user.username,
            role: user.role
        };
        const token = await generateToken(payload);
        res.status(200).json({
            message: `Login successful. Welcome ${user.username}!`,
            token: token
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal server error');
    }
});

app.post('/register', async (req, res) => {
    const {username, email, password}=req.body;
    //checks if the required fields are provided
    if (username==null || email==null || password==null) {
        return res.status(400).send('Username, email and password are required!');
    }
    //checks if the username or email is already recorded in the database
    try {
        const result = await checkUsernameAndEmail(pool, username, email);
        if (result.username && result.email) {
            return res.status(409).send('Username and email already exist');
        } else if (result.username) {
            return res.status(409).send('Username already exists');
        } else if (result.email) {
            return res.status(409).send('Email already exists');
        }

        const newUser = await insertUserToDb(pool, username, email, password, hashPassword);
        console.log('New user registered:', newUser);
        return res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
    
});

app.post('/register-admin', async (req, res) => {
    const {username, email, password, adminKey}=req.body;
    //checks if the required fields are provided
    if (username==null || email==null || password==null) {
        return res.status(400).send('Username, email and password are required!');
    }
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).send('Forbidden: Invalid admin key');
    }
    //checks if the username or email is already recorded in the database
    try {
        const result = await checkUsernameAndEmail(pool, username, email);
        if (result.username && result.email) {
            return res.status(409).send('Username and email already exist');
        } else if (result.username) {
            return res.status(409).send('Username already exists');
        } else if (result.email) {
            return res.status(409).send('Email already exists');
        }

        const newUser = await insertUserToDb(pool, username, email, password, 'admin', hashPassword);
        console.log('New admin registered:', newUser);
        return res.status(201).send('Admin registered successfully');
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).send('Internal server error');
    }
 });   
    
    app.post('/register-superadmin', async (req, res) => {
    const {username, email, password, superAdminKey}=req.body;
    //checks if the required fields are provided
    if (username==null || email==null || password==null) {
        return res.status(400).send('Username, email and password are required!');
    }
    if (superAdminKey !== process.env.SUPER_ADMIN_KEY) {
        return res.status(403).send('Forbidden: Invalid superadmin key');
    }
    //checks if the username or email is already recorded in the database
    try {
        const result = await checkUsernameAndEmail(pool, username, email);
        if (result.username && result.email) {
            return res.status(409).send('Username and email already exist');
        } else if (result.username) {
            return res.status(409).send('Username already exists');
        } else if (result.email) {
            return res.status(409).send('Email already exists');
        }

        const newUser = await insertUserToDb(pool, username, email, password, 'superadmin', hashPassword);
        console.log('New superadmin registered:', newUser);
        return res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering superadmin:', error);
        res.status(500).send('Internal server error');
    }  
});

app.post('/secret-route', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    const decoded = await verifyToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
        return res.status(403).send('Forbidden');
    }

    res.send('This is a secret route');
});

app.post('/super-secret-route', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    const decoded = await verifyToken(token);
    if (decoded.role !== 'superadmin') {
        return res.status(403).send('Forbidden');
    }

    res.send('This is a super secret route');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
