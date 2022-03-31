function post() {
  const title = $("#inputText").val();
  const content = $("#inputContent").val();
  // console.log(title, content);

  $.ajax({
    type: "POST",
    url: "/posts",

    data: {
      title: title,
      content: content,
    },
    success: function (response) {
      // console.log("포스팅되었습니다");
      alert(response["msg"]);
      document.location.href = "/main";
    },
  });
}

//메인화면 포스트 리스트 데이터 받아오기
function getPostList() {
  $.ajax({
    type: "GET",
    url: "/posts",
    data: {},
    success: function (response) {
      let rows = response;

      console.log(rows);

      for (let i = rows.length - 1; i >= 0; i--) {
        let title = rows[i]["title"];
        let content = rows[i]["content"];
        let id = rows[i]["id"];
        let date = rows[i]["date"].split("T")[0];

        let temp_html = `<tr onClick="location.href='/detail?postId=${id}'">
                            <td>번호</td>
                            <td>${title}</td>
                            <td>사용자</td>
                            <td>${date}</td>
                            <td>조회수</td>
                        </tr>`;

        $("#postList").append(temp_html);
      }
    },
  });
}

//게시물 상세화면 데이터 받아오기
function getPostDetail() {
  let postId = new URLSearchParams(location.search).get("postId");

  $.ajax({
    type: "GET",
    url: `/posts/${postId}`,
    contentType: "application/json",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {},
    success: function (response) {
      //포스팅 데이터 리스트 받아오기
      let rows = response["detail"];
      //댓글 데이터 리스트 받아오기
      let commentRows = response["commentList"];

      //포스팅데이터 리스트업
      let title = rows["title"];
      let content = rows["content"];
      let id = rows["id"];
      let date = rows["date"].split("T")[0];
      //댓글데이터 리스트업
      let comment = commentRows["postId"];
      let userId = commentRows["userId"];
      let nickName = commentRows["nickName"];

      console.log(userId, nickName);

      let postTitle = `<input class="form-control" type="text" value=${title} aria-label="readonly input example" readonly ></input>`;
      let postContent = `<input class="form-control" type="text" value=${content} aria-label="readonly input example" readonly ></input>`;

      //화면에 포스팅데이터 뿌려주기
      $("#inputText").append(postTitle);
      $("#inputContent").append(postContent);

      let comment_html = ``;

      //댓글 갯수만큼 역순으로 뿌려주기
      for (let i = commentRows.length - 1; i >= 0; i--) {
        // console.log(typeof postId, typeof commentRows[i]["comment"]);
        // console.log(postId, commentRows[i]["comment"]);
        // console.log(postId === commentRows[i]["comment"]);
        //포스팅 아아디값이랑 댓글데이터의 포스트id값이랑 같을때 html에 집어넣기
        if (postId === commentRows[i]["postId"]) {
          comment_html += `<input class="form-control" type="text" value=${commentRows[i]["comment"]} aria-label="readonly input example" readonly ></input>`;
        }
      }

      $("#commentList").append(comment_html);
    },
  });
}

//상세화면 데이터 편집시 데이터 받아오기
function getPostDetailData() {
  let postId = new URLSearchParams(location.search).get("postId");

  $.ajax({
    type: "GET",
    url: `/posts/${postId}`,
    contentType: "application/jsion",
    data: {},
    success: function (response) {
      let rows = response["detail"];

      let title = rows["title"];
      let content = rows["content"];
      let id = rows["id"];
      let date = rows["date"].split("T")[0];

      let postTitle = `<input class="form-control" type="text" id="editedTitle" placeholder=${title}  ></input>`;
      let postContent = `<input class="form-control" type="text" id="editedContent" placeholder=${content}  ></input>`;
      let button = `<button type="button" id="modifyBtn" onClick="modifyPost('${title}','${content}','${id}')" class="btn btn-outline-primary">수정</button>
                    <button type="button" id="deltetBtn" onClick="deletePost('${id}')" class="btn btn-outline-danger">삭제</button>`;

      $("#inputText").append(postTitle);
      $("#inputContent").append(postContent);
      $("#editBtn").append(button);
    },
  });
}

function moveToModify() {
  $.ajax({
    type: "GET",
    url: "/posts",
    data: {},
    success: function (response) {
      let rows = response;

      for (let i = rows.length - 1; i >= 0; i--) {
        let title = rows[i]["title"];
        let content = rows[i]["content"];
        let id = rows[i]["id"];
        let date = rows[i]["date"].split("T")[0];

        let temp_html = `<tr onClick="location.href='/detail?postId=${id}'">
                            <td>번호</td>
                            <td>${title}</td>
                            <td>사용자</td>
                            <td>${date}</td>
                            <td>조회수</td>
                        </tr>`;
        $("#postList").append(temp_html);
      }
    },
  });
  getPostDetailData();
  fn_spread("editBtn");
}

function modifyPost(dbTitle, dbContent, dbId) {
  // console.log(dbTitle, dbContent);
  // console.log("수정되었습니다.");

  let title = $("#editedTitle").val();
  if (!title) {
    title = dbTitle;
  }
  let content = $("#editedContent").val();
  if (!content) {
    content = dbContent;
  }
  // console.log(title, content);

  $.ajax({
    type: "PUT",
    url: "/posts",
    data: {
      title: title,
      content: content,
      dbId: dbId,
    },
    success: function (response) {
      alert("수정되었습니다.");
      document.location.href = "/main";
    },
  });
}

function deletePost(id) {
  let postId = id;
  console.log(postId);

  $.ajax({
    type: "DELETE",
    url: `/posts?postId=${postId}`,
    contentType: "application/json",
    data: {}, //{} 안에 들어가는 데이터가 바디에 해당함

    success: function (response) {
      alert("삭제되었습니다.");
      document.location.href = "/main";
    },
  });
}

function leaveComment() {
  let postId = new URLSearchParams(location.search).get("postId");

  const comment = $("#inputComment").val();
  console.log(comment);

  $.ajax({
    type: "POST",
    url: `/comment/${postId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {
      comment: comment,
    },
    success: function (response) {
      // console.log("포스팅되었습니다");
      alert(response["msg"]);
      location.href = `/detail?postId=${postId}`;
    },
  });
}

function getComment() {
  $.ajax({
    type: "GET",
    url: "/comment",
    data: {},
    success: function (response) {
      let rows = response;
      console.log(rows);

      for (let i = rows.length - 1; i >= 0; i--) {
        let comment = rows[i]["comment"];

        let temp_html = `<input class="form-control" type="text" value=${comment} aria-label="readonly input example" readonly ></input>`;

        $("#commentList").append(temp_html);
      }
    },
  });
}
