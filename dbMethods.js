
async function insertUserToDb(pool, username, email, password, role = 'user',hashingCallback) {
    const client = await pool.connect();
    try {
        const hashedPassword = await hashingCallback(password);
        const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [username, email, hashedPassword, role];
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function checkUsernameAndEmail(pool, username, email) {
    const client = await pool.connect();
    try {
        const result = {
            username: null,
            email: null
        };

        // Check username
        const usernameRes = await client.query(
            'SELECT username FROM users WHERE username = $1 LIMIT 1',
            [username]
        );
        if (usernameRes.rows.length > 0) {
            result.username = username;
        }

        // Check email
        const emailRes = await client.query(
            'SELECT email FROM users WHERE email = $1 LIMIT 1',
            [email]
        );
        if (emailRes.rows.length > 0) {
            result.email = email;
        }

        return result;
    } catch (error) {
        console.error('Error checking username and email:', error);
        throw error;
    } finally {
        client.release();
    }
}
async function checkForLogin(pool, username, password, comparePasswordCallback) {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const res = await client.query(query, values);
        if (res.rows.length === 0) {
            return null; // No user found
        }
        const user = res.rows[0];
        if (await comparePasswordCallback(password, user.password)) {
            return user;
        }
        return null; // Password does not match
    } catch (error) {
        console.error('Error checking login:', error);
        throw error;
    } finally {
        client.release();
    }
}
module.exports = {
    insertUserToDb,
    checkUsernameAndEmail,
    checkForLogin
};