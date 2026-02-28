import { v4 as uuidv4 } from "uuid";
import dynamoDB from "../db/dynamodb.js";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "productLogs";

export const LogRepo = {
    // Ghi log mới
    create: async (productId, action, userId) => {
        try {
            const logId = uuidv4();
            const time = new Date().toISOString();

            await dynamoDB.send(new PutCommand({
                TableName: TABLE_NAME,
                Item: { logId, productId, action, userId, time }
            }));
        } catch (err) {
            console.error("❌ Failed to create log:", err);
        }
    },

    // Lấy tất cả log
    getAll: async () => {
        const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
        const logs = result.Items || [];
        // Sắp xếp log mới nhất lên đầu
        return logs.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
};