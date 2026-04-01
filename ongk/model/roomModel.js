const { dynamo } = require("../config/aws");
const TABLE = "Room";
exports.getAll = async () => {
  const data = await dynamo.scan({ TableName: TABLE }).promise();
  return data.Items;
};

exports.getByroomId = async (id) => {
  const data = await dynamo
    .get({
      TableName: TABLE,
      Key: { roomId: id },
    })
    .promise();
  return data.Item;
};

exports.search = async (keyword) => {
  const params = {
    TableName: TABLE,
    FilterExpression: "contains(roomName, :kw) OR contains(#st, :kw)",
    ExpressionAttributeValues: { ":kw": keyword },
    ExpressionAttributeNames: {
      "#st": "status"   // 👈 alias cho status
    }
  };

  const data = await dynamo.scan(params).promise();
  return data.Items;
};

exports.delete = async(id)=>{
    await dynamo.delete({
        TableName: TABLE,
        Key:{roomId : id}
    }).promise();
}

exports.create = async(item)=>{
  await dynamo.put({
    TableName: TABLE,
    Item: item
  }).promise();
}
