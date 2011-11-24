/**
 * This file is for the websocket data transfer and drawing on canvases
 */
var ws; // global websocket

var drawing = 0;
var mousedown = 0;
var canvas_inited = 0;

var last_x = -1;
var last_y = -1;

var buf_x = 0;
var buf_y = 0;

var undo = 0;

var timeout = true; // if true, then we can detect mouse moves, used to prevent too much data transfer

// Following are the global variables describing the user's current state,
// when changing the properties using the toolbar or others, just update
// these variables
var username_g; // name of the user
var userid_g; // id of the user
var currtool_g = "pen"; // the tool (shape) the user is using
var currfg_g = [0, 0, 0]; // the current foreground color
var currbg_g = [255, 255, 255]; // the current background color
var currfill_g = 1; // whether to fill or not
var currwidth_g = 1; // the current width of line

if ( WebSocket.__initialize ) {
  WebSocket.__swfLocation = 'web-socket-js/WebSocketMain.swf';
}

function time_out() {
  timeout = true;
}

function init_socket() {
  setInterval(time_out, 30); // allow mouse move detection every 30 milliseconds

  ws = new WebSocket('ws://143.89.218.59:3389/server');

  ws.onopen = function() {
    var action = { // new a user
      action: "new_user",
      username: username_g
    };
    ws.send(JSON.stringify(action));
  };

  ws.onmessage = function(e) { // when the client receives a message
    var data = jQuery.parseJSON(e.data);
    var action = data.action;
    if (action == "new_user") { // only for the first login
      if (!data.permission) {
        alert("username already in use");
        login();
      }
      init_detector();
      userid_g = data.userid; // assign an id to the user
      for (var i = 0; i < data.allid.length; i++) {
        add_canvas(data.allid[i]); // add the existing canvases
      }
      for (var i = 0; i < data.segs.length; i++) {
        draw_canvas(jQuery.parseJSON(data.segs[i]));
      }
    } else if (action == "new_canvas") { // add new canvas
      if (data.userid != -1) {
        add_canvas(data.userid);
      }
    } else if (action == "draw" ) { // draw
      draw_canvas(data);
    } else if (action == "begin_seg") {
      move_canvas_to_top(data.userid);
      for (var i = 0; i < data.segs.length; i++) {
        draw_canvas(jQuery.parseJSON(data.segs[i]));
      }
    }
  };

  ws.onclose = function() { // when socket is closed, do nothing now
  };
}

function init_detector() {
  $("#detector").mousedown(canvas_mousedown);
  $("#detector").mouseup(canvas_mouseup);
  $("#detector").mousemove(canvas_mousemove);
  $("#detector").mouseover(canvas_mouseover);
  $("#detector").mouseout(canvas_mouseout);
}

function add_canvas(canvas_id) {
  $("<canvas id=\"layer" + canvas_id + "\" width=\"800\"height=\"600\"></canvas>")
      .insertAfter($("#canvas"));
}

function move_canvas_to_top(canvas_id) {
  $("#layer" + canvas_id).insertBefore($("#detector"));
}

function draw_canvas(data) {
  var cxt;
  if (data.tentative) { // draw the the layers above
    if ($("#layer" + data.userid).get(0) !== undefined) {
      cxt = $("#layer" + data.userid).get(0).getContext('2d');
    }
  } else { // draw on the base canvas
    cxt = $("#canvas").get(0).getContext('2d');
    // TODO clear the layer
    if ($("#layer" + data.userid).get(0) !== undefined) {
      $("#layer" + data.userid).get(0).getContext('2d')
          .clearRect(0, 0, 800, 600); // clear the canvas
    }
  }
  var color = "#" + data.fg[0].toString(16) + 
      data.fg[1].toString(16) + data.fg[2].toString(16);
  cxt.strokeStyle = color;
  cxt.lineWidth = data.width;
  if (data.shape == "pen") {
    cxt.beginPath();
    cxt.moveTo(data.start[0], data.start[1]);
    cxt.lineTo(data.end[0], data.end[1]);
    cxt.stroke();
    cxt.closePath();
  } else if (data.shape == "line") {
    $("#layer" + data.userid).get(0).getContext('2d')
        .clearRect(0, 0, 800, 600); // clear the users canvas
    cxt.beginPath();
    cxt.moveTo(data.start[0], data.start[1]);
    cxt.lineTo(data.end[0], data.end[1]);
    cxt.stroke();
    cxt.closePath();
  } else if (data.shape == "rect") {
  } else if (data.shape == "ellipse") {
  } else if (data.shape == "eraser") {
  }
  if (data.username != username_g) {
    $("#detector").get(0).getContext('2d')
        .clearRect(buf_x - 40, buf_y - 40, 100, 80); // clear the detector canvas
    cxt = $("#detector").get(0).getContext('2d');
    cxt.fillStyle = "#FF0000";
    cxt.fillText(data.username, data.end[0], data.end[1]);
    buf_x = data.end[0];
    buf_y = data.end[1];
  }
}

function canvas_clear_username(e) {
}

function canvas_mousedown(e) {
  // Here we send a message start_msg to notify the server the do the following:
  // 1. push the buffer into the database or delete the buffer (if just undoed)
  // 2. put the user's canvas at the top of all the canvases
  mousedown = 1;
  drawing = 1;
  var action = {
    action: "begin_seg",
    userid: userid_g,
    undoed: undo
  };
  ws.send(JSON.stringify(action));
}

function canvas_mouseup(e) {
  mousedown = 0;
  drawing = 0;
  last_x = -1;
  last_y = -1;
}

function canvas_mousemove(e) {
  // Here we should send consecutive msgs to the server for updating
  if (timeout) {
    if (drawing) {
      var x_pos = e.clientX - $("#canvas").prop("offsetLeft");
      var y_pos = e.clientY - $("#canvas").prop("offsetTop");
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
              tentative: 1
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
              tentative: 1
            };
            ws.send(JSON.stringify(action));
          }
          break;
        case "ellipse":
          break;
        case "eraser":
          break;
      }
    }
    timeout = false;
  }
}

function canvas_mouseover(e) {
  if (mousedown) {
    drawing = 1;
    var action = {
      action: "begin_seg",
      userid: userid_g,
      undoed: undo
    };
    ws.send(JSON.stringify(action));
  }
}

function canvas_mouseout(e) {
  drawing = 0;
  last_x = -1;
  last_y = -1;
}

function login() {
  var set_name = function() {
    var name = $("#name_input").val();
    if (name != '') {
      $("#name_dialog").dialog("close");
      username_g = name;
      $("#top_bar").html("<p>" + name + "</p>");
      init_socket();
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

$(document).ready(function() {
  login();
});
