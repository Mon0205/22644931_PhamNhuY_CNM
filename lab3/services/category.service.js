import { v4 as uuidv4 } from "uuid";
import dynamoDB from "../db/dynamodb.js";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"; // Dùng để update products
import { CategoryRepo } from "../repositories/category.repo.js";

export const CategoryService = {
    getAllCategories: async () => {
        return await CategoryRepo.getAll();
    },

    getCategoryById: async (id) => {
        return await CategoryRepo.getById(id);
    },

    createCategory: async (data) => {
        const newItem = {
            categoryId: uuidv4(),
            name: data.name,
            description: data.description
        };
        await CategoryRepo.create(newItem);
    },

    updateCategory: async (id, data) => {
        await CategoryRepo.update(id, data.name, data.description);
    },

    // LOGIC PHỨC TẠP: Xóa category -> Update products
    deleteCategory: async (catId) => {
        const UNCATEGORIZED_ID = "uncategorized";

        // 1. Tìm các sản phẩm đang thuộc category này
        // (Lưu ý: Tốt nhất nên viết hàm này bên ProductRepo, nhưng để code gọn ta xử lý trực tiếp ở đây)
        const productsToUpdate = await dynamoDB.send(
            new ScanCommand({
                TableName: "products",
                FilterExpression: "categoryId = :c",
                ExpressionAttributeValues: { ":c": catId }
            })
        );

        // 2. Cập nhật chúng về "uncategorized"
        if (productsToUpdate.Items && productsToUpdate.Items.length > 0) {
            const updatePromises = productsToUpdate.Items.map((product) =>
                dynamoDB.send(
                    new UpdateCommand({
                        TableName: "products",
                        Key: { id: product.id },
                        UpdateExpression: "SET categoryId = :u",
                        ExpressionAttributeValues: { ":u": UNCATEGORIZED_ID }
                    })
                )
            );
            await Promise.all(updatePromises);
        }

        // 3. Xóa category
        await CategoryRepo.delete(catId);
    }
};