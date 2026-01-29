// app.js
import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express();

// view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// middleware
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/", productRoutes);

// server
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
    console.log("AWS REGION:", process.env.AWS_REGION);
    console.log("S3 BUCKET:", process.env.AWS_S3_BUCKET);
});
