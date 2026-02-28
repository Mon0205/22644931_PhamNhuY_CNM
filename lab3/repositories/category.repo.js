import dynamoDB from "../db/dynamodb.js";
import { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
const TABLE_NAME = "categories";
export const CategoryRepo = {

    getAll: async () => {
        const result = await dynamoDB.send(new ScanCommand({ TableName: "categories" }));
        return result.Items || [];
    },

    // Lấy 1 category
    getById: async (id) => {
        const result = await dynamoDB.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { categoryId: id }
        }));
        return result.Item;
    },

    // Tạo mới
    create: async (item) => {
        await dynamoDB.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        }));
        return item;
    },

    // Cập nhật
    update: async (id, name, description) => {
        await dynamoDB.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { categoryId: id },
            UpdateExpression: "SET #n = :n, description = :d",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":n": name, ":d": description }
        }));
    },

    // Xóa
    delete: async (id) => {
        await dynamoDB.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { categoryId: id }
        }));
    }
};