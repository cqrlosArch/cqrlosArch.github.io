import {setItemLS, compareItemLS} from './services/localstorage.js'
import {gId} from './services/IDgenerator.js'

let userLogged = JSON.parse(sessionStorage.getItem("currentUser"));

const d=document

//Pattern del formulario de Login
const regexUsername = RegExp("^[A-Za-z0-9_]{3,15}$");
const regexPassword = RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");

const $loginForm=d.querySelector(".modal__form")


//Login Usuario y verificación de los campos del formulario
const loginUser = () => {
    d.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target === $loginForm) {
        if (
          regexUsername.test(e.target.username.value) &&
          regexPassword.test(e.target.password.value)
        ) {
          const currentUser = {
            id: `${e.target.username.value}-${gId()}`,
            username: e.target.username.value,
            password: e.target.password.value,
            favorites: [],
          };
          if (!compareItemLS(currentUser)) {
            setItemLS(currentUser.id, JSON.stringify(currentUser));
            sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
            userLogged = currentUser;
          } else {
            const [id, username, password, favorites] = compareItemLS(
              currentUser
            );
            userLogged = {
              id,
              username,
              password,
              favorites,
            };
            sessionStorage.setItem("currentUser", JSON.stringify(userLogged));
          }
          document.location.href = window.location.href.replace("/login.html", "/");
         resetUserModal($loginForm);
        }
      }
    });
  };

// Reset del formulario de Login
const resetUserModal = (form) => {
    form.reset()
  };



d.addEventListener('DOMContentLoaded',()=>{
    loginUser()
})

