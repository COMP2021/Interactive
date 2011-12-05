/**
 * This file is for the websocket data transfer and drawing on canvases
 */
var ws; // global websocket

var data_frequency = 30; // intervals between each refresh

var refresh_id;

var CANVAS_WIDTH = 800;

var CANVAS_HEIGHT = 600;

var drawing = 0; // whether the user is now drawing

var mousedown = 0;  // whether the mouse is pressed

var canvas_inited = 0; // whether the canvas have been initialized

var last_x = -1; // used to store the previous mouse location
var last_y = -1; // used to store the previous mouse location

var undoed = 0; // whether the user has just used "undo"

var timeout = true; // if true, then we can detect mouse moves, used to prevent too much data transfer

var usernames = []; // used to store all the users that have logged in, useful for the "online user" display

var userbufs = {}; // used to store the previous mouse locations of different users, for showing cursors when drawing

// Following are the global variables describing the user's current state,
// when changing the properties using the toolbar or others, just update
// these variables

var username_g; // name of the user

var userid_g; // id of the user

var currtool_g = "pen"; // the tool (shape) the user is using

var currfg_g = [0, 0, 0]; // the current foreground color

var currbg_g = [255, 255, 255]; // the current background color

var currfill_g = 0; // whether to fill or not

var currwidth_g = 1; // the current width of line

var usercolor_g; // color used to display the user's name

WebSocket.__initialize; // initialize the websocket

function init_socket() {
  refresh_id = setInterval(time_out, data_frequency); // allow mouse move detection every 30 milliseconds

  ws = new WebSocket('ws://localhost:8080/server');

  // when the websocket is opened
  ws.onopen = function() {
    var action = { // new a user
      action: "new_user",
      username: username_g
    };
    ws.send(JSON.stringify(action));
  };

  // on receiving a message
  ws.onmessage = function(e) { // when the client receives a message
    var data = jQuery.parseJSON(e.data); // data is the JSON string sent by the server
    var action = data.action; // what the client should do

    switch (action) {
      case "new_user": // adding a new user
        if (!data.permission) { // not permitted, display an error message
          var dialogOpts = { // options
            buttons: {
              "Ok": function() {
                $("#username_in_use").dialog("close");
                login();
              }
            }
          };
          $("#username_in_use").dialog(
            dialogOpts,
            {
              modal: true,
              resizable: false,
            }
          );
          $(".ui-dialog-titlebar").hide(); // hide the title bar
        }
        init_detector(); // initialize the "detector" canvas to detect mouse events
        userid_g = data.userid; // assign an id to the user
        usercolor_g = color_arr[userid_g % color_arr.length]; // initialize user's color, fixed after it

        // add a welcome message to the chatting area
        $("#message_box").append("<div class=\"chat_entry\"><p class=\"chat_content\">" 
            + "Welcome to Interactive Canvas.<br />You can chat with other users here.</p></div>");
        $(".chat_content").css("color", "#87CEFA");
        $(".chat_content").css("font-style", "italic");

        for (var i = 0; i < data.allid.length; i++) {
          add_canvas(data.allid[i]); // add the existing canvases
        }
        for (var i = 0; i < data.segs.length; i++) {
          draw_canvas(jQuery.parseJSON(data.segs[i])); // draw the segments from the server on the canvases
        }
        for (var i = 0; i < data.chats.length; i++) {
          chat_received(jQuery.parseJSON(data.chats[i])); // display the chattings on the chatting area
        }
        for (var i = 0; i < data.allname.length; i++) {
          user_login(data.allname[i]); //display the usernames on the user display area
        }
        // clear the detectore canvas
        $("#detector").get(0).getContext('2d').clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        break;
      case "new_canvas": // add new canvas to the canvas container
        if (data.userid != -1) {
          add_canvas(data.userid);
          if (data.username != username_g) {
            user_login(data.username);
          }
        }
        break;
      case "user_logout": // when the user logs out
        user_logout(data.username);
        break;
      case "draw": // various line segments
        draw_canvas(data);
        break;
      case "begin_seg": // begin a segment
        move_canvas_to_top(data.userid);
        username_shine(data.username, color_arr[data.userid]);
        for (var i = 0; i < data.segs.length; i++) {
          draw_canvas(jQuery.parseJSON(data.segs[i]));
        }
        break;
      case "end_seg": // end a segment
        stop_username_shine(data.username);
        clear_usercap(data.username);
        break;
      case "undo": // undo
        $("#layer" + data.userid).get(0).getContext('2d').clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        break;
      case "redo": // redo
        for (var i = 0; i < data.segs.length; i++) {
          draw_canvas(jQuery.parseJSON(data.segs[i]));
        }
        break;
      case "chat": // received a chatting message
        chat_received(data);
        break;
    }
  };
}

