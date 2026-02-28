import express from "express";
import { OrderController } from "../controllers/order.controller.js";

const router = express.Router();

// URL: /order/checkout
router.post("/checkout", OrderController.checkout);

export default router;