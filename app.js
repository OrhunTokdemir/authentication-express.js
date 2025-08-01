const express = require('express');
const app = express();
const { setupDatabase, pool } = require('./db');

const port = 3000;

setupDatabase(pool).then(() => {
  console.log('Database is ready');
});

app.use(express.json());

// Route imports
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const registerAdminRoutes = require('./routes/register-admin');
const registerSuperAdminRoutes = require('./routes/register-superadmin');
const secretRoute = require('./routes/secret-route');
const superSecretRoute = require('./routes/super-secret-route');
const indexRoutes = require('./routes/index');

// Route usage
app.use('/', indexRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/register-admin', registerAdminRoutes);
app.use('/register-superadmin', registerSuperAdminRoutes);
app.use('/secret-route', secretRoute);
app.use('/super-secret-route', superSecretRoute);

app.listen(port, () => console.log(`App is listening on port ${port}!`));
