async function insertUserToDb(pool, username, email, password) {
    const client = await pool.connect();
    try {
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, email, password];
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
module.exports = {
    insertUserToDb,
    checkUsernameAndEmail
};