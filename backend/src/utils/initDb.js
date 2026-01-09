const pool = require('../config/db');

const createUsersTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
    `;

    try {
        await pool.query(query);
        console.log("Users table created successfully");
    } catch (error) {
        console.error("Error creating users table:", error);
    }
};

const createTodosTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
    );
    `;

    try {
        await pool.query(query);
        console.log("Todos table created successfully");
    } catch (error) {
        console.error("Error creating todos table:", error);
    }
};

const init = async () => {
    await createUsersTable();
    await createTodosTable();
    process.exit(0);
};

init();
