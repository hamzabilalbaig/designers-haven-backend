const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/users.routes");
const productRoutes = require("./routes/products.routes");
const uploadRoutes = require("./routes/upload.routes");
const saleLogsRoutes = require("./routes/salelogs.routes");

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sale-logs", saleLogsRoutes);
app.use("/api/aws", uploadRoutes);

app.use("/slack/redirect", (req, res) => {
  const { code, state } = req.query;
  const encodedParams = new URLSearchParams({ code, state }).toString();
  const deeplink = `skillprofile://auth?${encodedParams}`;
  res.send(`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script>
          function isAndroid() {
            return /Android/i.test(navigator.userAgent);
          }
          window.onload = function () {
            if (isAndroid()) {
              document.getElementById("android-ui").style.display = "block";
            } else {
              window.location.href = "${deeplink}";
            }
          }
        </script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
              Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            background: #f7f7f7;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 90vh;
          }
          .container {
            text-align: center;
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 320px;
            width: 100%;
          }
          .app-icon {
            width: 72px;
            height: 72px;
            border-radius: 16px;
            margin-bottom: 16px;
          }
          .title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
          }
          .subtitle {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          a.button {
            display: inline-block;
            padding: 14px 24px;
            background: #4a154b;
            color: white;
            border-radius: 12px;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.2s ease;
          }
          a.button:hover {
            background: #3a0f3b;
          }
        </style>
      </head>
      <body>
        <div id="android-ui" class="container" style="display:none">
          <img src="https://firebasestorage.googleapis.com/v0/b/skillprofile-acea5.appspot.com/o/logo.png?alt=media&token=5120ebcd-5536-4975-854c-181bebc91b3c" alt="App Icon" class="app-icon" />
          <div class="title">Open SkillProfile</div>
          <div class="subtitle">Tap the button below to continue your sign-in.</div>
          <a class="button" href="${deeplink}">Back to SkillProfile</a>
        </div>
      </body>
    </html>
  `);
});

app.get("/", (req, res) => res.send("Designer Haven APIs is running!"));

module.exports = app;
