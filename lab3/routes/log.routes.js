import express from "express";
import { LogController } from "../controllers/log.controller.js";

const router = express.Router();

// GET /logs
router.get("/", LogController.index);

export default router;