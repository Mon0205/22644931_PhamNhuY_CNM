import { OrderService } from "../services/order.service.js";

export const OrderController = {
    // Xử lý nút "Thanh Toán"
    checkout: async (req, res) => {
        try {
            const user = req.session.user;
            const cart = req.session.cart;

            // Gọi Service tạo đơn
            const order = await OrderService.createOrder(user, cart);

            // ✅ QUAN TRỌNG: Xóa giỏ hàng sau khi mua thành công
            req.session.cart = null;

            // Render trang thông báo thành công
            res.render("cart/success", { order });

        } catch (err) {
            console.error(err);
            // Nếu lỗi (vd: hết hàng), quay lại giỏ hàng kèm thông báo (nếu có flash message)
            res.status(500).send("Lỗi thanh toán: " + err.message);
        }
    }
};