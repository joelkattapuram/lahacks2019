document.addEventListener("DOMContentLoaded", event => {
  const app = firebase.app();
});
var user = ""
async function GoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  user = result.user;
  document.querySelector("#userIntro").innerHTML =
    "Welcome, " + user.displayName;
  addUser(user);
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

function checkForm() {
  var f = document.forms["goal"].elements;
  var cansubmit = true;
  for (var i = 0; i < f.length; i++) {
    if (f[i].value.length == 0) cansubmit = false;
  }
  document.getElementById('goal').disabled = !cansubmit;
}

function addGoal() {
  const db = firebase.firestore();
  const goals = db.collection("goals");
  goals.add({
    name: document.querySelector("#name").value,
    description: document.querySelector("#description").value,
    start: firebase.firestore.Timestamp.fromDate(new Date(document.querySelector("#start").value)),
    end: firebase.firestore.Timestamp.fromDate(new Date(document.querySelector("#end").value)),
    owner: user.displayName,
    followers: 0,
    media: []
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

function addUser(user) {
  const db = firebase.firestore();
  db.collection("users").doc(user.displayName).set({
    name: user.displayName,
    karma: 0,
  }, {merge: true})
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
}
