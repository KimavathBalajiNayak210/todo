const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Simple test function or query logic can be added here
module.exports = {
    query: (text, params) => pool.query(text, params),
};
