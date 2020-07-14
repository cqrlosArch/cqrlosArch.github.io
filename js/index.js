import { getMovies } from "./services/apiOMDb.js";
import {
  setItemLS,
  compareFavoritesItemLS,
  getItemLS,
  confirmUser,
  removeFavoriteLS,
  favSavedUser,
} from "./services/localstorage.js";

import {modalMovieActive} from './services/modalMovie.js'

const d = document;
const $user_name = d.querySelector(".user_logged");
const $inputSearch = d.querySelector(".searchOMDB__input");
const $resultOMDB = d.querySelector(".resultOMDB");


let userLogged = JSON.parse(sessionStorage.getItem("currentUser"));

//Confirma que el usuario ha sido logeado
confirmUser();

//Verifica datos introducidos en el formulario de busqueda
const formSeach = () => {
  if ($inputSearch) {
    if (sessionStorage.getItem("currentUser"))
      $inputSearch.removeAttribute("disabled");
    d.addEventListener("keyup", async (e) => {
      e.preventDefault();
      let movies;
      if (e.target === $inputSearch && e.target.value.length < 3) {
        movies = [];
        createListCardsMovie(movies);
      }
      if (e.target === $inputSearch && e.target.value.length >= 3) {
        movies = await getMovies(e.target.value);
        createListCardsMovie(movies);
      }
    });
  }
};

//Crea listado de palicualas encontradas
const createListCardsMovie = (movies) => {
  const $fragment = d.createDocumentFragment();
  $resultOMDB.innerHTML = "";
  movies.forEach((movie) => {
    const $movie_container = d.createElement("article");
    $movie_container.classList.add("movie_container");
    $movie_container.innerHTML = `
       <div class="container_img">
         <img src="${
           movie.Poster !== "N/A" ? movie.Poster : "images/not_found.png"
         }" loading="lazy"  alt="${movie.Title}" class="movie_img">
         <span class="details_movie" data-imdb_id="${
           movie.imdbID
         }">See more...</span>
       </div>
        <div class="movie_body">
           <h4 class="movie_title">${movie.Title} [${movie.Year}]</h4>
           <span class="movie_favorite ${favSavedUser(
             movie.imdbID
           )}" data-imdb_id="${movie.imdbID}">&#9733;</span>
        </div>
      `;
    $fragment.appendChild($movie_container);
  });
  $resultOMDB.appendChild($fragment);
  modalMovieActive(".details_movie", ".modal__movie");
  addMovieFavorites();
};


//Añade o elimina de favoritos las películas selecionadas
const addMovieFavorites = () => {
  const $iconsFavorites = d.querySelectorAll(".movie_favorite");

  $iconsFavorites.forEach((icon) => {
    d.addEventListener("click", (e) => {
      if (e.target === icon) {
        if (!compareFavoritesItemLS(e.target.dataset.imdb_id)) {
          e.target.classList.add("fav","select");
          setItemLS(
            userLogged.id,
            JSON.stringify({
              ...userLogged,
              favorites: userLogged.favorites.concat(e.target.dataset.imdb_id),
            })
          );
        } else {
          e.target.classList.remove("fav");
          setItemLS(
            userLogged.id,
            JSON.stringify({
              ...userLogged,
              favorites: removeFavoriteLS(e.target.dataset.imdb_id),
            })
          );
        }
        const user = getItemLS(userLogged.id);
        userLogged = JSON.parse(user);
        sessionStorage.setItem("currentUser", JSON.stringify(userLogged));
      }
    });
  });
};

//Cierre sesión
const logout = () => {
  const $logout = d.querySelector(".user_logout");
  $logout.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("currentUser");
    $user_name.innerHTML = "";
    $inputSearch.value = "";
    $resultOMDB.innerHTML = "";
    confirmUser();
  });
};

//Enlace a la página de favoritos
const favoritesPage = () => {
  const $linkFavorites = d.querySelector(".user_favorites ");
  $linkFavorites.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.replace("/favorites.html");
  });
};

//Usuario logeado
const init = () => {
  if (userLogged) {
    $user_name.insertAdjacentText('beforeend',`${userLogged.username}`)
  }
};

d.addEventListener("DOMContentLoaded", () => {
  confirmUser();
  init();
  formSeach();
  logout();
  favoritesPage();
});
