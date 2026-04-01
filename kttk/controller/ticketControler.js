const crypto = require("crypto");
const model = require("../model/ticketModel");
const { s3 } = require("../config/aws");
const { log } = require("console");

// LIST + SEARCH
exports.index = async (req, res) => {
  const tickets = await model.getAll();
  res.render("index", { tickets });
};

exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let tickets;

  if (keyword) {
    tickets = await model.search(keyword);
  } else {
    tickets = await model.getAll();
  }

  res.render("index", { tickets, keyword });
};


// FORM CREATE
exports.createForm = (req, res) => {
  res.render("add");
};

// CREATE
exports.create = async (req, res) => {
    const {
      eventName,
      holderName,
      category,
      quantity,
      pricePerTicket,
      eventDate,
      status,
    } = req.body;

    // VALIDATION
    if (quantity <= 0 || pricePerTicket <= 0) throw "Invalid number";

    if (new Date(eventDate) < new Date()) throw "Invalid date";

    const validCategory = ["Standard", "VIP", "VVIP"];
    if (!validCategory.includes(category)) throw "Invalid category";

    // IMAGE từ multer-s3
    const imgUrl = req.file ? req.file.location : "";

    // BUSINESS
    const totalAmount = quantity * pricePerTicket;
    let finalAmount = totalAmount;

    if (category === "VIP" && quantity >= 4) finalAmount *= 0.9;

    if (category === "VVIP" && quantity >= 2) finalAmount *= 0.85;

    await model.create({
      ticketId: crypto.randomUUID(),
      eventName,
      holderName,
      category,
      quantity: Number(quantity),
      pricePerTicket: Number(pricePerTicket),
      eventDate,
      status,
      imgUrl,
      totalAmount,
      finalAmount,
      createdAt: new Date().toISOString(),
    });

    res.redirect("/");
};

// DETAIL
exports.detail = async (req, res) => {
  const ticket = await model.getByticketId(req.params.ticketId);
  res.render("detail", { ticket });
};

// DELETE
exports.delete = async (req, res) => {
  const ticketId = req.params.ticketId;

  const ticket = await model.getByticketId(ticketId);

  if (ticket && ticket.imgUrl) {
    try {
      const key = ticket.imgUrl.split("/").pop();

      await s3
        .deleteObject({
          Bucket: process.env.BUCKET,
          Key: key,
        })
        .promise();

      console.log("Deleted image:", key);
    } catch (err) {
      console.log("S3 delete error:", err);
    }
  }

  await model.delete(ticketId);

  res.redirect("/");
};

// EDIT FORM
exports.editForm = async (req, res) => {
  const ticket = await model.getByticketId(req.params.ticketId);
  res.render("edit", { ticket });
};

// UPDATE
exports.update = async (req, res) => {
  const id = req.params.ticketId;

  const { eventName, holderName, category, quantity, pricePerTicket } = req.body;

  const qty = Number(quantity);
  const price = Number(pricePerTicket);

  // tính toán
  const totalAmount = qty * price;
  let finalAmount = totalAmount;

  if (category === "VIP" && qty >= 4) finalAmount *= 0.9;
  if (category === "VVIP" && qty >= 2) finalAmount *= 0.85;

  const updateData = {
    eventName,
    holderName,
    category,
    quantity: qty,
    pricePerTicket: price,
    totalAmount,
    finalAmount,
  };

  // nếu có upload ảnh mới thì update
  if (req.file) {
    updateData.imgUrl = req.file.location;
  }

  await model.update(id, updateData);
  
  res.redirect("/");
};
