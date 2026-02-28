import dynamoDB from "../db/dynamodb.js";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "users";

export const UserRepo = {
    // Tìm user bằng username
    // (Lưu ý: Thực tế nên dùng GSI để query thay vì Scan để tối ưu hiệu năng)
    findByUsername: async (username) => {
        const result = await dynamoDB.send(new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "username = :u",
            ExpressionAttributeValues: { ":u": username }
        }));
        // Trả về user đầu tiên tìm thấy hoặc null
        return result.Items && result.Items.length > 0 ? result.Items[0] : null;
    },

    // Tạo user mới
    create: async (userItem) => {
        await dynamoDB.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: userItem
        }));
        return userItem;
    },
    // Lấy tất cả users (Dùng để map tên trong trang Logs)
    getAll: async () => {
        const result = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
        return result.Items || [];
    }
};