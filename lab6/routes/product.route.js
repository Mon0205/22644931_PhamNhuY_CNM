const express = require("express");
const router = express.Router();

// THÀNH dòng này:
const ProductController = require("../controllers/index");
// Import middleware upload đã tạo ở bước trước
// Sửa thành dòng này:
const { upload } = require("../middleware/upload");

// --- CÁC ROUTE HIỂN THỊ GIAO DIỆN (GET) ---

// 1. Hiển thị danh sách sản phẩm ở trang đầu (Tiêu chí 3)
router.get("/", ProductController.getAll);

// 2. Hiển thị form Thêm sản phẩm
router.get("/create", ProductController.renderCreateForm);

// 3. Xem chi tiết sản phẩm (Tiêu chí 7)
router.get("/:id", ProductController.getOne);

// 4. Hiển thị form Sửa sản phẩm
router.get("/edit/:id", ProductController.renderEditForm);


// --- CÁC ROUTE XỬ LÝ DỮ LIỆU TỪ FORM (POST) ---

// 5. Xử lý Thêm sản phẩm (Tiêu chí 4)
// Chú ý: "url_image" phải trùng với thuộc tính name="url_image" trong thẻ <input type="file"> của file EJS
router.post("/create", upload.single("url_image"), ProductController.createProduct);

// 6. Xử lý Cập nhật sản phẩm (Tiêu chí 5)
// Người dùng có thể chọn ảnh mới hoặc không, multer vẫn xử lý được
router.post("/edit/:id", upload.single("url_image"), ProductController.updateProduct);

// 7. Xử lý Xóa sản phẩm (Tiêu chí 6)
router.post("/delete/:id", ProductController.deleteProduct);

module.exports = router;