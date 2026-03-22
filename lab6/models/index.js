const { dynamodb } = require("../utils/aws-helper"); // Import DynamoDB service
const { v4: uuidv4 } = require("uuid"); // Tạo unique ID

const tableName = "Products"; // Tên bảng theo yêu cầu đề bài

const ProductModel = {
  // Thêm sản phẩm mới
  createProduct: async (productData) => {
    const productId = uuidv4();
    const params = {
      TableName: tableName,
      Item: {
        id: productId,
        name: productData.name,
        price: Number(productData.price), // Đảm bảo lưu dưới dạng số
        unit_in_stock: Number(productData.unit_in_stock), // Đảm bảo lưu dưới dạng số
        url_image: productData.url_image, // Đường dẫn ảnh sau khi upload
      },
    };
    try {
      await dynamodb.put(params).promise();
      return { id: productId, ...productData };
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Lấy danh sách tất cả sản phẩm
  getProducts: async () => {
    const params = {
      TableName: tableName,
    };
    try {
      const products = await dynamodb.scan(params).promise();
      return products.Items;
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },

  // Cập nhật thông tin sản phẩm
  updateProduct: async (productId, productData) => {
    const params = {
      TableName: tableName,
      Key: {
        id: productId, // Chỉ cần dùng id làm partition key
      },
      UpdateExpression: "set #n = :name, #p = :price, #u = :unit_in_stock, #img = :url_image",
      ExpressionAttributeNames: {
        "#n": "name",
        "#p": "price",
        "#u": "unit_in_stock",
        "#img": "url_image",
      },
      ExpressionAttributeValues: {
        ":name": productData.name,
        ":price": Number(productData.price),
        ":unit_in_stock": Number(productData.unit_in_stock),
        ":url_image": productData.url_image,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const updatedProduct = await dynamodb.update(params).promise();
      return updatedProduct.Attributes;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (productId) => {
    const params = {
      TableName: tableName,
      Key: {
        id: productId, // Chỉ cần dùng id để xóa
      },
    };
    try {
      await dynamodb.delete(params).promise();
      return { id: productId };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Lấy chi tiết một sản phẩm (đã sửa từ query sang get cho tối ưu khóa chính)
  getProductById: async (productId) => {
    const params = {
      TableName: tableName,
      Key: {
        id: productId,
      },
    };
    try {
      const data = await dynamodb.get(params).promise();
      return data.Item; 
    } catch (error) {
      console.error("Error getting one product:", error);
      throw error;
    }
  },
  // Hàm lấy điểm cộng: Tìm kiếm sản phẩm theo tên
  searchProducts: async (keyword) => {
    const params = {
      TableName: tableName,
      // Dùng contains để tìm kiếm gần đúng (nhập "áo" sẽ ra "áo thun", "áo khoác"...)
      FilterExpression: "contains(#n, :keyword)", 
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":keyword": keyword,
      },
    };

    try {
      const data = await dynamodb.scan(params).promise();
      return data.Items;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      throw error;
    }
  },
};

module.exports = ProductModel;