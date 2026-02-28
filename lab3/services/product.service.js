import { v4 as uuidv4 } from "uuid";
import s3 from "../db/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ProductRepo } from "../repositories/product.repo.js";
import { CategoryRepo } from "../repositories/category.repo.js";
import { LogRepo } from "../repositories/log.repo.js"; // Import LogModel của bạn

export const ProductService = {
    // Logic Lấy danh sách + Lọc + Phân trang
    getListProducts: async (query) => {
        // 1. Lấy dữ liệu thô từ Repo
        let products = await ProductRepo.getAll();
        const categories = await CategoryRepo.getAll();

        const { name, categoryId, minPrice, maxPrice, page } = query;

        // 2. Logic Lọc (Filter)
        products = products.filter(p => p.isDeleted !== true);

        if (name && name.trim() !== "") {
            products = products.filter(p => p.name && p.name.toLowerCase().includes(name.trim().toLowerCase()));
        }
        if (categoryId && categoryId.trim() !== "") {
            products = products.filter(p => p.categoryId === categoryId);
        }
        if (minPrice && minPrice.trim() !== "") {
            products = products.filter(p => Number(p.price) >= Number(minPrice));
        }
        if (maxPrice && maxPrice.trim() !== "") {
            products = products.filter(p => Number(p.price) <= Number(maxPrice));
        }

        // 3. Logic Phân trang
        const limit = 3;
        const currentPage = parseInt(page) || 1;
        const totalItems = products.length;
        const totalPages = Math.ceil(totalItems / limit);
        const safePage = currentPage > totalPages && totalPages > 0 ? totalPages : currentPage;

        const startIndex = (safePage - 1) * limit;
        const paginatedProducts = products.slice(startIndex, safePage * limit);

        // 4. Map tên Category
        paginatedProducts.forEach(p => {
            const cat = categories.find(c => c.categoryId === p.categoryId);
            p.categoryName = cat ? cat.name : "Chưa phân loại";
        });

        return {
            products: paginatedProducts,
            categories,
            pagination: { page: safePage, totalPages, totalItems },
            query // Trả lại query để Controller truyền xuống View
        };
    },

    // Logic lấy dữ liệu để hiển thị form Edit
    getEditData: async (id) => {
        const product = await ProductRepo.getById(id);
        const categories = await CategoryRepo.getAll();
        return { product, categories };
    },

    // Logic Thêm mới (Bao gồm Upload S3 và Log)
    createProduct: async (data, file, user) => {
        if (!file) throw new Error("Chưa chọn ảnh");

        const id = uuidv4();
        const imageKey = `products/${id}-${file.originalname}`;

        // Upload S3
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: imageKey,
            Body: file.buffer,
            ContentType: file.mimetype
        }));

        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;

        // Chuẩn bị item
        const newItem = {
            id,
            name: data.name,
            price: Number(data.price),
            quantity: Number(data.quantity),
            categoryId: data.categoryId,
            url_image: imageUrl,
            isDeleted: false,
            createdAt: new Date().toISOString()
        };

        // Gọi Repo lưu DB
        await ProductRepo.create(newItem);

        // Ghi Log
        if (user) {
            await LogRepo.create(id, "CREATE", user.userId);
        }
    },

    // Logic Cập nhật
    updateProduct: async (id, data, user) => {
        await ProductRepo.update(id, data);

        // Ghi Log
        if (user) {
            await LogRepo.create(id, "UPDATE", user.userId);
        }
    },

    // Logic Xóa
    deleteProduct: async (id, user) => {
        await ProductRepo.softDelete(id);

        // Ghi Log
        if (user) {
            await LogRepo.create(id, "DELETE", user.userId);
        }
    }
};