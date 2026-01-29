// routes/product.routes.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import upload from "../upload.js";

import dynamoDB from "../db/dynamodb.js";
import s3 from "../db/s3.js";

import {
    PutCommand,
    ScanCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";

import {
    PutObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";

const router = express.Router();

/* ===================== ADD PRODUCT ===================== */

// form thêm
router.get("/add", (req, res) => {
    res.render("add");
});

// xử lý thêm
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.send("❌ Chưa chọn ảnh");
        }

        const id = uuidv4();
        const name = req.body.name;
        const price = Number(req.body.price);
        const quantity = Number(req.body.quantity);

        if (Number.isNaN(price) || Number.isNaN(quantity)) {
            return res.send("❌ Giá hoặc số lượng không hợp lệ");
        }

        // key ảnh trong S3
        const imageKey = `products/${id}-${req.file.originalname}`;

        // upload ảnh lên S3
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: imageKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            })
        );

        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;

        // lưu DynamoDB
        await dynamoDB.send(
            new PutCommand({
                TableName: "Products",
                Item: {
                    id,
                    name,
                    price,
                    quantity,
                    url_image: imageUrl
                }
            })
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Upload thất bại");
    }
});

/* ===================== LIST PRODUCTS ===================== */

router.get("/", async (req, res) => {
    const result = await dynamoDB.send(
        new ScanCommand({ TableName: "Products" })
    );
    res.render("products", { products: result.Items });
});

/* ===================== EDIT PRODUCT ===================== */

router.get("/edit/:id", async (req, res) => {
    const result = await dynamoDB.send(
        new GetCommand({
            TableName: "Products",
            Key: { id: req.params.id }
        })
    );
    res.render("edit", { product: result.Item });
});

router.post("/edit/:id", async (req, res) => {
    const { name, price, quantity } = req.body;

    await dynamoDB.send(
        new UpdateCommand({
            TableName: "Products",
            Key: { id: req.params.id },
            UpdateExpression: "SET #n=:n, price=:p, quantity=:q",
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ExpressionAttributeValues: {
                ":n": name,
                ":p": Number(price),
                ":q": Number(quantity)
            }
        })
    );

    res.redirect("/");
});

/* ===================== DELETE PRODUCT ===================== */

router.get("/delete/:id", async (req, res) => {
    // lấy sản phẩm
    const data = await dynamoDB.send(
        new GetCommand({
            TableName: "Products",
            Key: { id: req.params.id }
        })
    );

    // xoá ảnh trên S3
    const key = data.Item.url_image.split(".com/")[1];

    await s3.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        })
    );

    // xoá DynamoDB
    await dynamoDB.send(
        new DeleteCommand({
            TableName: "Products",
            Key: { id: req.params.id }
        })
    );

    res.redirect("/");
});

export default router;
