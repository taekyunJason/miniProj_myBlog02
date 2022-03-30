function post() {
  const title = $("#inputText").val();
  const content = $("#inputContent").val();
  console.log(title, content);

  $.ajax({
    type: "POST",
    url: "/posts",

    data: {
      title: title,
      content: content,
    },
    success: function (response) {
      console.log("포스팅되었습니다");
      alert(response["msg"]);
      document.location.href = "/main";
    },
  });
}

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

function getPostDetail() {
  let postId = new URLSearchParams(location.search).get("postId");
  console.log(postId);

  $.ajax({
    type: "GET",
    url: `/posts/${postId}`,
    contentType: "application/jsion",
    data: {},
    success: function (response) {
      let rows = response["detail"];
      console.log(rows);

      let title = rows["title"];
      let content = rows["content"];
      let id = rows["id"];
      let date = rows["date"].split("T")[0];
      console.log(title, content);

      let postTitle = `<input class="form-control" type="text" value=${title} aria-label="readonly input example" readonly ></input>`;
      let postContent = `<input class="form-control" type="text" value=${content} aria-label="readonly input example" readonly ></input>`;

      $("#inputText").append(postTitle);
      $("#inputContent").append(postContent);
    },
  });
}

function getPostDetailData() {
  let postId = new URLSearchParams(location.search).get("postId");
  console.log(postId);

  $.ajax({
    type: "GET",
    url: `/posts/${postId}`,
    contentType: "application/jsion",
    data: {},
    success: function (response) {
      let rows = response["detail"];
      console.log(rows);

      let title = rows["title"];
      let content = rows["content"];
      let id = rows["id"];
      let date = rows["date"].split("T")[0];
      console.log(title, content);

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
  getPostDetailData();
  fn_spread("editBtn");
}

function modifyPost(dbTitle, dbContent, dbId) {
  console.log(dbTitle, dbContent);
  console.log("수정되었습니다.");

  let title = $("#editedTitle").val();
  if (!title) {
    title = dbTitle;
  }
  let content = $("#editedContent").val();
  if (!content) {
    content = dbContent;
  }
  console.log(title, content);

  $.ajax({
    type: "PUT",
    url: "/posts",
    contentType: "application/json",
    data: JSON.stringify({
      title: title,
      content: content,
      dbId: dbId,
    }),
    success: function (response) {
      alert("수정되었습니다.");
      document.location.href = "/main";
    },
  });
}

function deletePost(id) {
  let postId = id;

  $.ajax({
    type: "DELETE",
    url: `/posts?postId=${postId}`, //쿼리형식

    contentType: "application/json",
    data: {}, //{} 안에 들어가는 데이터가 바디에 해당함

    success: function (response) {
      if (response["msg"]) {
        document.location.href = "/main";
      }
    },
  });
}
