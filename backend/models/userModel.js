import mongoose from "mongoose";
//在 Mongoose 中，Schema 用于定义数据模型的结构。
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    dropDups: true, //dropDups: true：在创建唯一索引时，MongoDB 会删除重复的值，因此如果插入重复的 email，将会删除旧的重复记录（仅在设置唯一索引时有效）。
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

const userModel = mongoose.model("User", userSchema); //mongoose.model('User', userSchema) 创建了一个与 userSchema 结构相对应的模型，并将其命名为 User。你可以通过这个模型在应用程序中对 MongoDB 数据库中的 User 集合进行操作

export default userModel;
