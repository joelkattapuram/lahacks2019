document.addEventListener("DOMContentLoaded", event => {
  const app = firebase.app();
  getGoals("jpKiOJ9QYxblUvHM3G2Y");
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
  const imgRef = storageRef.child("trash.png");

  const file = files.item(0);

  const task = imgRef.put(file);

  // successful upload
  task.then(snapshot => {
    const url = snapshot.downloadURL;
  });

  // monitor progress
  task.on("state_changed", snapshot => {
    console.log(snapshot);
  });
}

async function getGoals(name) {
  const goals = firebase.firestore().collection("goals");
  const post = goals.doc(name);
  post.onSnapshot(doc => {
    const data = doc.data();
    console.log(data);
    document.querySelector("#goal-holder").innerHTML =
      "Name: " +
      data.name +
      " End-Date: (we need to convert this mofo)" +
      data.end.seconds +
      " Status: " +
      data.status;
  });
}
