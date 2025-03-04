import mongoose from "mongoose";
//这是一个普通的javascript对象
const shippingSchema = {
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
};

const paymentSchema = {
  paymentMethod: { type: String, required: true },
};
//与 MongoDB 数据库直接关联，可以创建 Model（如 Shipping），并通过 Model 操作数据库（增删改查）。
const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  product: {
    //关联的商品对象，使用 MongoDB ObjectId 来引用另一数据表中的产品。它的 type 是 mongoose.Schema.Types.ObjectId，并且通过 ref: 'Product' 关联到 Product 模型
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema], //订单中所有商品项的数组，数组元素是 orderItemSchema，定义了一个订单项的结构。
    shipping: shippingSchema, //配送信息，引用了之前定义的 shippingSchema
    payment: paymentSchema,
    itemsPrice: { type: Number },
    taxPrice: { type: Number },
    shippingPrice: { type: Number },
    totalPrice: { type: Number },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
//使用 Mongoose 创建一个名为 Order 的 Model，基于 orderSchema 定义的结构。
//orderModel 是一个可以操作 MongoDB 中 orders 集合的工具，允许你创建、查询、更新和删除订单文档。
//完成从定义结构到数据库交互的桥梁。
const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;

/*
{
    "_id" : ObjectId("67b8397474065a1041a49d8c"),
    "isPaid" : false,
    "isDelivered" : false,
    "orderItems" : [
        {
            "_id" : ObjectId("67b8397474065a1041a49d8d"),
            "product" : ObjectId("67b8371b69a5ff0da7e00c49"),
            "name" : "Grey Pants",
            "image" : "/uploads/1740125969235.jpg",
            "price" : "77",
            "qty" : NumberInt(1)
        },
        {
            "_id" : ObjectId("67b8397474065a1041a49d8e"),
            "product" : ObjectId("67b8350469a5ff0da7e00c30"),
            "name" : "Classic Shirt",
            "image" : "/uploads/1740125409315.jpg",
            "price" : "79",
            "qty" : NumberInt(1)
        },
        {
            "_id" : ObjectId("67b8397474065a1041a49d8f"),
            "product" : ObjectId("67b836b369a5ff0da7e00c43"),
            "name" : "White Pants",
            "image" : "/uploads/1740125858171.jpg",
            "price" : "99.99",
            "qty" : NumberInt(1)
        }
    ],
    "user" : ObjectId("676beeaa05e70d0cfa7e67e7"),
    "shipping" : {
        "address" : "GuiYang,China",
        "city" : "Guiyang",
        "postalCode" : "54241",
        "country" : "China"
    },
    "payment" : {
        "paymentMethod" : "paypal"
    },
    "itemsPrice" : 255.99,
    "taxPrice" : 38.3985,
    "shippingPrice" : NumberInt(0),
    "totalPrice" : 294.3885,
    "createdAt" : ISODate("2025-02-21T08:29:40.496+0000"),
    "updatedAt" : ISODate("2025-02-21T08:29:40.496+0000"),
    "__v" : NumberInt(0)
}
 





*/
