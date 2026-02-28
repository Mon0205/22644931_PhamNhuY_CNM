import dynamoDB from "../db/dynamodb.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "orders";

export const OrderRepo = {
    create: async (orderItem) => {
        await dynamoDB.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: orderItem
        }));
        return orderItem;
    }
};