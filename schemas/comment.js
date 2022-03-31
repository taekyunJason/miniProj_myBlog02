const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  name: String,
  commentId: String,
  comment: String,
  postId: String,
  userId: String,
  nickName: String,
});

// postSchema.virtual("postId").get(function () {
//   return this._id.toHexString();
// });
// commentSchema.set("toJSON", {
//   virtuals: true,
// });

module.exports = mongoose.model("comment", commentSchema);
