import "dotenv/config";
import s3 from "./db/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: "debug/test.txt",
    Body: "S3 OK"
}));

console.log("✅ S3 UPLOAD OK");
