const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sapassword',
    database: 'shopdb'
});

module.exports = pool.promise();
