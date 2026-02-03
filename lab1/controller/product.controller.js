const Product = require('../model/product.model');

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
    // Gọi Model để lấy data
    const [rows] = await Product.fetchAll();

    // Render ra view 'products' kèm theo thông tin user đang login
    res.render('products', {
        products: rows,
        user: req.session.user
    });
};

// Xử lý thêm sản phẩm
exports.postAddProduct = async (req, res) => {
    const { name, price, quantity } = req.body;
    await Product.add(name, price, quantity);
    res.redirect('/');
};

// Hiển thị form sửa sản phẩm
exports.getEditProduct = async (req, res) => {
    const productId = req.params.id;
    const [rows] = await Product.findById(productId);

    if (rows.length === 0) {
        return res.redirect('/');
    }

    res.render('edit', { product: rows[0] });
};

// Xử lý update sản phẩm
exports.postEditProduct = async (req, res) => {
    const { id, name, price, quantity } = req.body;
    await Product.update(id, name, price, quantity);
    res.redirect('/');
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    await Product.delete(productId);
    res.redirect('/');
};