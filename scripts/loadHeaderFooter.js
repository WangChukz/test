$(document)
  .ready(function () {
    // Load header trước
    $.get("../components/header.html")
      .done(function (headerHtml) {
        $("body").prepend(headerHtml);

        // Sau khi banner VÀ div phim đã xong → load footer
        $.get("../components/footer.html")
          .done(function (footerHtml) {
            // Footer sẽ được gắn vào cuối cùng
            $("body").append(footerHtml);
          })
          .fail(function () {
            console.error("Không tải được components/footer.html");
          });
      })
      .fail(function () {
        console.error("Không tải được components/header.html");
      });
  });
