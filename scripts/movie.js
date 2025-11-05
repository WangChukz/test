const apiKey = "c26e0428798f6283cfb9e9ee020f9623";
const baseImg = "https://image.tmdb.org/t/p/w300";

async function loadMovies(endpoint, containerId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${apiKey}&language=vi-VN&page=1`
  );
  const data = await res.json();
  const container = document.getElementById(containerId);

  container.innerHTML = data.results
    .map(
      (movie) => `
    <div class="movie-card" onclick="goToDetail(${movie.id})">
      <img src="${baseImg + movie.poster_path}" alt="${movie.title}">
      <h4>${movie.title}</h4>
      <p>⭐ ${movie.vote_average.toFixed(1)} | ${movie.release_date}</p>
    </div>
  `
    )
    .join("");
}

function goToDetail(id) {
  window.location.href = `moviedetail.html?id=${id}`;
}

document.querySelectorAll(".carousel").forEach((carousel) => {
  const list = carousel.querySelector(".movie-list");
  carousel
    .querySelector(".prev")
    .addEventListener("click", () => (list.scrollLeft -= 400));
  carousel
    .querySelector(".next")
    .addEventListener("click", () => (list.scrollLeft += 400));
});

loadMovies("upcoming", "upcoming");
loadMovies("now_playing", "now_playing"); 
