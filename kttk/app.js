require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const routes = require("./route/ticketRouter");
app.use("/", routes);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});