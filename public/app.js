document.addEventListener("DOMContentLoaded", event => {
  const app = firebase.app();
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      document.querySelector("#username").innerHTML = getUserName();
  document.querySelector("#login").innerHTML = "Log out";
  document.querySelector("#profile-pic").src = getProfilePicUrl();
  addMyTable();
    }
  })
});

var documents = [];
var otherDocuments = [];
var myGoals = [];
var otherGoals = [];
var user = ""
var currQuery="";

async function GoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  user = result.user;
  document.querySelector("#userIntro").innerHTML =
    "Welcome, " + user.displayName;

  window.localStorage.setItem('userName', user.displayName);
  storeMyGoals();
}

async function storeOthersGoals(){
  otherDocuments = [];
  otherGoals = [];
  var query = firebase.firestore().collection('goals').where('owner', '!=', window.localStorage.getItem('userName'));
  goals = await query.get();
  goals.forEach(goal => {
otherDocuments.push({'name': goal.data().name, 'description': goal.data().description, 'id': goal.id});
otherGoals.push(goal.data().name);
  })

  window.localStorage.setItem('otherDocuments', JSON.stringify(otherDocuments));
  window.localStorage.setItem('otherGoals', JSON.stringify(otherGoals));
}

function storeMyGoals() {
  documents = [];
  myGoals= [];
  var query = firebase.firestore()
  .collection('goals')
  .where('owner', '==', window.localStorage.getItem('userName'))

// Start listening to the query.
query.get()
.then(goals => {
  goals.forEach(doc => {
var goal = doc;
// displayMessage(goal.data().name, goal.data().start,
//          goal.data().name);
    documents.push({'name': goal.data().name, 'description': goal.data().description, 'id': goal.id});
    myGoals.push(goal.data().name)
  })
  //console.log(documents);
  window.localStorage.setItem('documents', JSON.stringify(documents));
  window.localStorage.setItem('myGoals', JSON.stringify(myGoals));

});
};
/*var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

    var messageListElement = document.getElementById('messages');
    var messageFormElement = document.getElementById('message-form');
    var messageInputElement = document.getElementById('message');
function displayMessage(id, timestamp, name) {
  var div = document.getElementById(id);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', id);
    div.setAttribute('timestamp', timestamp); 
    for (var i = 0; i < messageListElement.children.length; i++) {
      var child = messageListElement.children[i];
      var time = child.getAttribute('timestamp');
      if (time && time > timestamp) {
        break;
      }
    } 
    messageListElement.insertBefore(div, child);
  } 
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
} */

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
  var name = document.querySelector("#name");
  var description = document.querySelector("#description");
  var start = document.querySelector("#start");
  var end = document.querySelector("#end");
  
  var cansubmit = true;
  if(name.value.length == 0 || description.value.length == 0 || start.value.length == 0
    || end.value.length == 0){
      cansubmit = false;
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
    owner: window.localStorage.getItem('userName'),
    supporters: 0
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    storeMyGoals();
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

function updateGoal() {
  var localGoals = JSON.parse(window.localStorage.getItem('myGoals'));
  var localDocs = JSON.parse(window.localStorage.getItem('documents'));
  var goalIndex = localGoals.indexOf(document.querySelector("#name").value)
  //console.log(document.querySelector("#name").value)
  //console.log(goalIndex)
  if (goalIndex > -1) {
    var docID = localDocs[goalIndex].id;
    const db = firebase.firestore();
    const goals = db.collection("goals");
    var oldDescription = localDocs[goalIndex].description
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var descript = document.querySelector("#description").value
    goals.doc(docID).update( {
      description: oldDescription + "\n\n\n" +
      today + "\n" + 
      descript
    })
  } else {
    console.log("you do not have access to this goal")
  }
}

document.addEventListener("DOMContentLoaded", event => {});

let loginStatus = false;

function toggleSignIn() {
  if (loginStatus == false) {
    signIn();
  } else {
    signOut();
  }
  loginStatus = !loginStatus;
}

async function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithPopup(provider);
  document.querySelector("#username").innerHTML = getUserName();
  document.querySelector("#login").innerHTML = "Log out";
  document.querySelector("#profile-pic").src = getProfilePicUrl();
  addMyTable();
  storeMyGoals();
  storeOthersGoals();
}

function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
  document.querySelector("#username").innerHTML = "Sign in!";
  document.querySelector("#login").innerHTML = "Log in";
}

function getProfilePicUrl() {
  return (
    firebase.auth().currentUser.photoURL ||
    "http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
  );
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

function addMyTable() {
  storeMyGoals();
  var docs = JSON.parse(window.localStorage.getItem('documents'));
  var start =
    '<table class="table table-hover" style="color: var(--green-color); border: solid var(--green-color) 4px"><thead><tr><th scope="col">< Goal ></th><th scope="col">< Description ></th><th scope="col">< Edit Info ></th><th scope="col">< More Info ></th></tr></thead></tbody>';
    // console.log(docs.length())
  for(let i = 0; i < docs.length; i++){
    console.log(docs[i].id);
    start +=
    "<tr><td>" +
    docs[i].name +
    "</td><td>" +
    docs[i].description +
    "</td><td><a href=\"edit.html\" class=\"goal-button\">+</a></td><td><button onClick=\"openSpecific('"+docs[i].id+"')\" class=\"goal-button\">+</a></td></tr>";
  }


  start += "</tbody></table>";

  document.querySelector("#mytable-container").innerHTML = start;
}

async function openSpecific(id){
  console.log(id);
  window.location.replace("specific.html");

  currQuery = firebase.firestore()
  .collection('goals')
  .where('id', '==', id)

  let goal = await query.get()

  setTimeout(async function(){console.log(goal);
    document.querySelector("name").innerHTML = goal.name;
    document.querySelector("description").innerHTML = goal.description;}, 3000);

    
}
