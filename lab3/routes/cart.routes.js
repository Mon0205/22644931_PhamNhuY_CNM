import express from "express";
import { CartController } from "../controllers/cart.controller.js";

const router = express.Router();

// Xem giỏ hàng
router.get("/", CartController.viewCart);

// Thêm vào giỏ (VD: /cart/add/123)
router.get("/add/:id", CartController.addToCart);

// Cập nhật số lượng (VD: /cart/update/123/increase)
router.get("/update/:productId/:action", CartController.updateItem);

// Xóa sản phẩm
router.get("/remove/:productId", CartController.removeItem);

export default router;