const db = require('../db/mysql');

module.exports = class User {
    static findByUsername(username) {
        return db.query('SELECT * FROM users WHERE username = ?', [username]);
    }
};