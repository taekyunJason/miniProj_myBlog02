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
    contentType: "application/json",
    data: {},
    success: function (response) {
      let rows = response;
      console.log("rows : ", rows);

      for (let i = 0; i < rows.length; i++) {
        let title = rows[i]["title"];
        let date = rows[i]["date"];
        let;
      }
    },
  });
}
