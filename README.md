# authentication-express.js

A modular Express.js authentication API with JWT and role-based access control.

## Features
- User registration (user, admin, superadmin roles)
- Secure login with JWT authentication
- Password hashing with bcrypt
- Role-based protected routes
- Modular route and utility structure

## Project Structure
```
├── app.js              # Main entry point
├── routes/             # Route handlers
│   ├── index.js
│   ├── login.js
│   ├── register.js
│   ├── register-admin.js
│   ├── register-superadmin.js
│   ├── secret-route.js
│   └── super-secret-route.js
├── db.js               # Database setup
├── dbMethods.js        # Database methods
├── authUtils.js        # Auth and password utilities
├── package.json
└── README.md
```

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```
2. **Set environment variables:**
   Create a `.env` file with:
   ```
   SECRET_KEY=your_jwt_secret
   ADMIN_KEY=your_admin_key
   SUPER_ADMIN_KEY=your_superadmin_key
   DATABASE_PASSWORD=your_potgresql_database_password
   ```
   > **Note:** This project uses a PostgreSQL database listening on port 5432 by default. Adjust `port in db.js` if your setup is different.
3. **Start the server:**
   ```
   node app.js
   ```

## API Endpoints

- `POST /register` — Register a new user
- `POST /register-admin` — Register an admin (requires `ADMIN_KEY`)
- `POST /register-superadmin` — Register a superadmin (requires `SUPER_ADMIN_KEY`)
- `POST /login` — User login, returns JWT
- `POST /secret-route` — Protected route for admin/superadmin
- `POST /super-secret-route` — Protected route for superadmin only

## License
MIT
