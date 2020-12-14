const path = require('path');
const ipc = require('electron').ipcRenderer;
const BrowserWindow = require('electron').remote.BrowserWindow;
const remote = require('electron').remote;
const openSecondWindowButton = document.getElementById('login__btn');

// Your web app's Firebase configuration
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

var firebaseConfig = {
  apiKey: "AIzaSyB7HRGI1TbfmqPbnxkTWX-GD5KSEcCtm2Y",
  authDomain: "noteapp-e787d.firebaseapp.com",
  projectId: "noteapp-e787d",
  storageBucket: "noteapp-e787d.appspot.com",
  messagingSenderId: "982292527234",
  appId: "1:982292527234:web:5151c14700812f4d4adc9b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var rootRef = firebase.database().ref();


var window = remote.getCurrentWindow();

document.getElementById("close__btn").addEventListener("click", function (e) {
  window.close();
});

document.getElementById("login__newmember").addEventListener("click", function (e) {
  document.getElementById("new__account").style.display = "block";
  document.getElementById("login").style.display = "none";
});

document.getElementById("login__btn").addEventListener("click", function (e) {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var email = document.getElementById("email").value;
  var mobilenumber = document.getElementById("mobilenumber").value;
  if (username == "") {
    $('#username').css("background", "rgb(134, 0, 0)");
  }
  else {
    $('#username').css("background", "#2A2D34");
  }

  if (password == "") {
    $('#password').css("background", "rgb(134, 0, 0)");
  }
  else {
    $('#password').css("background", "#2A2D34");
  }

  if (email == "") {
    $('#email').css("background", "rgb(134, 0, 0)");
  }
  else {
    $('#email').css("background", "#2A2D34");
  }

  if (mobilenumber == "") {
    $('#mobilenumber').css("background", "rgb(134, 0, 0)");
  }
  else {
    $('#mobilenumber').css("background", "#2A2D34");
  }

  if (username != "" && password != "" && email != "" && mobilenumber != "") {
    // $sql = "insert into useraccounts(username, password, email, mobilenumber) ";
    // $sql += "values('" + username + "','" + password + "','" + email + "','" + mobilenumber + "')";
    var oldAccCount;

    rootRef.on('value', function (ChSnapshot) {
      async function callHim() {
        oldAccCount = await ChSnapshot.child('useraccounts/').numChildren();
        console.log('childrem : ' + ChSnapshot.child('useraccounts/').numChildren());
      }
      callHim();
    });

    console.log('ACC NUM CT' + oldAccCount);
    setTimeout(function () {
      var newAccRef = firebase.database().ref().child('useraccounts/' + oldAccCount);
      newAccRef.set({
        username: username,
        password: password,
      })


      var newAccWin = remote.getCurrentWindow();
      let mainWin = new BrowserWindow({
        width: 297, height: 370, frame: false, webPreferences: {
          nodeIntegration: true
        }
      });
      mainWin.webContents.on('did-finish-load', () => {
        newAccWin.close();
      });
      // mainWin.webContents.openDevTools();

      mainWin.on('close', () => {
        mainWin = null;
      });
      mainWin.show();
      mainWin.loadURL(path.join('file://', process.cwd(), 'login.html'));


    }, 3000);


    // if (oldAccCount == null) {
    //   oldAccCount = 1;
    // }




  }
});

document.getElementById("login__newmember").addEventListener("click", function (e) {
  var newAccWin = remote.getCurrentWindow();
  let mainWin = new BrowserWindow({
    width: 297, height: 370, frame: false, webPreferences: {
      nodeIntegration: true
    }
  });
  mainWin.webContents.on('did-finish-load', () => {
    newAccWin.close();
  });
  // mainWin.webContents.openDevTools();

  mainWin.on('close', () => {
    mainWin = null;
  });
  mainWin.show();
  mainWin.loadURL(path.join('file://', process.cwd(), 'login.html'));
}); 