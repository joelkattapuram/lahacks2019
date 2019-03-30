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

function uploadFile(files) {
  const storageRef = firebase.storage().ref();
  const imgRef = storageRef.child('trash.png');

  const file = files.item(0);

  const task = imgRef.put(file)

  // successful upload
  task.then(snapshot => {
      const url = snapshot.downloadURL
  })

  // monitor progress
  task.on('state_changed', snapshot => {
      console.log(snapshot)

  })
}
