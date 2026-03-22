const express = require("express");
const app = express();

const productRoute = require("./product.route"); // Trỏ tới file route của Product

// Gắn route vào đường dẫn /products
app.use("/products", productRoute);

// (Tùy chọn) Chuyển hướng người dùng từ trang chủ '/' sang thẳng danh sách sản phẩm
app.get("/", (req, res) => {
  res.redirect("/products");
});

module.exports = app;