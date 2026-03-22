const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục public/uploads nếu chưa có
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Hàm hỗ trợ xóa ảnh cũ (Dùng để lấy điểm cộng)
const deleteLocalFile = (fileUrl) => {
  if (!fileUrl) return;
  const filePath = path.join(__dirname, "../public", fileUrl);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.log("Lỗi xóa file:", err);
    }
  }
};

// 🔥 QUAN TRỌNG NHẤT: Bắt buộc phải export dạng object có dấu {}
module.exports = { upload, deleteLocalFile };