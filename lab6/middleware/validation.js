// Regex hỗ trợ chữ cái (bao gồm tiếng Việt), số và khoảng trắng
const vnNameRegex = /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;

// Regex chỉ cho phép các con số (0-9)
const numberRegex = /^[0-9]+$/;

const checkEmpty = (payload) => {
    const { name, price, unit_in_stock } = payload;
    // Kiểm tra rỗng hoặc chưa nhập
    if (!name || price === "" || unit_in_stock === "") {
        return true;
    }
    return false;
};

module.exports = {
    validatePayload: (payload) => {
        const { name, price, unit_in_stock } = payload;
        const errors = [];

        if (checkEmpty(payload)) {
            errors.push("Vui lòng nhập đầy đủ Tên, Giá và Số lượng.");
        }

        if (name && !vnNameRegex.test(name.trim())) {
            errors.push("Tên sản phẩm không hợp lệ (không chứa ký tự đặc biệt).");
        }

        if (price && !numberRegex.test(price)) {
            errors.push("Giá sản phẩm phải là một số nguyên dương hợp lệ.");
        }

        if (unit_in_stock && !numberRegex.test(unit_in_stock)) {
            errors.push("Số lượng tồn kho phải là một số nguyên dương hợp lệ.");
        }

        if (errors.length > 0) {
            return errors;
        }

        return null; // Dữ liệu hoàn toàn hợp lệ
    },
};