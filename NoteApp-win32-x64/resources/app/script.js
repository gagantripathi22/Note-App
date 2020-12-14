ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

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
var userid;
var username;
// $(document).ready( function() {
ipc.on('userid', (event, arg) => {
  userid = arg.userid;
  console.log(userid);
  username = arg.username;
  // var mysql = require('mysql');
  // var connection = mysql.createConnection({
  //   host: 'localhost',
  //   user: 'root',
  //   password: 'root',
  //   database: 'notedata'
  // });

  var windowSizeCheck;

  $(window).on('resize', function () {
    // if($(window).width() > 1100) {
    if (($(window).width() > 1100)) {
      if ($('#sidebar').css("display") == "none") {
        ;
      }
      else {
        $('#mattr').css("grid-template-columns", "75px 250px 1fr");
        $("#sidebar").css("width", "250");
        windowSizeCheck = 1;
      }
    }
    else {
      if ($('#sidebar').css("display") == "none") {
        ;
      }
      else {
        $('#mattr').css("grid-template-columns", "75px 222px 1fr");
        $("#sidebar").css("width", "222");
        windowSizeCheck = 0;
      }
    }
  })


  var info_click_counts = 0;
  var edit_click_counts = 0;
  var username_click_counts = 0;
  var newnote_click_counts = 0;
  var isTodo = 0;


  // HOME GREETING //


  var myDate = new Date();
  var hrs = myDate.getHours();
  var greet;
  if (hrs < 12)
    greet = 'Good morning, ' + username;
  else if (hrs >= 12 && hrs <= 17)
    greet = 'Good afternoon, ' + username;
  else if (hrs >= 17 && hrs <= 24)
    greet = 'Good evening, ' + username;


  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  document.getElementById('home__heading').innerHTML = greet;

  var day = myDate.getDate();
  var month = myDate.getMonth();
  if (month == 0)
    month = "January";
  else if (month == 1)
    month = "February";
  else if (month == 2)
    month = "March";
  else if (month == 3)
    month = "April";
  else if (month == 4)
    month = "May";
  else if (month == 5)
    month = "June";
  else if (month == 6)
    month = "July";
  else if (month == 7)
    month = "August";
  else if (month == 8)
    month = "September";
  else if (month == 9)
    month = "October";
  else if (month == 10)
    month = "November";
  else if (month == 11)
    month = "December";

  var year = myDate.getFullYear();
  var todayDate = day + " " + month + " " + year;

  document.getElementById('home__date').innerHTML = todayDate;

  // connection.connect();

  function loadChannels() {
    // $sql = 'select * from channel where userid = ' + userid;
    // console.log($sql);
    // connection.query($sql, function (error, results, fields) {
    //   if (error) throw error;
    //   console.log(results);

    //   $('#teams__list').empty();
    //   for (var i = results.length-1; i >= 0; i -= 1) {
    //     var temp = "<li class='teams__item' name='" + results[i].name + "' id = '" + results[i].id + "'>";
    //     console.log(temp);
    //     temp += "<button style='background-color: #" + results[i].b_color + ";' class='teams__button' name='" + results[i].name +  "' id = '" + results[i].id + "'>&#x" + results[i].emoji + "</button>";
    //     temp += "</li>"
    //     $('#teams__list').append(temp);
    //   }
    // });
    rootRef.on('value', function (ChSnapshot) {
      $('#teams__list').empty();
      var channels;
      console.log('childrem : ' + ChSnapshot.child('channel/' + userid + '/').numChildren());
      for (channels = 1; channels <= ChSnapshot.child('channel/' + userid + '/').numChildren(); channels++) {
        var temp = "<li class='teams__item' name='" + ChSnapshot.child('channel/' + userid + '/' + channels + '/name').val() + "' id = '" + channels + "'>";
        console.log(temp);
        temp += "<button style='background-color: #" + ChSnapshot.child('channel/' + userid + '/' + channels + '/b_color').val() + ";' class='teams__button' name='" + ChSnapshot.child('channel/' + userid + '/' + channels + '/name').val() + "' id = '" + channels + "'>&#x" + ChSnapshot.child('channel/' + userid + '/' + channels + '/emoji').val() + "</button>";
        temp += "</li>"
        console.log(temp);
        console.log('userid : ' + userid);
        console.log('channels : ' + channels);
        $('#teams__list').append(temp);
      }
    });
  }
  loadChannels();

  var currTime;
  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    // add a zero in front of numbers<10
    m = checkTime(m);
    currTime = h + ":" + m;
    document.getElementById('home__time').innerHTML = h + ":" + m;
    t = setTimeout(function () {
      startTime()
    }, 500);
  }
  startTime();

  // $('#teams__list').on("click", ".teams__item", function () {
  //   var curr_channel_id;
  //   curr_channel_id = $(this).attr('id');
  //   console.log(curr_channel_id);
  // });

  var curr_channel_id;
  var curr_channel_name;
  var curr_channel_color;

  $('#teams__list').on("click", ".teams__item", function () {
    document.getElementById("sidebar").style.display = "block";
    document.getElementById("main").style.display = "block";
    if (windowSizeCheck == 1)
      document.getElementById("mattr").style.gridTemplateColumns = "75px 250px 1fr";
    else
      document.getElementById("mattr").style.gridTemplateColumns = "75px 222px 1fr";
    document.getElementById("home__screen").style.display = "none";

    curr_channel_id = $(this).attr('id');
    curr_channel_name = $(this).attr('name');
    curr_channel_color = $(this).attr('b_color');
    $sql = 'SELECT * from note where channel_id = ' + curr_channel_id;
    $('#main__title').val("");
    $('#main__content').val("");
    $('.main__menubar').css("grid-template-columns", "1fr 120px");

    $('#editing__title').css("display", "none");
    $('#editing__done__btn').css("display", "none");
    $('#editing__cancel__btn').css("display", "none");

    $('#delete__note__button').css("display", "none");
    $('#info__note__button').css("display", "none");
    $('#edit__note__button').css("display", "none");
    $('#main__note__info').css("display", "none");
    $('#main__container').css("display", "grid");
    $('#main__container').css("grid-template-columns", "1fr");
    $(this).css("background", "none");
    $("#info__note__button").css("background", "none");
    $('#edit__note__button').css("background", "none");

    curr_note_id = 0;

    info_click_counts = 0;

    // $('').css({"width": "100%"});
    // $(this).css({"width": "100%", "border-radius": "none"});

    $('.teams__button').css({ "width": "42px", "border-radius": "25%" });
    $(this).find(".teams__button").css({ "width": "100%", "border-radius": "0" });
    $(this).css({ "width": "100%" });

    // connection.query($sql, function (error, results, fields) {
    //   if (error) throw error;
    //   console.log(results);

    //   // $('#main__note--title').empty().append(curr_channel_name);
    //   $('#sidebar__menubar--text').empty().append(curr_channel_name);

    //   $('#sidebar__list').empty();
    //   for (var i = (results.length) - 1; i >= 0; i -= 1) {
    //     isTodo = results[i].todo;
    //     console.log(isTodo);
    //     if (isTodo == 0) {
    //       var temp = "<div class='sidebar__item' id='" + results[i].id + "'>";
    //       temp += "<div class='sidebar__button' id='" + results[i].id + "'>" + results[i].title + "</div>";
    //       temp += "<div class='sidebar__button--desc' id='" + results[i].id + "'>" + results[i].content + "</div>";
    //       temp += "</div>";
    //       $('#sidebar__list').append(temp);
    //     }
    //     else {
    //       var temp = "<div class='sidebar__item' id='" + results[i].id + "'>";
    //       temp += "<i class='fa fa-check todo_item_icon' aria-hidden='true'></i>";
    //       temp += "<div class='sidebar__button' id='" + results[i].id + "'>" + results[i].title + "</div>";
    //       temp += "<div class='sidebar__button--desc' id='" + results[i].id + "'>" + results[i].content + "</div>";
    //       temp += "</div>";
    //       $('#sidebar__list').append(temp);
    //     }
    //   }
    // });

    rootRef.on('value', function (ChNoteSnapshot) {
      $('#sidebar__menubar--text').empty().append(curr_channel_name);
      $('#sidebar__list').empty();
      var channelID = userid + '' + curr_channel_id;
      console.log('childrem : ' + ChNoteSnapshot.child('note/' + channelID + '/').numChildren());
      var traverse;
      rootRef.on('value', function (ChSnapshot) {
        // traverse = ChSnapshot.child('note/' + channelID + '/').numChildren();
        traverse = 1;
      });

      ChNoteSnapshot.child('note/' + channelID + '/').forEach(function (childNodes) {
        var temp = "<div class='sidebar__item' id='" + childNodes.val().id + "'>";
        temp += "<i class='fa fa-check todo_item_icon' aria-hidden='true' style='display:none;'></i>";
        temp += "<div class='sidebar__button' id='" + childNodes.val().id + "'>" + childNodes.val().title + "</div>";
        temp += "<div class='sidebar__button--desc' id='" + childNodes.val().id + "'>" + childNodes.val().content + "</div>";
        temp += "</div>";
        $('#sidebar__list').append(temp);
        // console.log(1);
        console.log(childNodes.val().title);
        traverse++;
      });
    });
  });

  function loadNotes() {
    // $sql = 'SELECT * from note where channel_id = ' + curr_channel_id;
    // console.log($sql);

    // connection.query($sql, function (error, results, fields) {
    //   if (error) throw error;
    //   console.log(results);

    //   $('#sidebar__menubar--text').empty().append(curr_channel_name);

    //   $('#sidebar__list').empty();
    //   for (var i = (results.length) - 1; i >= 0; i -= 1) {
    //     isTodo = results[i].todo;
    //     console.log(isTodo);
    //     if (isTodo == 0) {
    //       var temp = "<li class='sidebar__item' id='" + results[i].id + "'>";
    //       temp += "<div class='sidebar__button' id='" + results[i].id + "'>" + results[i].title + "</div>";
    //       temp += "<div class='sidebar__button--desc' id='" + results[i].id + "'>" + results[i].content + "</div>";
    //       temp += "</li>";
    //       console.log(temp);
    //       $('#sidebar__list').append(temp);
    //     }
    //     else {
    //       var temp = "<li class='sidebar__item' id='" + results[i].id + "'>";
    //       temp += "<i class='fa fa-check todo_item_icon' aria-hidden='true'></i>";
    //       temp += "<div class='sidebar__button' id='" + results[i].id + "'>" + results[i].title + "</div>";
    //       temp += "<div class='sidebar__button--desc' id='" + results[i].id + "'>" + results[i].content + "</div>";
    //       temp += "</li>";
    //       console.log(temp);
    //       $('#sidebar__list').append(temp);
    //     }
    //   }
    // });
    // closeFormNote();


    rootRef.on('value', function (ChNoteSnapshot) {
      $('#sidebar__menubar--text').empty().append(curr_channel_name);
      $('#sidebar__list').empty();
      var channelID = userid + '' + curr_channel_id;
      // console.log('childrem : ' + ChNoteSnapshot.child('note/' + channelID + '/').numChildren());
      var traverse = 0;
      ChNoteSnapshot.child('note/' + channelID + '/').forEach(function (childNodes) {
        traverse++;
        var temp = "<li class='sidebar__item' id='" + childNodes.val().id + "'>";
        temp += "<i class='fa fa-check todo_item_icon' aria-hidden='true' style='display:none;'></i>";
        temp += "<div class='sidebar__button' id='" + childNodes.val().id + "'>" + childNodes.val().title + "</div>";
        temp += "<div class='sidebar__button--desc' id='" + childNodes.val().id + "'>" + childNodes.val().content + "</div>";
        temp += "</li>";
        $('#sidebar__list').append(temp);
        // console.log(1);
        // console.log(childNodes.val().title);
      });
    });
  }

  var curr_note_id;
  var curr_note_date;
  var curr_note_type; // 0 for Text Note and 1 for To-Do Note

  $('#sidebar__list').on("click", ".sidebar__item", function () {
    var curr_note_check = $(this).attr('id');
    if (curr_note_check !== curr_note_id) {
      // $sql = 'SELECT * from note where id = ' + $(this).attr('id');
      $('.sidebar__item').css("border-right", "none");
      $('.sidebar__item').css("background", "none");
      $(this).css("border-right", "4px solid white");
      $(this).css("background", "rgb(37, 39, 46)");
      $('.main__menubar').css("grid-template-columns", "1fr 40px 40px 40px 120px");
      $('#delete__note__button').css("display", "block");
      $('#info__note__button').css("display", "block");
      $('#edit__note__button').css("display", "block");
      $('#edit__note__button').css("background", "none");
      $('#main__title').val("").css("background", "rgb(58, 62, 71)");
      $('#main__content').val("").css("background", "rgb(58, 62, 71)");
      $('#new__note__save__btn').css("display", "none");
      $('#new__note__cancel__btn').css("display", "none");

      document.getElementById("main__title").readOnly = true;
      // document.getElementById("main__title").();
      document.getElementById("main__content").readOnly = true;
      $('#editing__title').css("display", "none");
      $('#editing__done__btn').css("display", "none");
      $('#editing__cancel__btn').css("display", "none");

      curr_note_id = $(this).attr('id');
      // connection.query($sql, function (error, results, fields) {
      //   if (error) throw error;
      //   console.log(results);
      //   // curr_note_type = results[0].todo;
      //   $('#main__title').empty().val(results[0].title);
      //   $('#main__content').empty().val(results[0].content);
      //   curr_note_date = results[0].time + " " + results[0].date;
      //   $('#main__note__info__date').empty().append(curr_note_date);
      // });
      rootRef.on('value', function (ChNoteSnapshot) {
        var channelID = userid + '' + curr_channel_id;
        console.log('CHANNEL ID :: ' + channelID);
        console.log('CURR NOTE ID :: ' + curr_note_id);
        $('#main__title').empty().val(ChNoteSnapshot.child('note/' + channelID + '/' + curr_note_id).val().title);
        $('#main__content').empty().val(ChNoteSnapshot.child('note/' + channelID + '/' + curr_note_id).val().content);
        curr_note_date = ChNoteSnapshot.child('note/' + channelID + '/' + curr_note_id).val().time + " " + ChNoteSnapshot.child('note/' + channelID + '/' + curr_note_id).val().date;
        $('#main__note__info__date').empty().append(curr_note_date);
      });
    }
  });

  // -- NEW CHANNEL ADD -- //

  $('#add__item').on("click", "#add__btn", function () {
    document.getElementById("newChPopup").style.display = "block";
  });

  function closeFormCh() {
    document.getElementById("newChPopup").style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    var popWin = document.getElementById('newChPopup');
    if (event.target == popWin) {
      closeFormCh();
    }
  }

  $('#newChPopup').on("click", ".theme__item", function () {
    var inputVal = document.querySelectorAll('[name="channelName"]')[0].value;
    if (inputVal == "") {
      $('.form__container__ch input[type=text]').css("background", "rgb(134, 0, 0)");
    }
    else {
      // $sql = "INSERT INTO CHANNEL(name, b_color, emoji, userid)";
      // $sql += " values('" + inputVal + "','" + $(this).attr('name') + "','" + $(this).attr('id') + "','" + userid + "')";
      // console.log($sql);
      // connection.query($sql, function (error, results, fields) {
      //   if (error) {
      //     throw error;
      //   }
      // });
      // loadChannels();
      // document.getElementById("newChPopup").style.display = "none";
      // document.querySelectorAll('[name="channelName"]')[0].value = "";
      // $('.form__container__ch input[type=text]').css("background", "#2A2D34");

      // var newChannelRef = firebase.database().ref().child('channel');
      // console.log(firebase.database().ref().child('channel/1/1/').val().name)
      // console.log(ChNoteSnapshot.child('note/' + channelID + '/' + curr_note_id).val());
      var oldChannelCount;
      rootRef.on('value', function (ChSnapshot) {
        oldChannelCount = ChSnapshot.child('channel/' + userid + '/').numChildren();
      });
      oldChannelCount = Number(oldChannelCount) + 1;
      var newChannelRef = firebase.database().ref().child('channel/' + userid + '/' + oldChannelCount);
      newChannelRef.set({
        name: inputVal,
        b_color: $(this).attr('name'),
        emoji: $(this).attr('id'),
      })
      loadChannels();
      document.getElementById("newChPopup").style.display = "none";
      document.querySelectorAll('[name="channelName"]')[0].value = "";
      $('.form__container__ch input[type=text]').css("background", "#2A2D34");

      // console.log(ChNoteSnapshot.child('channel/' + 11 + '/' + 1).val().content);
      // });
    }
  });

  $('#newChPopup').on("click", ".ch__btn__close", function () {
    document.getElementById("newChPopup").style.display = "none";
    document.querySelectorAll('[name="channelName"]')[0].value = "";
    $('.form__container__ch input[type=text]').css("background", "#2A2D34");
  });

  // -- NEW NOTE ADD -- //

  // $('#main').on("click", "#new__note__button", function () {
  //   // document.getElementById("newNotePopup").style.display="block";
  //   $('#main__title').val("").css("background-color", "rgb(52, 55, 63)");
  //   $('#main__content').val("").css("background-color", "rgb(52, 55, 63)");
  //   document.getElementById("main__title").readOnly = false;
  //   document.getElementById("main__content").readOnly = false;
  //   document.getElementById("main__title").select();
  //   $('#new__note__save__btn').css("display", "block");
  //   $('#new__note__cancel__btn').css("display", "block");
  //   $('.main__menubar').css("grid-template-columns", "1fr");
  //   $(this).css("display", "none");
  //   $('#delete__note__button').css("display", "none");
  //   $('#info__note__button').css("display", "none");
  //   $('#edit__note__button').css("display", "none");
  //   $('.sidebar__item').css("border-right", "none");
  //   $('.sidebar__item').css("background", "none");
  //   $('#main__container').css("grid-template-columns", "1fr");
  //   $('#main__note__info').css("display", "none");
  //   $('#info__note__button').css("background", "none");

  //   $('#editing__done__btn').css("display", "none");
  //   $('#editing__cancel__btn').css("display", "none");
  //   curr_note_id = -1;
  // });

  function textNoteWindowAppear() {
    // document.getElementById("newNotePopup").style.display="block";
    $('#main__title').val("").css("background-color", "rgb(52, 55, 63)");
    $('#main__content').val("").css("background-color", "rgb(52, 55, 63)");
    document.getElementById("main__title").readOnly = false;
    document.getElementById("main__content").readOnly = false;
    document.getElementById("main__title").select();
    $('#new__note__save__btn').css("display", "block");
    $('#new__note__cancel__btn').css("display", "block");
    $('.main__menubar').css("grid-template-columns", "1fr");
    $('#new__note__button').css("display", "none");
    $('#delete__note__button').css("display", "none");
    $('#info__note__button').css("display", "none");
    $('#edit__note__button').css("display", "none");
    $('.sidebar__item').css("border-right", "none");
    $('.sidebar__item').css("background", "none");

    $('#main__container').css("grid-template-columns", "1fr");
    $('#main__note__info').css("display", "none");
    $('#info__note__button').css("background", "none");

    $('#editing__done__btn').css("display", "none");
    $('#editing__cancel__btn').css("display", "none");
    // curr_note_id = -1;
  }

  function textNoteWindowAppear() {
    // document.getElementById("newNotePopup").style.display="block";
    $('#main__title').val("").css("background-color", "rgb(52, 55, 63)");
    $('#main__content').val("").css("background-color", "rgb(52, 55, 63)");
    document.getElementById("main__title").readOnly = false;
    document.getElementById("main__content").readOnly = false;
    document.getElementById("main__title").select();
    $('#new__note__save__btn').css("display", "block");
    $('#new__note__cancel__btn').css("display", "block");
    $('.main__menubar').css("grid-template-columns", "1fr");
    $('#new__note__button').css("display", "none");
    $('#delete__note__button').css("display", "none");
    $('#info__note__button').css("display", "none");
    $('#edit__note__button').css("display", "none");
    $('.sidebar__item').css("border-right", "none");
    $('.sidebar__item').css("background", "none");

    $('#main__container').css("grid-template-columns", "1fr");
    $('#main__note__info').css("display", "none");
    $('#info__note__button').css("background", "none");

    $('#editing__done__btn').css("display", "none");
    $('#editing__cancel__btn').css("display", "none");
    // curr_note_id = -1;
  }

  function todoNoteWindowAppear() {
    $('#todo__note__data').css("display", "block");
    $('#main__note__data').css("display", "none");
    $('#todo__title').val("").css("background-color", "rgb(52, 55, 63)");
    document.getElementById("todo__title").readOnly = false;
    document.getElementById("todo__title").select();
    $('#new__note__save__btn').css("display", "block");
    $('#new__note__cancel__btn').css("display", "block");
    $('.main__menubar').css("grid-template-columns", "1fr");
    $('#new__note__button').css("display", "none");
    $('#delete__note__button').css("display", "none");
    $('#info__note__button').css("display", "none");
    $('#edit__note__button').css("display", "none");
    $('.sidebar__item').css("border-right", "none");
    $('.sidebar__item').css("background", "none");

    $('#main__container').css("grid-template-columns", "1fr");
    $('#main__note__info').css("display", "none");
    $('#info__note__button').css("background", "none");

    $('#editing__done__btn').css("display", "none");
    $('#editing__cancel__btn').css("display", "none");
    // curr_note_id = -1;
  }

  // function closeFormNote() {
  //   document.getElementById("newNotePopup").style.display= "none";
  // }
  // // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //   var popWin = document.getElementById('newNotePopup');
  //   if (event.target == popWin) {
  //     closeFormNote();
  //   }
  // }
  // month = myDate.getMonth();
  // if (month < 10) {
  //   month = "0" + month;
  // }
  // $('#newNotePopup').on("click", ".note__btn", function () {
  //   var inputTitleVal = document.querySelectorAll('[name="titleField"]')[0].value;
  //   var inputContentVal = document.querySelectorAll('[name="contentField"]')[0].value;
  //   $sql = 'INSERT INTO note(title, content, channel_id, date, time)';
  //   $sql+= ' values("'+ inputTitleVal + '", "' + inputContentVal + '",' + curr_channel_id + ',"' + day+'-'+month+'-'+year + '","' + currTime + '")'; 
  //   connection.query($sql, function (error, results, fields) {
  //     if (error) {
  //       throw error;
  //     }
  //     else {
  //       console.log(results);
  //       document.querySelectorAll('[name="titleField"]')[0].value = "";
  //       document.querySelectorAll('[name="contentField"]')[0].value = "";
  //       loadNotes();
  //     }
  //   });
  // });

  // $('#newNotePopup').on("click", ".note__btn__close", function () {
  //   document.getElementById("newNotePopup").style.display= "none";
  //   document.querySelectorAll('[name="titleField"]')[0].value = "";
  //   document.querySelectorAll('[name="contentField"]')[0].value = "";
  // });

  $('.main__menubar').on("click", "#delete__note__button", function () {
    // $sql = "DELETE from note where id = " + curr_note_id;
    $('#main__title').val("");
    $('#main__content').val("");
    $('.main__menubar').css("grid-template-columns", "1fr 120px");
    $('#delete__note__button').css("display", "none");
    $('#info__note__button').css("display", "none");
    $('#edit__note__button').css("display", "none");
    $('#editing__done__btn').css("display", "none");
    $('#editing__cancel__btn').css("display", "none");
    document.getElementById("main__title").readOnly = true;
    document.getElementById("main__content").readOnly = true;
    $('#main__title').val("").css("background", "rgb(58, 62, 71)");
    $('#main__content').val("").css("background", "rgb(58, 62, 71)");

    $('#main__note__info').css("display", "none");
    $('#main__container').css("display", "grid");
    $('#main__container').css("grid-template-columns", "1fr");
    $('#info__note__button').css("background", "none");


    $('#new__note__popup').css("display", "none");
    newnote_click_counts = 0;

    // firebase.database().ref().child('note/' + userid + '' + curr_channel_id + '/' + curr_note_id).delete();

    var deleteRef = firebase.database().ref('note/' + userid + '' + curr_channel_id + '/' + curr_note_id);
    deleteRef.remove()

    // rootRef.on('value', function (NoteDeleteSnapshot) {
    //   NoteDeleteSnapshot.child('note/' + userid + '' + curr_channel_id + '/' + curr_note_id).delete();
    // });

    $('#' + curr_channel_id).find(".teams__button").css({ "width": "100%", "border-radius": "0" });
    $('#' + curr_channel_id).css({ "width": "100%" });

    document.getElementById("main__title").val = "";
    document.getElementById("main__content").val = "";
    loadNotes();
  });

  $('.sidebar__menubar').on("click", "#main__home__btn", function () {
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("main").style.display = "none";
    document.getElementById("mattr").style.gridTemplateColumns = "75px 1fr";
    document.getElementById("home__screen").style.display = "block";
    $('.teams__button').css({ "width": "42px", "border-radius": "25%" });
    $('#sidebar__list').empty();
    curr_note_id = 0;

    $('#new__note__popup').css("display", "none");
    newnote_click_counts = 0;

  });

  $('.main__menubar').on("click", "#info__note__button", function () {
    info_click_counts += 1;

    if (info_click_counts % 2 !== 0) {
      $('#main__container').css("display", "grid");
      $('#main__container').css("grid-template-columns", "1fr 235px");
      $('#main__note__info').css("display", "block");
      $(this).css("background", "#2A2D34");
    }
    else {
      $('#main__note__info').css("display", "none");
      $('#main__container').css("display", "grid");
      $('#main__container').css("grid-template-columns", "1fr");
      $(this).css("background", "none");
    }

    $('#new__note__popup').css("display", "none");
    newnote_click_counts = 0;

  });
  $('.main__menubar').on("click", "#edit__note__button", function () {
    edit_click_counts += 1;
    document.getElementById("main__title").readOnly = false;
    document.getElementById("main__title").select();
    document.getElementById("main__content").readOnly = false;
    $('#editing__title').css("display", "block");
    $('#editing__done__btn').css("display", "block");
    $('#editing__cancel__btn').css("display", "block");
    $('.main__menubar').css("grid-template-columns", "1fr 40px 40px 40px 120px");
    $(this).css("background", "#2A2D34");
    $('#main__title').css("background-color", "rgb(52, 55, 63)");
    $('#main__content').css("background-color", "rgb(52, 55, 63)");

    $('#main__note__info').css("display", "none");
    $('#main__container').css("display", "grid");
    $('#main__container').css("grid-template-columns", "1fr");
    $("#info__note__button").css("background", "none");

    $('#new__note__popup').css("display", "none");
    newnote_click_counts = 0;

    info_click_counts--;
    // curr_note_id = -1;
  });

  // CLEAR SELECTION IN WHOLE APP //

  function clearSelection() {
    if (document.selection)
      document.selection.empty();
    else if (window.getSelection)
      window.getSelection().removeAllRanges();
  }

  $('.main__menubar').on("click", "#editing__cancel__btn", function () {
    document.getElementById("main__title").readOnly = true;
    document.getElementById("main__content").readOnly = true;
    $('#editing__title').css("display", "none");
    $('#editing__done__btn').css("display", "none");
    $('#editing__cancel__btn').css("display", "none");
    $('.main__menubar').css("grid-template-columns", "1fr 40px 40px 40px 120px");
    $('#edit__note__button').css("background", "none");
    $('#main__title').css("background", "rgb(58, 62, 71)");
    $('#main__content').css("background", "rgb(58, 62, 71)");
    clearSelection();
  });

  $('.main__menubar').on("click", "#editing__done__btn", function () {
    
    var edited__title = $('#main__title').val();
    var edited__content = $('#main__content').val();

    // $sql = 'UPDATE note set title = "' + edited__title + '", content = "' + edited__content + '", date = "' + day + '-' + month + '-' + year + '", time = "' + currTime + '" where id = ' + curr_note_id;

    var editNoteRef = firebase.database().ref().child('note/' + userid + '' + curr_channel_id + '/' + curr_note_id);
    editNoteRef.set({
      title: edited__title,
      time: currTime,
      date: day + '-' + month + '-' + year,
      content: edited__content,
      id: curr_note_id,
    })



    loadNotes();
    document.getElementById("main__title").readOnly = true;
    document.getElementById("main__content").readOnly = true;
    $('#editing__title').css("display", "none");
    $('#editing__done__btn').css("display", "none");
    $('#editing__cancel__btn').css("display", "none");
    $('.main__menubar').css("grid-template-columns", "1fr 40px 40px 40px 120px");
    $('#edit__note__button').css("background", "none");

    $('#main__title').css("background", "rgb(58, 62, 71)");
    $('#main__content').css("background", "rgb(58, 62, 71)");
    clearSelection();
    curr_note_id = -1;


    // SELECTING NOTE
    $('#' + curr_note_id + '.sidebar__item').css("border-right", "4px solid white");
    $('#' + curr_note_id + '.sidebar__item').css("background", "rgb(37, 39, 46)");
    // SELECTING NOTE
    // SELECTING CHANNEL
    $('#' + curr_channel_id).find(".teams__button").css({ "width": "100%", "border-radius": "0" });
    $('#' + curr_channel_id).css({ "width": "100%" });
    // SELECTING CHANNEL
  });

  $('#main__note--title').on("click", "#new__note__save__btn", function () {
    newnote_click_counts = 0;
    var inputTitleVal = $('#main__title').val();
    var inputContentVal = $('#main__content').val();
    var inputTodoTitleVal = $('#todo__title').val();

    var oldNoteCount;
    // rootRef.on('value', function (ChSnapshot) {
    //   oldNoteCount = ChSnapshot.child('note/' + userid + '' + curr_channel_id + '/').numChildren();
    // });


    var channelID = userid + '' + curr_channel_id;
    rootRef.on('value', function (ChNoteSnapshot) {
      ChNoteSnapshot.child('note/' + channelID + '/').forEach(function (childNodes) {
        oldNoteCount = childNodes.val().id;
      });
    });
    if (oldNoteCount != null) {
      oldNoteCount++;
    }
    else {
      oldNoteCount = 1;
    }

    console.log('Old Note Count ::: ' + oldNoteCount);
    var newNoteRef = firebase.database().ref().child('note/' + userid + '' + curr_channel_id + '/' + oldNoteCount);
    console.log('UserID : ' + userid);
    console.log('NoteID : ' + curr_channel_id);
    newNoteRef.set({
      title: inputTitleVal,
      time: currTime,
      date: day + '-' + month + '-' + year,
      content: inputContentVal,
      id: oldNoteCount,
    })

    $('#new__note__save__btn').css("display", "none");
    $('#new__note__cancel__btn').css("display", "none");
    $('#main__title').val("").css("background", "rgb(58, 62, 71)");
    $('#main__content').val("").css("background", "rgb(58, 62, 71)");
    $('.main__menubar').css("grid-template-columns", "1fr 120px");
    $('#new__note__button').css("display", "block");
    $('#delete__note__button').css("display", "none");
    $('#info__note__button').css("display", "none");
    $('#edit__note__button').css("display", "none");
    document.getElementById("main__title").readOnly = true;
    document.getElementById("main__content").readOnly = true;

    $('#todo__note__data').css("display", "none");
    $('#main__note__data').css("display", "block");

    loadNotes();

    $('#' + curr_channel_id).find(".teams__button").css({ "width": "100%", "border-radius": "0" });
    $('#' + curr_channel_id).css({ "width": "100%" });

    console.log('AFTER LOADING NOTES THE CHANNEL ID :: ' + curr_channel_id);
  });

  $('#main__note--title').on("click", "#new__note__cancel__btn", function () {
    newnote_click_counts = 0;
    $('#new__note__save__btn').css("display", "none");
    $('#new__note__cancel__btn').css("display", "none");
    $('#main__title').val("").css("background", "rgb(58, 62, 71)");
    $('#main__content').val("").css("background", "rgb(58, 62, 71)");
    $('.main__menubar').css("grid-template-columns", "1fr 120px");
    $('#new__note__button').css("display", "block");
    $('#delete__note__button').css("display", "none");
    $('#info__note__button').css("display", "none");
    $('#edit__note__button').css("display", "none");
    document.getElementById("main__title").readOnly = true;
    document.getElementById("main__content").readOnly = true;

    $('#todo__note__data').css("display", "none");
    $('#main__note__data').css("display", "block");

    loadNotes();
  });

  $('#footer').on("click", "#username", function () {
    username_click_counts += 1;
    if (username_click_counts % 2 !== 0) {
      // $('#settings__popup').css("display", "block");
      // $('#settings__popup').css("height", "110px");
      $('#settings__popup').css("background", "#2A2D34");
      $('#settings__popup').css("bottom", "30px");
      $('.settings__popup--item').css("display", "block");
      $('#username').css("transform", "rotate(20deg)");
    }
    else {
      // $('#settings__popup').css("height", "0px");
      $('#settings__popup').css("bottom", "50px");
      $('#settings__popup').css("background", "rgb(58, 62, 71)");
      $('.settings__popup--item').css("display", "none");
      $('#username').css("transform", "rotate(-20deg)");
    }
  });

  $('#settings__popup').on("click", ".dark__mode__switch__btn", function () {

  });

  $('#settings__popup').on("click", ".change__password__btn", function () {
    document.getElementById("changePasswordPopup").style.display = "block";
    $('#settings__popup').css("bottom", "50px");
    $('#settings__popup').css("background", "rgb(58, 62, 71)");
    $('.settings__popup--item').css("display", "none");
    $('#username').css("transform", "rotate(-20deg)");
    username_click_counts = 0;
  });

  $('#settings__popup').on("click", ".log__out__btn", function () {
    var currWin = remote.getCurrentWindow();
    let loginWin = new BrowserWindow({
      width: 297, height: 370, frame: false, webPreferences: {
        nodeIntegration: true
      }
    });
    // loginWin.webContents.on('did-finish-load', () => {
    currWin.close();
    // });
    // mainWin.webContents.openDevTools();

    loginWin.on('close', () => {
      mainWin = null;
    });
    loginWin.show();
    loginWin.loadURL(path.join('file://', process.cwd(), 'login.html'));
  });

  $('.form__popup__pass').on("click", ".pass__btn__close", function () {
    document.getElementById("changePasswordPopup").style.display = "none";
  });

  $('#main').on("click", "#new__note__button", function () {
    newnote_click_counts += 1;
    info_click_counts = 0;
    if (newnote_click_counts % 2 !== 0) {
      // $('#new__note__popup').css("display", "block");
      textNoteWindowAppear();
      $('#main__note__info').css("display", "none");
      $('#main__container').css("display", "grid");
      $('#main__container').css("grid-template-columns", "1fr");
      $('#info__note__button').css("background", "none");
    }
    else {
      $('#new__note__popup').css("display", "none");
    }
  });

  $('#new__note__popup').on("click", ".text__note__btn", function () {
    textNoteWindowAppear();
    $('#new__note__popup').css("display", "none");
  });

  $('#new__note__popup').on("click", ".todo__note__btn", function () {
    todoNoteWindowAppear();
    $('#new__note__popup').css("display", "none");
  });
  // connection.end();
});
// })