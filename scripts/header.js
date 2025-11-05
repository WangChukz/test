// === JAVASCRIPT ĐÃ ĐƯỢC CẬP NHẬT ===

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const overlay = document.getElementById("overlay");
const input = searchBox.querySelector("input");
const menuLinks = document.querySelectorAll("#menu a");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

// === BẮT ĐẦU THAY ĐỔI ===

// Hàm trợ giúp để reset icon hamburger
function resetHamburgerStyles() {
  hamburger.classList.remove("active");
  const spans = hamburger.querySelectorAll("span");
  spans.forEach((s) => {
    s.style.transform = "";
    s.style.opacity = "1";
  });
}

// Hàm trợ giúp để quản lý overlay
function updateOverlay() {
  if (
    profileDropdown.classList.contains("open") ||
    searchBox.classList.contains("open") ||
    mobileMenu.classList.contains("open")
  ) {
    overlay.classList.add("show");
  } else {
    overlay.classList.remove("show");
  }
}

// === KẾT THÚC THAY ĐỔI ===

// Active menu
menuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    menuLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// Toggle search (Đã cập nhật)
searchBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = searchBox.classList.contains("open");

  // Đóng các cửa sổ khác
  profileDropdown.classList.remove("open");
  mobileMenu.classList.remove("open");
  resetHamburgerStyles();

  // Toggle (bật/tắt) chính nó
  if (isOpen) {
    searchBox.classList.remove("open");
  } else {
    searchBox.classList.add("open");
    input.focus();
  }

  updateOverlay(); // Cập nhật overlay
});

// Toggle profile dropdown (Đã cập nhật)
profileBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  // Đóng các cửa sổ khác
  searchBox.classList.remove("open");
  mobileMenu.classList.remove("open");
  resetHamburgerStyles();

  // Toggle chính nó
  profileDropdown.classList.toggle("open");

  updateOverlay(); // Cập nhật overlay
});

// Toggle hamburger (Đã cập nhật)
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();

  // Đóng các cửa sổ khác
  searchBox.classList.remove("open");
  profileDropdown.classList.remove("open");

  // Toggle chính nó
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("open");

  // Cập nhật animation
  const spans = hamburger.querySelectorAll("span");
  if (hamburger.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translateY(6px) translateX(7px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform =
      "rotate(-45deg) translateY(-3px) translateX(4px)";
  } else {
    resetHamburgerStyles(); // Dùng hàm trợ giúp
  }

  updateOverlay(); // Cập nhật overlay
});

// Overlay click (Đã cập nhật)
overlay.addEventListener("click", () => {
  profileDropdown.classList.remove("open");
  searchBox.classList.remove("open");
  mobileMenu.classList.remove("open");
  overlay.classList.remove("show");
  resetHamburgerStyles(); // Dùng hàm trợ giúp
});
