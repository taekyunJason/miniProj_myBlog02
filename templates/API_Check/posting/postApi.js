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

      let postTitle = `<input class="form-control" type="text" placeholder=${title}  ></input>`;
      let postContent = `<input class="form-control" type="text" placeholder=${content}  ></input>`;

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
      let rows = response;
      console.log(rows);

      let title = rows["title"];
      let content = rows["content"];
      let id = rows["id"];
      let date = rows["date"].split("T")[0];
      console.log(title, content);

      let postTitle = `<input class="form-control" type="text" placeholder=${title}  ></input>`;
      let postContent = `<input class="form-control" type="text" placeholder=${content}  ></input>`;

      $("#inputText").append(postTitle);
      $("#inputContent").append(postContent);
    },
  });
}

function moveToModify() {
  window.location.href = "/modify";
}

function modifyPost() {}

function deletePost() {}
