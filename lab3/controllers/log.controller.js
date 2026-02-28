import { LogService } from "../services/log.service.js";

export const LogController = {
    index: async (req, res) => {
        try {
            const displayLogs = await LogService.getFormattedLogs();
            res.render("logs/productLogs", { logs: displayLogs });
        } catch (err) {
            console.error(err);
            res.status(500).send("Lỗi tải lịch sử hệ thống");
        }
    }
};