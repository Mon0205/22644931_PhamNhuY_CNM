import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    // Không truy vấn database, chỉ trả về giao diện trang chủ
    res.render("home");
});

export default router;