require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports = { dynamo, s3 };