import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

/* ===================== ROUTES ===================== */

// Đăng ký
router.get("/register", AuthController.showRegisterForm);
router.post("/register", AuthController.register);

// Đăng nhập
router.get("/login", AuthController.showLoginForm);
router.post("/login", AuthController.login);

// Đăng xuất
router.get("/logout", AuthController.logout);

export default router;