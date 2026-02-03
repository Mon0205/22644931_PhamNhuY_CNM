const User = require('../model/user.model');

exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await User.findByUsername(username);

    // Kiểm tra user tồn tại và mật khẩu (đơn giản, chưa mã hóa)
    if (rows.length > 0 && rows[0].password === password) {
        req.session.user = rows[0]; // Lưu session
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};