// add a user to the online user display when a new user is in and add a message to the chat box
function user_login(username) {
  if (is_new_user(username)) { // a new user that never logged in before
    usernames.push(username); // store the username in the array
    var user_entry = "<div id=\"user_" + username + "\" class=\"user_entry\"><p>" + username + "</p></div>";
    if ($("#user_" + username_g).length == 0) {
      $("#online_user").append(user_entry);
    } else {
      $(user_entry).insertAfter($("#user_" + username_g));
    }
  } else { // a user that have logged in
    $("#user_" + username + " p").css("color", "#000");
    $("#user_" + username).insertAfter($("#user_" + username_g));
  }
}

// delete a user from the online user display when it logs out
function user_logout(username) {
  $("#user_" + username + " p").remove();
  var user_entry = "<div id=\"user_" + username + "\" class=\"user_entry\"><p>" + username + "</p></div>";
  $("#online_user").append(user_entry); // put the user's name to the last place
  $("#user_" + username + " p").css("color", "#CCC");
  clear_usercap(username);
}

// add a new layer to the canvas container
function add_canvas(canvas_id) {
  $("<canvas id=\"layer" + canvas_id + "\" class=\"layer\" width=\"" 
      + CANVAS_WIDTH + "\" height=\"" + CANVAS_HEIGHT + "\"></canvas>")
      .insertAfter($("#canvas"));
}

// move a canvas to top of all the others
function move_canvas_to_top(canvas_id) {
  $("#layer" + canvas_id).insertBefore($("#detector"));
}

