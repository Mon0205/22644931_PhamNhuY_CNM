import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { UserRepo } from "../repositories/user.repo.js";

export const AuthService = {
    // Logic Đăng ký
    register: async (data) => {
        const { username, password, role } = data;

        // 1. Kiểm tra user tồn tại
        const existingUser = await UserRepo.findByUsername(username);
        if (existingUser) {
            throw new Error("Username đã tồn tại");
        }

        // 2. Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Chuẩn bị dữ liệu
        const newUser = {
            userId: uuidv4(),
            username,
            password: hashedPassword,
            role: role || "staff",
            createdAt: new Date().toISOString()
        };

        // 4. Lưu vào DB
        return await UserRepo.create(newUser);
    },

    // Logic Đăng nhập
    login: async (username, password) => {
        // 1. Tìm user
        const user = await UserRepo.findByUsername(username);

        // 2. Nếu không có user -> Fail
        if (!user) {
            return null;
        }

        // 3. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        // 4. Trả về thông tin user (để lưu session)
        return {
            userId: user.userId,
            username: user.username,
            role: user.role
        };
    }
};