// const express = require('express');
// const router = express.Router();
// const db = require('../db/mysql');
//
// // Home
// router.get('/', async (req, res) => {
//     const [rows] = await db.query('SELECT * FROM products');
//     res.render('products', { products: rows });
// });
//
// // Add product
// router.post('/add', async (req, res) => {
//     const { name, price, quantity } = req.body;
//     await db.query(
//         'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)',
//         [name, price, quantity]
//     );
//     res.redirect('/');
// });
//
// module.exports = router;
const express = require('express');
const router = express.Router();

// Import Controller và Middleware
const productController = require('../controller/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

// --- CÁC ROUTE CẦN BẢO VỆ (Phải đăng nhập mới thấy) ---

// Trang chủ (Danh sách sản phẩm)
router.get('/', authMiddleware.requireLogin, productController.getProducts);

// Thêm sản phẩm
router.post('/add', authMiddleware.requireLogin, productController.postAddProduct);

// Sửa sản phẩm (Load form & Xử lý update)
router.get('/edit/:id', authMiddleware.requireLogin, productController.getEditProduct);
router.post('/edit', authMiddleware.requireLogin, productController.postEditProduct);

// Xóa sản phẩm
router.get('/delete/:id', authMiddleware.requireLogin, productController.deleteProduct);

module.exports = router;