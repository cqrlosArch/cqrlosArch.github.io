//Retorna value de localstorage segun Key
export function getItemLS(key) {
  return localStorage.getItem(key);
}
//Añade key/value de localstorage 
export function setItemLS(key, value) {
  localStorage.setItem(key, value);
}

//Retorna el [usuario] si ya existe en localstorage
export function compareItemLS({ username, password }) {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) !== "loglevel:webpack-dev-server") {
      let key = localStorage.key(i);
      const userLS = JSON.parse(localStorage.getItem(key));
      if (userLS.username === username && userLS.password === password) {
        return [userLS.id, userLS.username, userLS.password, userLS.favorites];
      }
    }
  }
}

//Retorna true/false si la pelicula favorita ya existe en el listado del usuario
export function compareFavoritesItemLS(imdb_id) {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  return user.favorites.some((fav) => fav === imdb_id);
}

//Retorna string-class
export function favSavedUser(imdb_id) {
 if(compareFavoritesItemLS(imdb_id)){
   return "fav"
 }else{
   return ""
 }
}

//Retorna [favoritos] despues de eliminar un item
export function removeFavoriteLS(imdb_id) {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const userLS = JSON.parse(localStorage.getItem(user.id));
  const newFav= userLS.favorites.filter((fav) => fav !== imdb_id);
  return newFav
 
}

//Comprueba si el usuario a iniciado sesión
export function confirmUser(){
  (function() { 
    if(!sessionStorage.getItem('currentUser')){
      document.location.href = "login.html";
    }
})();
}