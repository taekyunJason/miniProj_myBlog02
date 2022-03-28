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

      for (let i = 0; i < rows.length; i++) {
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
  $.ajax({
    type: "GET",
    url: "/posts",
    data: {},
    success: function (response) {
      let rows = response;

      for (let i = 0; i < rows.length; i++) {
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
