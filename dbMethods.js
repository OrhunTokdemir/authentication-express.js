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