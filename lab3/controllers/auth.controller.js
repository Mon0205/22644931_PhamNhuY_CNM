import { AuthService } from "../services/auth.service.js";

export const AuthController = {
    /* --- REGISTER --- */
    showRegisterForm: (req, res) => {
        res.render("auth/register", { error: null });
    },

    register: async (req, res) => {
        try {
            await AuthService.register(req.body);
            res.redirect("/auth/login");
        } catch (err) {
            console.error(err);
            // Render lại trang đăng ký kèm thông báo lỗi
            res.render("auth/register", { error: err.message });
        }
    },

    /* --- LOGIN --- */
    showLoginForm: (req, res) => {
        res.render("auth/login", { error: null });
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await AuthService.login(username, password);

            if (!user) {
                return res.render("auth/login", { error: "Sai tên đăng nhập hoặc mật khẩu" });
            }

            // Lưu session
            req.session.user = user;

            // Redirect về trang chủ
            res.redirect("/");

        } catch (err) {
            console.error(err);
            res.status(500).send("Lỗi đăng nhập hệ thống");
        }
    },

    /* --- LOGOUT --- */
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/auth/login");
        });
    }
};