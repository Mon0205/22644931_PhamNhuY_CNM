const express = require('express');
const session = require('express-session'); // 1. Import thư viện session
const app = express();

// Cấu hình View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware xử lý dữ liệu Form
app.use(express.urlencoded({ extended: true }));

// 2. Cấu hình thư mục Public (để file style.css hoạt động)
// File css của bạn đang nằm trong public/stylesheets/style.css
app.use(express.static('public'));

// 3. Cấu hình Session (QUAN TRỌNG NHẤT)
app.use(session({
    secret: 'chuoi-bi-mat-cua-ban', // Khóa bí mật để mã hóa session
    resave: false,                  // Không lưu lại nếu không có thay đổi
    saveUninitialized: false,       // Không tạo session rác cho khách vãng lai
    cookie: { maxAge: 1000 * 60 * 60 } // Session sống trong 1 giờ
}));

// 4. Import Routes
const authRoutes = require('./routes/auth.routes');     // Route xử lý Login/Logout
const productRoutes = require('./routes/product.routes'); // Route xử lý Sản phẩm

// 5. Sử dụng Routes
app.use('/', authRoutes);
app.use('/', productRoutes);

// Server lắng nghe
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});