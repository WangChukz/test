// NỘI DUNG ĐÃ SỬA LỖI
const apiKey = "c26e0428798f6283cfb9e9ee020f9623";
const baseImg = "https://image.tmdb.org/t/p/original";
const baseImgSmall = "https://image.tmdb.org/t/p/w500";

// Lấy id phim từ URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Lấy thông tin chi tiết phim
async function loadMovieDetail() {
  const container = document.getElementById("movie-detail");

  try {
    // XÓA BỎ API /reviews
    const [detailsRes, creditsRes, videosRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=vi-VN`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=vi-VN`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=vi-VN`
      ),
    ]);

    // Chuyển đổi kết quả sang JSON
    const data = await detailsRes.json();
    const creditsData = await creditsRes.json();
    // XÓA BỎ reviewsData
    const videosData = await videosRes.json();

    // Xử lý dữ liệu
    const director = creditsData.crew.find(
      (person) => person.job === "Director"
    );
    const cast = creditsData.cast.slice(0, 12); // Lấy nhiều diễn viên hơn
    // XÓA BỎ reviews
    const trailer = videosData.results.find(
      (video) => video.type === "Trailer"
    );
    const trailerKey = trailer ? trailer.key : null;

    // Xóa chữ "Đang tải..."
    container.innerHTML = "";
    
    // Tạo và chèn các phần tử HTML mới
    // Chèn phần Hero (ảnh + tiêu đề)
    container.appendChild(generateHeroSection(data, trailerKey));
    // Chèn phần nội dung chính (Sidebar + Tabs) - XÓA reviews khỏi tham số
    container.appendChild(generateMainContent(data, director, cast));
    
    // SAU KHI chèn HTML, GỌI HÀM đính kèm sự kiện click cho Tab
    initTabs();

  } catch (error) {
    container.innerHTML = `<p style="color: red;">Lỗi khi tải dữ liệu: ${error.message}</p><a href="index.html" class="back-btn">← Quay lại</a>`;
    console.error(error);
  }
}

// Hàm tạo section Hero (ảnh poster + thông tin) - Giữ nguyên
function generateHeroSection(data, trailerKey) {
  const section = document.createElement("div");
  section.className = "hero-container";

  if (data.backdrop_path) {
    section.style.backgroundImage = `linear-gradient(rgba(18, 18, 18, 0.85), rgba(18, 18, 18, 1)), url(${
      baseImg + data.backdrop_path
    })`;
  }

  const year = data.release_date
    ? new Date(data.release_date).getFullYear()
    : "N/A";

  section.innerHTML = `
    <div class="hero-content">
      <img src="${baseImgSmall + data.poster_path}" alt="${
    data.title
  }" class="hero-poster">
      <div class="hero-info">
        <h1>${data.title} (${year})</h1>
        <p class="hero-overview">${data.overview}</p>
        <div class="hero-actions">
          ${
            trailerKey
              ? `<a href="https://www.youtube.com/watch?v=${trailerKey}" target="_blank" class="play-btn">▶ Play Now</a>`
              : `<a href="#" class="play-btn disabled" title="Không có trailer">▶ Play Now</a>`
          }
          <a href="#" class="icon-btn" title="Chia sẻ">➢</a>
          <a href="#" class="icon-btn" title="Yêu thích">♥</a>
        </div>
      </div>
    </div>
  `;
  return section;
}

// ==========================================================
// HÀM TẠO NỘI DUNG CHÍNH (ĐÃ CẬP NHẬT HOÀN TOÀN)
// ==========================================================
function generateMainContent(data, director, cast) { // Xóa 'reviews' khỏi tham số
  const section = document.createElement("div");
  section.className = "main-content-wrapper";

  // Tạo HTML cho các thẻ tag (thể loại, phụ đề)
  const genresHTML = data.genres.map(g => `<span class="tag">${g.name}</span>`).join("");
  // Giả sử phụ đề, bạn có thể lấy từ API khác nếu có, ở đây tôi dùng tạm
  const subsHTML = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'].map(s => `<span class="tag">${s}</span>`).join("");

  // Tạo HTML cho đạo diễn
  const directorHTML = director
    ? `
    <div class="director">
      ${director.profile_path ? `<img src="${baseImgSmall + director.profile_path}" alt="${director.name}">` : ''}
      <p>
        ${director.name}
        <span>Đạo diễn</span>
      </p>
    </div>
    `
    : '<p>Không rõ</p>';
    
  // Tạo HTML cho diễn viên
  const castHTML = cast.map(person => `
      <div class="cast-member">
        <img src="${person.profile_path ? baseImgSmall + person.profile_path : "https://via.placeholder.com/100x150?text=N/A"}" alt="${person.name}">
        <p>${person.name}</p>
        <span>${person.character}</span>
      </div>
    `).join("");

  // TẠO DỮ LIỆU BÌNH LUẬN MÔ PHỎNG (MOCK COMMENTS)
  // Dùng link ảnh avatar ngẫu nhiên từ i.pravatar.cc
  const commentsHTML = `
    <div class="comment-list">
      <div class="comment-card">
        <img src="https://i.pravatar.cc/40?img=1" alt="avatar" class="comment-avatar">
        <div class="comment-body">
          <p class="comment-username">UIA</p>
          <p class="comment-text">trời ơi vai đầu tiên ổng diễn mà t khóc từ tập 1 sang tập 2</p>
        </div>
      </div>
      <div class="comment-card">
        <img src="https://i.pravatar.cc/40?img=5" alt="avatar" class="comment-avatar">
        <div class="comment-body">
          <p class="comment-username">Tống Tư Lệnh</p>
          <p class="comment-text">hình như là remake lại nội dung của bộ nào đấy cũng của Hàn thì phải, kiểu nội dung đổ oan giết người rồi hành trình tìm bằng chứng chứng minh cho bản thân vô tội nó cứ quen quen nha</p>
        </div>
      </div>
      <div class="comment-card">
        <img src="https://i.pravatar.cc/40?img=3" alt="avatar" class="comment-avatar">
        <div class="comment-body">
          <p class="comment-username">Wuan</p>
          <p class="comment-text">hình như đây là bản mở rộng phim rạp Thành Phố Ảo cũng do ji chang wook đóng</p>
        </div>
      </div>
       <div class="comment-card">
        <img src="https://i.pravatar.cc/40?img=7" alt="avatar" class="comment-avatar">
        <div class="comment-body">
          <p class="comment-username">Chris</p>
          <p class="comment-text">Phim hay vãi, plot twist căng đét. Xem cuốn thực sự.</p>
        </div>
      </div>
    </div>
  `;

  // Dựng toàn bộ cấu trúc Sidebar + Tab
  section.innerHTML = `
    <div class="sidebar-info">
      <div class="info-box">
        <h3>Năm sản xuất</h3>
        <p>${data.release_date ? new Date(data.release_date).getFullYear() : "N/A"}</p>
      </div>
      
      <div class="info-box">
        <h3>Phụ đề</h3>
        <div class="tag-list">${subsHTML}</div>
      </div>
      
      <div class="info-box">
        <h3>Đánh giá</h3>
        <div class="imdb-rating">
          <span>IMDb</span>
          <span class="stars">★★★★★</span>
          <p>${data.vote_average.toFixed(1)}</p>
        </div>
      </div>
      
      <div class="info-box">
        <h3>Thể loại</h3>
        <div class="tag-list">${genresHTML}</div>
      </div>
      
      <div class="info-box">
        <h3>Đạo diễn</h3>
        ${directorHTML}
      </div>
      
    </div> <div class="tab-content-area">
      <nav class="tab-nav">
        <button class="tab-link active" data-tab="gioi-thieu">Giới thiệu</button>
        <button class="tab-link" data-tab="dien-vien">Diễn viên</button>
        <button class="tab-link" data-tab="binh-luan">Bình luận</button>
      </nav>
      
      <div id="gioi-thieu" class="tab-panel active">
        <p class="overview-text">${data.overview}</p>
      </div>
      
      <div id="dien-vien" class="tab-panel">
        <div class="cast-grid">${castHTML}</div>
      </div>
      
      <div id="binh-luan" class="tab-panel">
        ${commentsHTML}
      </div>
    </div>
  `;
  return section;
}

// ==========================================================
// HÀM MỚI ĐỂ XỬ LÝ CLICK TAB
// ==========================================================
function initTabs() {
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabLinks.forEach(link => {
    link.addEventListener("click", () => {
      // Lấy tên tab từ data-tab (ví dụ: "dien-vien")
      const tabId = link.getAttribute("data-tab");

      // 1. Xóa class 'active' khỏi tất cả các nút
      tabLinks.forEach(btn => btn.classList.remove("active"));
      // 2. Thêm class 'active' cho nút vừa click
      link.classList.add("active");

      // 3. Ẩn tất cả các panel
      tabPanels.forEach(panel => panel.classList.remove("active"));
      // 4. Hiển thị panel tương ứng
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// Chạy hàm chính
loadMovieDetail();