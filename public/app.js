document.addEventListener("DOMContentLoaded", event => {
  const app = firebase.app();
});

async function GoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  const user = result.user;
  document.querySelector("#userIntro").innerHTML =
    "Welcome, " + user.displayName;
}
