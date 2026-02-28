// middleware/auth.middleware.js

// 1. Kiểm tra xem đã đăng nhập chưa
export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/auth/login");
    }
    next();
};

// 2. Kiểm tra quyền Admin (Chỉ admin mới qua được)
export const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).send("⛔ Bạn không có quyền truy cập trang này (Chỉ dành cho Admin)");
    }
    next();
};