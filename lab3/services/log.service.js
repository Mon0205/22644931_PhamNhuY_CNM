import { LogRepo } from "../repositories/log.repo.js";
import { UserRepo } from "../repositories/user.repo.js";
import { ProductRepo } from "../repositories/product.repo.js";

export const LogService = {
    getFormattedLogs: async () => {
        // 1. Gọi Repo lấy dữ liệu thô từ 3 bảng
        // Dùng Promise.all để chạy song song cho nhanh
        const [logs, users, products] = await Promise.all([
            LogRepo.getAll(),
            UserRepo.getAll(),
            ProductRepo.getAll()
        ]);

        // 2. Map dữ liệu (Logic Business)
        const displayLogs = logs.map(log => {
            const user = users.find(u => u.userId === log.userId);
            const product = products.find(p => p.id === log.productId);

            return {
                ...log,
                // Hiển thị tên thay vì ID (nếu tìm thấy)
                username: user ? user.username : "Unknown User",
                // Hiển thị tên SP hoặc ID nếu SP đã bị xóa hoàn toàn khỏi DB
                productName: product ? product.name : `Sản phẩm đã xóa (${log.productId})`,
                // Định dạng giờ Việt Nam
                formattedTime: new Date(log.time).toLocaleString("vi-VN")
            };
        });

        return displayLogs;
    }
};