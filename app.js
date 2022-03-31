const express = require("express");
const mongoose = require("mongoose");
const Post = require("./schemas/post");
const User = require("./schemas/user");
const Comment = require("./schemas/comment");
const jwt = require("jsonwebtoken");
const authMiddleWare = require("./templates/API_Check/authCheck/auth-middleware");

const token = jwt.sign({ test: true }, "my-secret-key");
//console.log(token);

const decode = jwt.verify(token, "my-secret-key");
// console.log(decode);

mongoose.connect("mongodb://localhost/prac_blog_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

// 미들웨어 로그 남기기 : 요청이 들어온 URL 출력하기

app.use("/", express.urlencoded({ extended: false }), router);
app.use(express.static("templates"));

//미들웨어를 붙이는데, /api로 접근하면 뒤에 있는 express.json()미들웨어로 json바디를 받을 수 있음,(body-parser)
//이후에 라우터도 사용함, 단순히 router.get에는 '/'로 경로가 정의되어 있지만,
//app.use에서 '/api'로 접근해야 사용이 가능하기 때문에 이렇게 작성해야만 라우터로 연결이 됨.
// app.use("/api", express.json(), router);

router.get("/", (req, res) => {
  console.log("로그인 화면입니다");
  const path = require("path");
  res.sendFile(path.join(__dirname + "/templates/loginAndSignUp.html"));
});

//회원가입,로그인 페이지 제외한 페이지에 접근시 get /users/me 경로로 접근!
router.get("/main", (req, res) => {
  console.log("메인 화면입니다");
  const path = require("path");
  res.sendFile(path.join(__dirname + "/templates/main.html"));
});

router.get("/post", (req, res) => {
  console.log("작성 화면입니다");
  const path = require("path");
  res.sendFile(path.join(__dirname + "/templates/post.html"));
});

router.get("/detail", (req, res) => {
  console.log("상세 화면입니다");
  const path = require("path");
  res.sendFile(path.join(__dirname + "/templates/detail.html"));
});

router.get("/modify", (req, res) => {
  console.log("편집 화면입니다");
  const path = require("path");
  res.sendFile(path.join(__dirname + "/templates/modify.html"));
});

router.post("/users", async (req, res) => {
  const { nickName, email, password, passwordConfirm } = req.body;

  // console.log(req.body);

  if (password !== passwordConfirm) {
    res.status(400).send({
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
    return;
  }

  const existUser = await User.find({
    $or: [{ email }, { nickName }],
  });
  if (existUser.length) {
    res.status(400).send({
      errorMessage: "이미 등록된 닉네임, 이메일입니다.",
    });
    return;
  }

  const user = new User({ email, nickName, password });
  await user.save();
  res.status(201).send({});
});

router.post("/auth", async (req, res) => {
  const { nickName, password } = req.body;

  const user = await User.findOne({ nickName, password }).exec();

  if (!user) {
    res.status(400).send({
      errorMessage: "입력된 정보가 잘못되었습니다.",
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, "my-secret-key");

  res.send({
    token,
  });
});

router.get("/users/me", authMiddleWare, async (req, res) => {
  const { user } = res.locals;

  res.send({
    user: {
      email: user.email,
      nickName: user.nickName,
    },
  });
});

router.post("/posts", async (req, res) => {
  const today = new Date();
  const date = today.toLocaleDateString();

  const { title, content } = req.body;

  const maxOrderPost = await Post.findOne().sort("-order").exec();
  let order = 1;

  if (maxOrderPost) {
    order = maxOrderPost.order + 1;
  }

  const postList = new Post({ title, content, order, date });
  await postList.save();

  res.send({ msg: "저장되었습니다!" });
});

router.get("/posts", async (req, res) => {
  // const postDetail = req;
  const postDetail = await Post.find({});

  res.json(postDetail);
});

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const [detail] = await Post.find({ _id: postId });
  const userId = res.locals.user._id;
  const nickName = res.locals.user.nickName;

  const commentList = await Comment.find({});

  res.json({ detail, commentList, userId, nickName });
});

router.put("/posts", async (req, res) => {
  const { title, content, dbId } = req.body;
  // console.log(title, content, dbId);
  const post_list = await Post.updateOne(
    { _id: dbId },
    { $set: { title, content } }
  );
  res.json(post_list);
});

router.delete("/posts", async (req, res) => {
  const { postId } = req.query;
  console.log(req.query);

  //db안에 있는 postId라는 키값을 가지고 있는 칼럼을 지우라는 코드
  //db에 존재하는 키값로 postId변수를 받아야 동작함.
  const detailInfo = await Post.deleteOne({ _id: postId });
  res.json({ msg: "삭제되었습니다." });
});

router.post("/comment/:postId", async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  // console.log(postId);

  await Comment.create({ comment, postId });
  // await commentList.save();

  res.send({ msg: "저장되었습니다!" });
});

// router.get("/comment", async (req, res) => {
//   const commentList = await Comment.find({});
//   console.log(commentList);
//   res.json(commentList);
// });

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});
