$(document).ready(function () {
  // Load header trước
  $.get("../components/header.html")
    .done(function (headerHtml) {
      $("body").prepend(headerHtml);

      // Sau khi header load xong → load banner
      $.get("../components/banner.html")
        .done(function (bannerHtml) {
          $("body").append(bannerHtml);

          // Sau khi banner load xong → load footer
          $.get("../components/footer.html")
            .done(function (footerHtml) {
              $("body").append(footerHtml);
            })
            .fail(function () {
              console.error("Không tải được components/footer.html");
            });
        })
        .fail(function () {
          console.error("Không tải được components/banner.html");
        });
    })
    .fail(function () {
      console.error("Không tải được components/header.html");
    });
});

