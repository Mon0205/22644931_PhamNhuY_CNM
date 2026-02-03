const db = require('../db/mysql');

module.exports = class Product {
    static fetchAll() {
        return db.query('SELECT * FROM products');
    }

    static findById(id) {
        return db.query('SELECT * FROM products WHERE id = ?', [id]);
    }

    static add(name, price, quantity) {
        return db.query('INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)', [name, price, quantity]);
    }

    static update(id, name, price, quantity) {
        return db.query('UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]);
    }

    static delete(id) {
        return db.query('DELETE FROM products WHERE id = ?', [id]);
    }
};