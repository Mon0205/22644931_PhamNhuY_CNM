import { CategoryService } from "../services/category.service.js";

export const CategoryController = {
    // GET /categories
    index: async (req, res) => {
        try {
            const categories = await CategoryService.getAllCategories();
            res.render("category/categories", { categories });
        } catch (err) {
            console.error("❌ Lỗi lấy danh sách:", err);
            res.status(500).send("Lỗi hệ thống");
        }
    },

    // GET /categories/add
    showAddForm: (req, res) => {
        res.render("category/add");
    },

    // POST /categories/add
    create: async (req, res) => {
        try {
            await CategoryService.createCategory(req.body);
            res.redirect("/categories");
        } catch (err) {
            console.error("❌ Lỗi thêm:", err);
            res.status(500).send("Thêm thất bại");
        }
    },

    // GET /categories/edit/:id
    showEditForm: async (req, res) => {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if (!category) return res.redirect("/categories");
            res.render("category/edit", { category });
        } catch (err) {
            res.redirect("/categories");
        }
    },

    // POST /categories/edit/:id
    update: async (req, res) => {
        try {
            await CategoryService.updateCategory(req.params.id, req.body);
            res.redirect("/categories");
        } catch (err) {
            console.error("❌ Lỗi cập nhật:", err);
            res.status(500).send("Cập nhật thất bại");
        }
    },

    // GET /categories/delete/:id
    delete: async (req, res) => {
        try {
            await CategoryService.deleteCategory(req.params.id);
            res.redirect("/categories");
        } catch (err) {
            console.error("❌ Lỗi xóa:", err);
            res.status(500).send("Xóa thất bại");
        }
    }
};