const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/users.routes");
const productRoutes = require("./routes/products.routes");
const uploadRoutes = require("./routes/upload.routes");

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/aws", uploadRoutes);

app.get("/", (req, res) => res.send("Designer Haven APIs is running!"));

module.exports = app;
