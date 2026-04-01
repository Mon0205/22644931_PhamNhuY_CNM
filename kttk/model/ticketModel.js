const { dynamo } = require("../config/aws");
const TABLE = "EventTickets";

exports.getAll = async () => {
  const data = await dynamo.scan({ TableName: TABLE }).promise();
  return data.Items;
};

exports.getByticketId = async (id) => {
  const data = await dynamo
    .get({
      TableName: TABLE,
      Key: { ticketId: id },
    })
    .promise();
  return data.Item;
};

exports.search = async (keyword) => {
  const params = {
    TableName: TABLE,
    FilterExpression: "contains(eventName, :kw) OR contains(holderName, :kw)",
    ExpressionAttributeValues: {
      ":kw": keyword
    }
  };

  const data = await dynamo.scan(params).promise();
  return data.Items;
};


exports.create = async (item) => {
  await dynamo
    .put({
      TableName: TABLE,
      Item: item,
    })
    .promise();
};

exports.update = async (id, data) => {
  let updateExp = `
    set eventName=:e,
        holderName=:h,
        category=:c,
        quantity=:q,
        pricePerTicket=:p,
        totalAmount=:t,
        finalAmount=:f
  `;

  let attrValues = {
    ":e": data.eventName,
    ":h": data.holderName,
    ":c": data.category,
    ":q": data.quantity,
    ":p": data.pricePerTicket,
    ":t": data.totalAmount,
    ":f": data.finalAmount,
  };

  // 👉 CHỈ thêm nếu có ảnh
  if (data.imgUrl) {
    updateExp += ", imgUrl=:img";
    attrValues[":img"] = data.imgUrl;
  }

  await dynamo
    .update({
      TableName: TABLE,
      Key: { ticketId: id },
      UpdateExpression: updateExp,
      ExpressionAttributeValues: attrValues,
    })
    .promise();
};

exports.delete = async (id) => {
  await dynamo
    .delete({
      TableName: TABLE,
      Key: { ticketId: id },
    })
    .promise();
};
