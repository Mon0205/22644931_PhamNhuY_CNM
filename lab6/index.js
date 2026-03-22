const express = require("express");
const app = express();

app.use(express.json({ extended: false })); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Render giao diện
app.use(express.static("./views")); // render giao diện từ thư mục views
// Cấu hình view engine là EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Cấp quyền truy cập cho thư mục public (để thẻ <img> đọc được ảnh trong thư mục uploads)
app.use(express.static("public"));

// ==========================================
// 🔥 ĐÂY LÀ PHẦN BẠN BỊ THIẾU KHIẾN WEB BỊ LỖI
// ==========================================
// 1. Import file route (Đảm bảo đường dẫn "./product.route" đúng với cấu trúc thư mục của bạn)
const productRoute = require("./routes/product.route");

// 2. Báo cho Express biết: "Nếu ai vào /products thì hãy giao cho productRoute xử lý"
app.use("/products", productRoute);

// 3. Tự động chuyển hướng trang chủ (localhost:3000) sang localhost:3000/products
app.get("/", (req, res) => {
    res.redirect("/products");
});
// ==========================================

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000/`);
});