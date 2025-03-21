import express from "express";
import path from "path";
import mongoose from "mongoose";
//用来解析 HTTP 请求体（body）
import bodyParser from "body-parser";

import config from "./config.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import { fileURLToPath } from "url";
/**
 *  这段代码的作用是：

    使用 import.meta.url 获取当前模块的 URL。
    使用 fileURLToPath 将 URL 转换为文件路径。
    使用 path.dirname() 获取该文件的目录路径。
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

//Express 提供了简单的方法来创建 HTTP 服务器，处理请求和返回响应。
const app = express();
/**
 *  当客户端发送一个请求时，如果请求体是 JSON 格式（即 Content-Type: application/json），express.json() 会：
    检查请求的 Content-Type。
    如果是 application/json，将请求体的 JSON 数据解析为 JavaScript 对象。
    将解析后的数据存储在 req.body 中。
    如果请求体无法被解析（例如无效的 JSON 格式），会返回错误并终止请求。
    对于所有 /api/* 路径的请求，只要请求体是 JSON 格式，它们的内容都会被 body-parser 解析并存储在 req.body 中，然后由相应的路由来处理。
 */
app.use(bodyParser.json());
app.use("/api/uploads", uploadRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.get("/api/config/paypal", (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});
app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));
app.use(express.static(path.join(__dirname, "/../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});
//export NODE_OPTIONS=--openssl-legacy-provider
app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});
