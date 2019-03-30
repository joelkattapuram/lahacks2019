document.addEventListener("DOMContentLoaded", event => {
  const app = firebase.app();
});

async function GoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  result = await firebase.auth().signInWithPopup(provider);
  console.log(result);
}
