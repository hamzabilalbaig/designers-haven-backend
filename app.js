const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/users.routes");
const itemRoutes = require("./routes/items.routes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/items", itemRoutes);

app.get("/", (req, res) => res.send("Memorii APIs is running!"));

module.exports = app;