// draw various segments on different canvases
function draw_canvas(data) {
  var cxt;
  if (data.tentative) { // draw the the layers above
    if ($("#layer" + data.userid).get(0) !== undefined) {
      cxt = $("#layer" + data.userid).get(0).getContext('2d');
    }
  } else { // draw on the base canvas
    cxt = $("#canvas").get(0).getContext('2d');
    if ($("#layer" + data.userid).get(0) !== undefined) {
      $("#layer" + data.userid).get(0).getContext('2d')
          .clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear the canvas
    }
  }
  // parse the strings to hex
  var fgcolor = "#" + data.fg[0].toString(16) + 
      data.fg[1].toString(16) + data.fg[2].toString(16);
  var bgcolor = "#" + data.bg[0].toString(16) + 
      data.bg[1].toString(16) + data.bg[2].toString(16);
  cxt.strokeStyle = fgcolor;
  cxt.fillStyle = bgcolor;
  cxt.lineWidth = data.width;
  cxt.lineCap = "round";
  
  switch (data.shape) {
    case "pen":
      cxt.beginPath();
      cxt.moveTo(data.start[0], data.start[1]);
      cxt.lineTo(data.end[0], data.end[1]);
      cxt.stroke();
      cxt.closePath();
      break;
    case "line":
      if ($("#layer" + data.userid).get(0) !== undefined) {
        $("#layer" + data.userid).get(0).getContext('2d')
            .clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear the users canvas
      }
      cxt.beginPath();
      cxt.moveTo(data.start[0], data.start[1]);
      cxt.lineTo(data.end[0], data.end[1]);
      cxt.stroke();
      cxt.closePath();
      break;
    case "rect":
      if ($("#layer" + data.userid).get(0) !== undefined) {
        $("#layer" + data.userid).get(0).getContext('2d')
            .clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear the users canvas
      }
      if (data.fill) {
        cxt.fillRect(data.start[0], data.start[1], data.end[0] - data.start[0], data.end[1] - data.start[1]);
      }
      cxt.strokeRect(data.start[0], data.start[1], data.end[0] - data.start[0], data.end[1] - data.start[1]);
      break;
    case "ellipse":
      if ($("#layer" + data.userid).get(0) !== undefined) {
        $("#layer" + data.userid).get(0).getContext('2d')
            .clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear the users canvas
      }
      draw_ellipse(cxt, data.start[0], data.start[1], 
          data.end[0] - data.start[0], data.end[1] - data.start[1], data.fill);
      break;
    case "eraser":
      cxt.strokeStyle = bgcolor;
      cxt.beginPath();
      cxt.moveTo(data.start[0], data.start[1]);
      cxt.lineTo(data.end[0], data.end[1]);
      cxt.stroke();
      cxt.closePath();
      break;
  }
  // draw the cursor at the end of the line segment
  if (data.username != username_g) {
    var x = data.end[0];
    var y = data.end[1];

    cxt = $("#detector").get(0).getContext('2d');
    cxt.strokeStyle = data.usercolor;
    cxt.fillStyle = data.usercolor;
    if (userbufs[data.username]) {
      cxt.clearRect(userbufs[data.username][0] - 10, 
          userbufs[data.username][1] - 10, 20, 20); // clear the detector canvas
    }
    cxt.beginPath();
    cxt.arc(x, y, 5, 0, 2 * Math.PI, false);
    cxt.stroke();
    cxt.fill();
  }
  userbufs[data.username] = [x, y]; // remember the position
}

// display a new piece of msg on the chat box
function chat_received(data) {
  var username = "<p class=\"chat_name\"><font color=" + data.color + ">" + data.username + "</font></p>";
  var time = "<p class=\"chat_time\">" + data.time + "</p>";
  var content = "<p class=\"chat_content\">" + data.content + "</p>";
  var chat_entry = "<div class=\"chat_entry\">" + username + time + content + "</div>";

  $("#message_box").append(chat_entry);
  $("#message_box").get(0).scrollTop = $("#message_box").get(0).scrollHeight; // scroll the chat box
}

function canvas_mousedown(e) {
  mousedown = 1;
  drawing = 1; // restore background color
  var action = {
    action: "begin_seg",
    userid: userid_g,
    undoed: undoed
  };
  ws.send(JSON.stringify(action));
  undoed = 0;
}

function canvas_mouseup(e) {
  mousedown = 0;
  drawing = 0;
  last_x = -1;
  last_y = -1;
  var action = {
    action: "end_seg",
    userid: userid_g
  };
  ws.send(JSON.stringify(action));
}

