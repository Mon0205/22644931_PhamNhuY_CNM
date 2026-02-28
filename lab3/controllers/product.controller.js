import { ProductService } from "../services/product.service.js";
import { CategoryRepo } from "../repositories/category.repo.js";

export const ProductController = {
    // GET /products
    index: async (req, res) => {
        try {
            const data = await ProductService.getListProducts(req.query);
            res.render("product/products", data);
        } catch (err) {
            console.error(err);
            res.status(500).send("Lỗi tải danh sách sản phẩm");
        }
    },

    // GET /products/add
    showAddForm: async (req, res) => {
        const categories = await CategoryRepo.getAll();
        res.render("product/add", { categories });
    },

    // POST /products/add
    create: async (req, res) => {
        try {
            // req.user lấy từ session (nếu middleware auth đã gán)
            const user = req.session.user;
            await ProductService.createProduct(req.body, req.file, user);
            res.redirect("/products");
        } catch (err) {
            console.error(err);
            res.status(500).send("Thêm thất bại: " + err.message);
        }
    },

    // GET /products/edit/:id
    showEditForm: async (req, res) => {
        try {
            const data = await ProductService.getEditData(req.params.id);
            res.render("product/edit", data);
        } catch (err) {
            res.redirect("/products");
        }
    },

    // POST /products/edit/:id
    update: async (req, res) => {
        try {
            const user = req.session.user;
            await ProductService.updateProduct(req.params.id, req.body, user);
            res.redirect("/products");
        } catch (err) {
            console.error(err);
            res.status(500).send("Cập nhật thất bại");
        }
    },

    // GET /products/delete/:id
    delete: async (req, res) => {
        try {
            const user = req.session.user;
            await ProductService.deleteProduct(req.params.id, user);
            res.redirect("/products");
        } catch (err) {
            console.error(err);
            res.status(500).send("Xóa thất bại");
        }
    }
};