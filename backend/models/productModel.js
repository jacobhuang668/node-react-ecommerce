import mongoose from "mongoose";
//
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 }, //等级
    comment: { type: String, required: true },
  },
  {
    timestamps: true, //timestamps: true： Mongoose 会自动为每条记录添加 createdAt 和 updatedAt 时间戳字段，这两个字段将自动保存记录的创建和更新时间
  }
);
const prodctSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  category: { type: String, required: true },
  countInStock: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0, required: true },
  numReviews: { type: Number, default: 0, required: true },
  reviews: [reviewSchema], //reviews 字段是一个数组，数组中的每一项都遵循 reviewSchema，也就是每个产品都有一个评论列表，评论结构包含 name、rating 和 comment 等字段。
});

const productModel = mongoose.model("Product", prodctSchema);

export default productModel;
