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

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'notedata'
});

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

  rootRef.on('value', function (snapshot) {
    // snapshot.forEach(function (childNodes) {
    var accounts;
    for (accounts = 1; accounts < 10; accounts++) {
      if (snapshot.child('useraccounts/' + accounts + '/username').val() == username && snapshot.child('useraccounts/' + accounts + '/password').val() == password) {
        console.log("same");
        let mainWin = new BrowserWindow({
          width: 980, height: 650, frame: false, webPreferences: {
            nodeIntegration: true
          }
        });
        var userid;
        userid = accounts;
        mainWin.webContents.on('did-finish-load', () => {
          let Data = {
            userid: userid,
            username: username,
            password: password,
            color: 'white'
          };
          mainWin.webContents.send('userid', Data);
          window.close();
        });
        mainWin.webContents.openDevTools();

        mainWin.on('close', () => {
          mainWin = null;
        });
        mainWin.loadURL(path.join('file://', process.cwd(), 'index.html'));
        mainWin.show();


        // console.log(snapshot.child('1001/info1').val());
        // console.log(snapshot.child('1001/info2').val());
      }
    }
    // });
  });
  // }
});

document.getElementById("login__newmember").addEventListener("click", function (e) {
  var logWin = remote.getCurrentWindow();
  let mainWin = new BrowserWindow({
    width: 297, height: 470, frame: false, webPreferences: {
      nodeIntegration: true
    }
  });
  mainWin.webContents.on('did-finish-load', () => {
    logWin.close();
  });
  // mainWin.webContents.openDevTools();

  mainWin.on('close', () => {
    mainWin = null;
  });
  mainWin.show();
  mainWin.loadURL(path.join('file://', process.cwd(), 'newAccount.html'));
});