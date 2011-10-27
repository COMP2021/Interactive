if ( WebSocket.__initialize ) {
  WebSocket.__swfLocation = 'web-socket-js/WebSocketMain.swf';
}

var ws, input, log, c, cxt;
var mouse_down = false;

function init_socket() {
  ws = new WebSocket('ws://143.89.218.59:3000/server');

  ws.onopen = function() {
  };

  ws.onmessage = function(e) { // when the client receives a message
    // var text = $("#messages").html() + "<br />" + e.data;
    // $("#messages").html(text); //set the textarea to include the new message

    var pos = e.data.split(" ");
    var x1 = parseInt(pos[0]);
    var y1 = parseInt(pos[1]);
    var x2 = parseInt(pos[2]);
    var y2 = parseInt(pos[3]);

    if (x1 != -1 && x2 != -1) {
      cxt.strokeStyle = '#FF0000';
      cxt.lineWidth = 1;
      cxt.beginPath();
      cxt.moveTo(x1, y1);
      cxt.lineTo(x2, y2);
      cxt.stroke();
      cxt.closePath();
    }
  };

  ws.onclose = function() { // when socket is closed, do nothing now
  };
}

function init_canvas() {
  c = document.getElementById("canvas");
  c.addEventListener('mousedown', canvas_mousedown, false);
  c.addEventListener('mouseup', canvas_mouseup, false);
  c.addEventListener('mousemove', canvas_mousemove, false);
  cxt = c.getContext("2d");
}

function canvas_mousedown(e) {
  mouse_down = true;
  ws.send("-1 -1");
}

function canvas_mouseup(e) {
  mouse_down = false;
}

function canvas_mousemove(e) {
  if (mouse_down) {
  var x_pos = e.clientX - c.offsetLeft;
  var y_pos = e.clientY - c.offsetTop;
  var pos_str = x_pos.toString() + " " + y_pos.toString();
  ws.send(pos_str);
  // $("#cspos_display").html(pos_str);
  }
}

function onSubmit() { // when the user clicks the send button
  ws.send($("#user").attr("value") + ": " +
      $("#content").attr("value")); // send the message
  $("#content").val(""); // empty the textarea
}

function onMobai() {
  ws.send($("#user").attr("value") + ": mobai!!!!!");
}

window.onload = function() {
  init_socket();
  init_canvas();
};
