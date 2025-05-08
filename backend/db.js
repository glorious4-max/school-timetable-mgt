
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'school_timetable'
});

pool.connect((err, user, release) => {
    if (err) {
        return console.error('Error acquiring user', err.stack);
    }
    console.log('Database connected successfully');
    release();
});


module.exports = pool;


