#!/usr/bin/perl

use Mojolicious::Lite;

# our @clients;
our %clients = ();

our $buffer = "-1 -1";
our $client_cnt = 0;

# forend webpage, load index.html.ep in the __DATA__ part
get '/index' => sub {
  my $self = shift; # $self is the current client
  $self->render('index'); # render a webpage to the client
};

# server side, deal with the data the client side sends
websocket '/server' => sub {
  my $self = shift; # $self is the current client
  my $client_id = $client_cnt;
  $clients{$client_id} = $self;
  $client_cnt++;

  $self->on_finish(sub { # when the connection is finished, do nothing now
    delete $clients{$client_id};
  });

  $self->on_message(sub { # when receiving a message from the client
    my ($self, $message) = @_; # get the value of the client and the message

    while ((my $id, my $client) = each(%clients)) {
      $client->send_message("$message $buffer"); # send it to everyone
    }

    $buffer = $message;
  });
};

get '/scripts.js' => sub {
  my $self = shift;
  $self->render_file('/scripts.js', {});
};

app->start; # start the appliction

__DATA__

@@ index.html.ep
<!doctype html>
<html>
  <head>
    <title>Test</title>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
    <script type="text/javascript">
      if ( WebSocket.__initialize ) {
        WebSocket.__swfLocation = 'web-socket-js/WebSocketMain.swf';
      }

      var ws, input, log, c, cxt;
      var mouse_down = false;

      function init_socket() {
        ws = new WebSocket('ws://143.89.218.59:3000/server');

        ws.onopen = function() {
          // TODO load the canvas
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
            cxt.lineWidth = 2;
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
        ws.send("-1 -1");
      }

      function canvas_mousemove(e) {
        if (mouse_down) {
          var x_pos = e.clientX - c.offsetLeft;
          var y_pos = e.clientY - c.offsetTop;
          var pos_str = x_pos.toString() + " " + y_pos.toString();
          ws.send(pos_str);
        }
      }

      /*
      function onSubmit() { // when the user clicks the send button
        ws.send($("#user").attr("value") + ": " +
            $("#content").attr("value")); // send the message
        $("#content").val(""); // empty the textarea
      }

      function onMobai() {
        ws.send($("#user").attr("value") + ": mobai!!!!!");
      }
      */

      window.onload = function() {
        init_socket();
        init_canvas();
      }
    </script>
  </head>
  <body>
    <!--
      <h1>Chatting</h1>
      <p id="messages"></p>
      <input type="text" id="user"/><br />
      <textarea id="content" rows="3" cols="30"></textarea><br />
      <input type="button" onclick="onSubmit()" value="send"/>
      <input type="button" onclick="onMobai()" value="mobai!"/><br />
    -->
    <canvas id="canvas" width="800" height="600">
    </canvas>
    <!--
      <p id="cspos_display"></p>
    -->
  </body>
</html>
