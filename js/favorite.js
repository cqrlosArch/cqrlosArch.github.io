import {
  confirmUser,
  getItemLS,
  removeFavoriteLS,
  setItemLS,
} from "./services/localstorage.js";
import { getMovie } from "./services/apiOMDb.js";

import { modalMovieActive } from "./services/modalMovie.js";

const d = document;

const $user_name = d.querySelector(".user_logged");
const $listMoviesFav = d.querySelector(".list__favorites");

let userLogged = JSON.parse(sessionStorage.getItem("currentUser"));

//Crea listado de favoritos del usuario almacenado el localstorage
const createListFavorites = async () => {
  const user = await JSON.parse(getItemLS(userLogged.id));
  $listMoviesFav.innerHTML = "";
  const favs = user.favorites;
  const $fragment = d.createDocumentFragment();
  for (const favId of favs) {
    const movie = await getMovie(favId);
    const $divMovie = d.createElement("article");
    $divMovie.classList.add("movie_container");
    $divMovie.innerHTML = `
  <div class="container_img">
  <img src="${
    movie.Poster !== "N/A" ? movie.Poster : "images/not_found.png"
  }" loading="lazy"  alt="${movie.Title}" class="movie_img">
  <span class="details_movie" data-imdb_id="${movie.imdbID}">See more...</span>
</div>
 <div class="movie_body">
    <h4 class="movie_title">${movie.Title} [${movie.Year}]</h4>
    <span class="movie_favorite fav" data-imdb_id="${
      movie.imdbID
    }">&#9733;</span>
 </div>
`;
    $fragment.appendChild($divMovie);
  }
  $listMoviesFav.appendChild($fragment);
};

//Elimina favorito del listado selecionado por el usuario
const deleteFavorite = async (fav) => {
  const $listFav = d.querySelectorAll(fav);
  $listFav.forEach((fav) => {
    d.addEventListener("click", (e) => {
      if (e.target === fav) {
        setItemLS(
          userLogged.id,
          JSON.stringify({
            ...userLogged,
            favorites: removeFavoriteLS(e.target.dataset.imdb_id),
          })
        );

        const user = getItemLS(userLogged.id);
        userLogged = JSON.parse(user);
        sessionStorage.setItem("currentUser", JSON.stringify(userLogged));
        updateList();
      }
    });
  });
};

//Actualiza lista de favoritos
const updateList = async () => {
  await createListFavorites();
  deleteFavorite(".movie_favorite");
  modalMovieActive(".details_movie", ".modal__movie");
};

//Incio. Boton regreso a Inicio y Usuario Logeado
const init = async () => {
  const $btnBack = d.querySelector(".nav__icon");
  d.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target === $btnBack) {
      window.location.replace("/index.html");
    }
  });
  if (userLogged) {
    $user_name.textContent = `${userLogged.username}`;
  }
};

d.addEventListener("DOMContentLoaded", async () => {
  confirmUser();
  init();
  await updateList();
});