function canvas_mousemove(e) {
  // Here we should send consecutive msgs to the server for updating
  if (timeout) {
    if (drawing) {
      var x_pos = e.layerX;
      var y_pos = e.layerY;
      switch (currtool_g) {
        case "pen":
          if (last_x == -1 && last_y == -1) {
            last_x = x_pos;
            last_y = y_pos;
          } else {
            var action = {
              action: "draw",
              userid: userid_g,
              shape: "pen",
              start: [last_x, last_y],
              end: [x_pos, y_pos],
              fg: currfg_g,
              bg: currbg_g,
              width: currwidth_g,
              fill: currfill_g,
              tentative: 1,
              usercolor: usercolor_g
            };
            ws.send(JSON.stringify(action));
            last_x = x_pos;
            last_y = y_pos;
          }
          break;
        case "line":
          if (last_x == -1 && last_y == -1) {
            last_x = x_pos;
            last_y = y_pos;
          } else {
            var action = {
              action: "draw",
              userid: userid_g,
              shape: "line",
              start: [last_x, last_y],
              end: [x_pos, y_pos],
              fg: currfg_g,
              bg: currbg_g,
              width: currwidth_g,
              fill: currfill_g,
              tentative: 1,
              usercolor: usercolor_g
            };
            ws.send(JSON.stringify(action));
          }
          break;
        case "rect":
          if (last_x == -1 && last_y == -1) {
            last_x = x_pos;
            last_y = y_pos;
          } else {
            var action = {
              action: "draw",
              userid: userid_g,
              shape: "rect",
              start: [last_x, last_y],
              end: [x_pos, y_pos],
              fg: currfg_g,
              bg: currbg_g,
              width: currwidth_g,
              fill: currfill_g,
              tentative: 1,
              usercolor: usercolor_g
            };
            ws.send(JSON.stringify(action));
          }
          break;
        case "ellipse":
          if (last_x == -1 && last_y == -1) {
            last_x = x_pos;
            last_y = y_pos;
          } else {
            var action = {
              action: "draw",
              userid: userid_g,
              shape: "ellipse",
              start: [last_x, last_y],
              end: [x_pos, y_pos],
              fg: currfg_g,
              bg: currbg_g,
              width: currwidth_g,
              fill: currfill_g,
              tentative: 1,
              usercolor: usercolor_g
            };
            ws.send(JSON.stringify(action));
          }
          break;
        case "eraser":
          if (last_x == -1 && last_y == -1) {
            last_x = x_pos;
            last_y = y_pos;
          } else {
            var action = {
              action: "draw",
              userid: userid_g,
              shape: "eraser",
              start: [last_x, last_y],
              end: [x_pos, y_pos],
              fg: currfg_g,
              bg: currbg_g,
              width: currwidth_g,
              fill: currfill_g,
              tentative: 1,
              usercolor: usercolor_g
            };
            ws.send(JSON.stringify(action));
            last_x = x_pos;
            last_y = y_pos;
          }
          break;
      }
    }
    timeout = false;
  }
}

// when the mouse is move onto the canvas
function canvas_mouseover(e) {
  if (mousedown) {
    drawing = 1;
    var action = {
      action: "begin_seg",
      userid: userid_g,
      undoed: undoed
    };
    ws.send(JSON.stringify(action));
  }
}

// when the mouse is move out of the canvas
function canvas_mouseout(e) {
  drawing = 0;
  last_x = -1;
  last_y = -1;
}

function undo() {
  if (!undoed) {
    undoed = 1;
    var action = {
      action: "undo",
      userid: userid_g,
    };
    ws.send(JSON.stringify(action));
  }
}

function redo() {
  if (undoed) {
    undoed = 0;
    var action = {
      action: "redo",
      userid: userid_g
    };
    ws.send(JSON.stringify(action));
  }
}

function send_chat() {
  if ($("#talk_area").val()) {
    var action = {
      action: "chat",
      username: username_g,
      time: new Date().toString(),
      content: $("#talk_area").val(),
      color: usercolor_g
    };
    ws.send(JSON.stringify(action));
    $("#talk_area").val("");
  }
}

function login() {
  var set_name = function() {
    var name = $("#name_input").val();
    if (name != '' && name.length <= 16) { // must be not null and less that 16 chars
      $("#name_dialog").dialog("close"); // close the dialog
      username_g = name;
      $("#username").text(name);
      init_socket(); // start the websocket
      user_login(name);
    }
  };

  var dialogOpts = { // options
    buttons: {
      "Ok": set_name,
    }
  };

  var show_dialog = function() {
    $("#name_dialog").dialog(
      dialogOpts,
      {
        modal: true,
        resizable: false,
      }
    );
    $(".ui-dialog-titlebar").hide(); // hide the title bar
  };
  show_dialog();
}

// when the webpage is loaded
$(document).ready(function() {
  login();
  init_ui();
});
