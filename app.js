const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/users.routes");
const productRoutes = require("./routes/products.routes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => res.send("Designer Haven APIs is running!"));

module.exports = app;
