// === JAVASCRIPT ĐÃ CẬP NHẬT ===

      const POSTER_DELAY_MS = 3000;
      const AUTOSLIDE_INTERVAL_MS = 20000;

      const titleEl = document.getElementById("bannerTitle");
      const descEl = document.getElementById("bannerDesc");
      const volumeIcon = document.getElementById("volume-icon");
      const bannerContainer = document.querySelector(".banner");
      const dotsContainer = document.querySelector(".dots");
      const contentEl = document.querySelector(".banner-content");
      const likeBtn = document.getElementById("like-btn");

      let current = 0;
      let allBanners = [];
      let slides = [];
      let videos = [];
      let dots = [];
      let activeVideoTimeout = null;
      let autoSlideTimeout = null;
      let isGloballyMuted = true;

      function updateSlide(index) {
        if (activeVideoTimeout) {
          clearTimeout(activeVideoTimeout);
          activeVideoTimeout = null;
        }
        if (autoSlideTimeout) {
          clearTimeout(autoSlideTimeout);
        }

        const bannerData = allBanners[index];
        titleEl.textContent = bannerData.title;
        descEl.textContent = bannerData.desc;

        slides.forEach((s, i) => s.classList.toggle("active", i === index));
        dots.forEach((d, i) => d.classList.toggle("active", i === index));

        contentEl.classList.remove("content-hidden");

        videos.forEach((video, i) => {
          video.pause();
          video.load();
          video.muted = isGloballyMuted;

          if (i === index) {
            activeVideoTimeout = setTimeout(() => {
              video.play();
              contentEl.classList.add("content-hidden");
            }, POSTER_DELAY_MS);
          }
        });

        likeBtn.classList.toggle("liked", bannerData.isLiked);

        startAutoSlide();
      }

      function startAutoSlide() {
        if (autoSlideTimeout) {
          clearTimeout(autoSlideTimeout);
        }
        autoSlideTimeout = setTimeout(() => {
          current = (current + 1) % allBanners.length;
          updateSlide(current);
        }, AUTOSLIDE_INTERVAL_MS);
      }

      function buildBannerUI() {
        const slideFragment = new DocumentFragment();
        const dotFragment = new DocumentFragment();

        allBanners.forEach((bannerData) => {
          const slide = document.createElement("div");
          slide.className = "banner-slide";

          const video = document.createElement("video");
          video.src = bannerData.videoUrl;
          video.poster = bannerData.posterUrl;
          video.muted = true;
          video.loop = true;
          video.playsinline = true;

          slide.appendChild(video);
          slideFragment.appendChild(slide);

          const dot = document.createElement("div");
          dot.className = "dot";
          dotFragment.appendChild(dot);
        });

        // === THAY ĐỔI TRONG JS ===
        // Chèn các slide VÀO TRƯỚC lớp mờ (.banner-fade)
        bannerContainer.insertBefore(
          slideFragment,
          document.querySelector(".banner-fade") // <-- Đảm bảo chèn đúng vị trí
        );
        dotsContainer.appendChild(dotFragment);

        slides = document.querySelectorAll(".banner-slide");
        videos = document.querySelectorAll(".banner-slide video");
        dots = document.querySelectorAll(".dot");
      }

      function updateVolumeIcon() {
        if (isGloballyMuted) {
          volumeIcon.classList.remove("fa-volume-high");
          volumeIcon.classList.add("fa-volume-xmark");
        } else {
          volumeIcon.classList.remove("fa-volume-xmark");
          volumeIcon.classList.add("fa-volume-high");
        }
      }

      function registerEventListeners() {
        document.querySelector(".nav-left").onclick = () => {
          current = (current - 1 + allBanners.length) % allBanners.length;
          updateSlide(current);
        };

        document.querySelector(".nav-right").onclick = () => {
          current = (current + 1) % allBanners.length;
          updateSlide(current);
        };

        document.getElementById("volume-btn").onclick = () => {
          isGloballyMuted = !isGloballyMuted;
          videos.forEach((video) => {
            video.muted = isGloballyMuted;
          });
          updateVolumeIcon();
        };

        likeBtn.addEventListener("click", () => {
          const currentBannerData = allBanners[current];
          currentBannerData.isLiked = !currentBannerData.isLiked;
          likeBtn.classList.toggle("liked", currentBannerData.isLiked);
        });
      }

      // === KHỞI CHẠY ===
      fetch("../data/moviebanner.json")
        .then((response) => response.json())
        .then((data) => {
          allBanners = data.map((banner) => ({
            ...banner,
            isLiked: false,
          }));

          buildBannerUI();
          registerEventListeners();
          updateSlide(0);
        })
        .catch((error) => {
          console.error("Lỗi tải file moviebanner.json:", error);
          bannerContainer.innerHTML = `<h2 style="text-align: center; padding: 50px;">Lỗi tải dữ liệu banner.</h2>`;
        });