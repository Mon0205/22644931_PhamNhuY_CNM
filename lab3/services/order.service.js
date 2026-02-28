import { v4 as uuidv4 } from "uuid";
import { OrderRepo } from "../repositories/order.repo.js";
import { ProductRepo } from "../repositories/product.repo.js";
import { LogRepo } from "../repositories/log.repo.js";

export const OrderService = {
    createOrder: async (user, cart) => {
        if (!cart || cart.items.length === 0) {
            throw new Error("Giỏ hàng trống");
        }

        const orderId = uuidv4(); // Đây là mã đơn hàng (VD: 888e2d24...)

        // 1. Tạo đơn hàng (Bảng Orders vẫn lưu danh sách items đầy đủ)
        const newOrder = {
            orderId: orderId,
            userId: user.userId,
            username: user.username,
            items: cart.items,
            totalPrice: cart.totalPrice,
            totalQuantity: cart.totalQuantity,
            status: "completed",
            createdAt: new Date().toISOString()
        };
        await OrderRepo.create(newOrder);

        // 2. Xử lý từng sản phẩm: Trừ kho & Ghi Log
        // ⚠️ QUAN TRỌNG: Phải dùng map để duyệt qua từng item
        const processItemsPromises = cart.items.map(async (item) => {
            try {
                // A. Trừ kho
                await ProductRepo.decreaseQuantity(item.productId, item.quantity);

                // B. Ghi Log (Phải nằm TRONG vòng lặp này)
                if (user) {
                    // item.productId: ID của từng sản phẩm (Laptop, Chuột, v.v.)
                    // Log sẽ ghi: User A đã ORDER sản phẩm Laptop
                    await LogRepo.create(item.productId, "ORDER", user.userId);
                }
            } catch (err) {
                console.error(`❌ Lỗi xử lý SP ${item.productId}:`, err);
            }
        });

        // Chờ tất cả các luồng xử lý xong
        await Promise.all(processItemsPromises);

        return newOrder;
    }
};