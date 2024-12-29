import dotenv from "dotenv";

dotenv.config();
//它表示从当前模块中导出一个默认值，供其他模块使用。
export default {
  PORT: process.env.PORT || 6000,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost/amazona", //MongoDB 会默认连接到 localhost:27017
  JWT_SECRET: process.env.JWT_SECRET || "somethingsecret",
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "sb", //PayPal 的客户端 ID，用于与 PayPal 集成。默认值为 sb（通常表示 sandbox 测试模式）。用途：配置支付网关。
  accessKeyId: process.env.accessKeyId || "accessKeyId", //AWS 服务的访问密钥 ID。
  secretAccessKey: process.env.secretAccessKey || "secretAccessKey", //AWS 服务的访问密钥。
};
