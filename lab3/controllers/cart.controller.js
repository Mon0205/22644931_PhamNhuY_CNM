import { ProductRepo } from "../repositories/product.repo.js";

export const CartController = {
    // 1. Thêm sản phẩm vào giỏ
    addToCart: async (req, res) => {
        try {
            const productId = req.params.id;

            // Khởi tạo giỏ hàng nếu chưa có
            if (!req.session.cart) {
                req.session.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
            }
            const cart = req.session.cart;

            // Kiểm tra sản phẩm đã có trong giỏ chưa
            const existingItem = cart.items.find(item => item.productId === productId);

            if (existingItem) {
                // Nếu có rồi -> Tăng số lượng
                existingItem.quantity++;
            } else {
                // Nếu chưa có -> Lấy thông tin từ DB và thêm mới
                const product = await ProductRepo.getById(productId);
                if (!product) return res.status(404).send("Sản phẩm không tồn tại");

                cart.items.push({
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    url_image: product.url_image,
                    quantity: 1
                });
            }

            // Tính toán lại tổng tiền & tổng số lượng
            CartController.calculateTotal(cart);

            res.redirect("/cart"); // Chuyển hướng đến trang giỏ hàng
        } catch (err) {
            console.error(err);
            res.status(500).send("Lỗi thêm vào giỏ hàng");
        }
    },

    // 2. Xem giỏ hàng
    viewCart: (req, res) => {
        const cart = req.session.cart || { items: [], totalQuantity: 0, totalPrice: 0 };
        res.render("cart/index", { cart });
    },

    // 3. Cập nhật số lượng (+ / -)
    updateItem: (req, res) => {
        const { productId, action } = req.params;
        const cart = req.session.cart;

        if (!cart) return res.redirect("/cart");

        const item = cart.items.find(i => i.productId === productId);
        if (item) {
            if (action === "increase") {
                item.quantity++;
            } else if (action === "decrease") {
                item.quantity--;
                // Nếu giảm về 0 thì xóa luôn
                if (item.quantity <= 0) {
                    cart.items = cart.items.filter(i => i.productId !== productId);
                }
            }
            CartController.calculateTotal(cart);
        }

        res.redirect("/cart");
    },

    // 4. Xóa hẳn sản phẩm
    removeItem: (req, res) => {
        const { productId } = req.params;
        const cart = req.session.cart;

        if (cart) {
            cart.items = cart.items.filter(i => i.productId !== productId);
            CartController.calculateTotal(cart);
        }
        res.redirect("/cart");
    },

    // 5. Hàm phụ: Tính tổng tiền (Helper)
    calculateTotal: (cart) => {
        cart.totalQuantity = 0;
        cart.totalPrice = 0;

        cart.items.forEach(item => {
            cart.totalQuantity += item.quantity;
            cart.totalPrice += item.price * item.quantity;
        });
    }
};