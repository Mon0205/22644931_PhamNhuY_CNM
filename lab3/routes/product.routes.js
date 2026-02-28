import express from "express";
import upload from "../upload.js"; // Middleware upload ảnh
import { ProductController } from "../controllers/product.controller.js";

const router = express.Router();

/* ===================== ROUTES ===================== */

// Danh sách
router.get("/", ProductController.index);

// Thêm mới
router.get("/add", ProductController.showAddForm);
router.post("/add", upload.single("image"), ProductController.create);

// Chỉnh sửa
router.get("/edit/:id", ProductController.showEditForm);
router.post("/edit/:id", ProductController.update);

// Xóa
router.get("/delete/:id", ProductController.delete);

export default router;