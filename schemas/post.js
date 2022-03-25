const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  comment: String,
  date: Date,
  number: Number,
});

postSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});
postSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("post", postSchema);
