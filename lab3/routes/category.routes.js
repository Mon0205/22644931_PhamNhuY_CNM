// import express from "express";
// import dynamoDB from "../db/dynamodb.js";
// import {
//     PutCommand,
//     ScanCommand,
//     GetCommand,
//     UpdateCommand,
//     DeleteCommand
// } from "@aws-sdk/lib-dynamodb";
// import {v4 as uuidv4} from "uuid";
//
// const router = express.Router();
// const TABLE_NAME = "categories";
//
// /* ===================== LIST CATEGORIES ===================== */
// router.get("/", async (req, res) => {
//     try {
//         const result = await dynamoDB.send(
//             new ScanCommand({ TableName: TABLE_NAME })
//         );
//         // SỬA TẠI ĐÂY: Trỏ vào file index.ejs trong thư mục category
//         res.render("category/categories", { categories: result.Items });
//     } catch (err) {
//         console.error("❌ Lỗi lấy danh sách category:", err);
//         res.status(500).send("Không thể tải danh mục");
//     }
// });
//
// /* ===================== ADD CATEGORY ===================== */
// router.get("/add", (req, res) => {
//     // Đã đúng nếu file nằm ở views/category/add.ejs
//     res.render("category/add");
// });
//
// router.post("/add", async (req, res) => {
//     try {
//         const categoryId = uuidv4();
//         const { name, description } = req.body;
//         await dynamoDB.send(
//             new PutCommand({
//                 TableName: TABLE_NAME,
//                 Item: { categoryId, name, description }
//             })
//         );
//         res.redirect("/categories");
//     } catch (err) {
//         console.error("❌ Lỗi thêm category:", err);
//         res.status(500).send("Thêm danh mục thất bại");
//     }
// });
//
// /* ===================== EDIT CATEGORY ===================== */
// router.get("/edit/:id", async (req, res) => {
//     try {
//         const result = await dynamoDB.send(
//             new GetCommand({
//                 TableName: TABLE_NAME,
//                 Key: { categoryId: req.params.id }
//             })
//         );
//         // SỬA TẠI ĐÂY: Code cũ của bạn là "category/categories/edit" (thừa 1 lớp)
//         res.render("category/edit", { category: result.Item });
//     } catch (err) {
//         console.error("❌ Lỗi lấy category để sửa:", err);
//         res.redirect("/categories");
//     }
// });
//
// router.post("/edit/:id", async (req, res) => {
//     try {
//         const { name, description } = req.body;
//         await dynamoDB.send(
//             new UpdateCommand({
//                 TableName: TABLE_NAME,
//                 Key: { categoryId: req.params.id },
//                 UpdateExpression: "SET #n = :n, description = :d",
//                 ExpressionAttributeNames: { "#n": "name" },
//                 ExpressionAttributeValues: { ":n": name, ":d": description }
//             })
//         );
//         res.redirect("/categories");
//     } catch (err) {
//         console.error("❌ Lỗi cập nhật category:", err);
//         res.status(500).send("Cập nhật thất bại");
//     }
// });
//
// /* ===================== DELETE CATEGORY ===================== */
// router.get("/delete/:id", async (req, res) => {
//     try {
//         const catId = req.params.id;
//         const UNCATEGORIZED_ID = "uncategorized";
//
//         // Logic update sản phẩm cũ
//         const productsToUpdate = await dynamoDB.send(
//             new ScanCommand({
//                 TableName: "products",
//                 FilterExpression: "categoryId = :c",
//                 ExpressionAttributeValues: { ":c": catId }
//             })
//         );
//
//         if (productsToUpdate.Items && productsToUpdate.Items.length > 0) {
//             const updatePromises = productsToUpdate.Items.map((product) =>
//                 dynamoDB.send(
//                     new UpdateCommand({
//                         TableName: "products",
//                         Key: { id: product.id },
//                         UpdateExpression: "SET categoryId = :u",
//                         ExpressionAttributeValues: { ":u": UNCATEGORIZED_ID }
//                     })
//                 )
//             );
//             await Promise.all(updatePromises);
//         }
//
//         // Xóa category
//         await dynamoDB.send(
//             new DeleteCommand({
//                 TableName: TABLE_NAME,
//                 Key: { categoryId: catId }
//             })
//         );
//         res.redirect("/categories");
//     } catch (err) {
//         console.error("❌ Lỗi xóa category:", err);
//         res.status(500).send("Xóa danh mục thất bại");
//     }
// });
//
// export default router;

import express from "express";
import { CategoryController } from "../controllers/category.controller.js";
// Nếu muốn bảo vệ routes này bằng login, import middleware ở đây
// import { requireLogin, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===================== ROUTES ===================== */

// Danh sách
router.get("/", CategoryController.index);

// Thêm mới
router.get("/add", CategoryController.showAddForm);
router.post("/add", CategoryController.create);

// Chỉnh sửa
router.get("/edit/:id", CategoryController.showEditForm);
router.post("/edit/:id", CategoryController.update);

// Xóa
router.get("/delete/:id", CategoryController.delete);

export default router;