import dotenv from "dotenv";
import path from "node:path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDB from "./dynamodb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 Load .env từ root project
dotenv.config({
    path: path.resolve(__dirname, "..", ".env")
});

console.log("🚀 Đang khởi chạy Seed dữ liệu...");
console.log("📍 REGION:", process.env.AWS_REGION);

// 📦 Xác định đường dẫn file dữ liệu
const productsPath = path.join(__dirname, "..", "data", "products_to_import.json");
const categoriesPath = path.join(__dirname, "..", "data", "categories_to_import.json");

// Đọc dữ liệu
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));

async function importData(tableName, dataArray) {
    console.log(`--- Đang nhập dữ liệu vào bảng: ${tableName} ---`);
    for (const item of dataArray) {
        try {
            await dynamoDB.send(
                new PutCommand({
                    TableName: tableName,
                    Item: item
                })
            );
            console.log(`✅ Thành công: ${item.name || item.categoryId}`);
        } catch (err) {
            console.error(`❌ Lỗi tại ${item.name || item.categoryId}:`, err.message);
        }
    }
}

// Chạy nhập dữ liệu cho cả 2 bảng
async function run() {
    await importData("products", products); // Đảm bảo TableName khớp trên AWS
    await importData("categories", categories);
    console.log("✨ Tất cả dữ liệu đã được nạp thành công!");
}

run();