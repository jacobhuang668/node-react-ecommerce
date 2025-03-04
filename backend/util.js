import jwt from "jsonwebtoken";
import config from "./config.js";
/*
const payload = { userId: 1, role: 'admin' };
const secretKey = 'your-secret-key';
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
*/
const getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    config.JWT_SECRET,
    {
      expiresIn: "48h",
    }
  );
};

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    //slice(start, end)：左闭右开
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: "Token is not supplied." });
  }
};

const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    /*
    next() 是 Express 的一个回调函数，表示当前中间件执行完毕，继续执行下一个中间件或路由处理函数。
    return next(); 确保 如果用户是管理员，就立即执行下一个中间件或路由处理函数，不再继续执行后面的代码。  
    */
    return next(); // 让请求继续执行下一个中间件或路由处理函数
  }
  return res.status(401).send({ message: "Admin Token is not valid." });
};

export { getToken, isAuth, isAdmin };

/*
1. Express 中间件（Middleware）的定义
定义：在 Express.js（一个流行的 Node.js Web 框架）中，中间件（middleware）是一系列函数，处理 HTTP 请求（req）和响应（res）之间的逻辑。它们可以在路由处理之前、之后或错误处理时执行。
核心功能：中间件可以执行以下操作：
解析请求体（如 JSON 或表单数据）。
验证身份（如认证和授权）。
日志记录（如请求时间、IP 地址）。
处理错误（如 404 或 500 错误）。
修改请求或响应（如添加自定义头信息）。
语法：中间件函数通常有以下签名：

(req, res, next) => {
  // 中间件逻辑
  next(); // 调用下一个中间件或路由
}
req：请求对象，包含客户端发送的数据（如 URL、头信息、参数）。
res：响应对象，用于发送响应给客户端（如 JSON 数据、HTML）。
next：函数，调用下一个中间件或路由，如果省略，请求处理会中断。


app.delete('/api/products/:id', isAuth, isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.send({ message: 'Product deleted successfully' });
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});
Express.js 按照 中间件的顺序 依次执行，所以执行顺序如下：
先执行 isAuth（验证用户身份，解析 JWT，获取 req.user）。
再执行 isAdmin（检查 req.user.isAdmin 是否为 true）。
最后执行 async (req, res)（执行删除商品的逻辑）。


DELETE /api/products/12345
Authorization: Bearer <token>

+-----------------------+
|  客户端发送请求       |
+-----------------------+
          |
          v
+-----------------------+
|  中间件1 (isAuth)     |   解析 JWT 令牌，提取用户信息到 req.user
+-----------------------+
          |
          | (调用 next())
          v
+-----------------------+
|  中间件2 (isAdmin)    |   检查 req.user.isAdmin 是否为 true
+-----------------------+
     |         |
  否 |         | 是
     v         v
+-----------------------+     +-----------------------+
|  返回 401 Unauthorized |     |  调用 next()        |
+-----------------------+     +-----------------------+
                                     |
                                     v
+-------------------------------+
|  最终路由处理 /api/products/:id |   删除商品
+-------------------------------+



*/
