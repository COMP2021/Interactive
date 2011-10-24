#!/usr/bin/perl

use FindBin;
use Mojolicious::Lite;

our @clients;

# forend webpage, load index.html.ep in the __DATA__ part
get '/index' => sub {
  my $self = shift; # $self is the current client
  $self->render('index'); # render a webpage to the client
};

# server side, deal with the data the client side sends
websocket '/server' => sub {
  my $self = shift; # $self is the current client
  push(@clients, $self); # add the current client to the list of clients

  $self->send_message('Welcome!'); # send a message to the client

  $self->on_finish(sub { # when the connection is finished, do nothing now
  });

  $self->on_message(sub { # when receiving a message from the client
    my ($self, $message) = @_; # get the value of the client and the message
    print "$message\n"; # this will be printed on the console of the server
    foreach my $client (@clients) { # all the clients in the list
      $client->send_message($message); # send it to everyone
    }
  });
};

app->start; # start the appliction

__DATA__

@@ index.html.ep
<!doctype html>
<html>
  <head>
    <title>Test</title>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
    <script type="text/javascript" charset="utf-8">
      if ( WebSocket.__initialize ) {
        WebSocket.__swfLocation = 'web-socket-js/WebSocketMain.swf';
      }

      var ws, input, log;

      function init() {
        ws = new WebSocket('ws://143.89.218.59:3000/server');

        ws.onopen = function() {
        };

        ws.onmessage = function(e) { // when the client receives a message
          var text = $("#messages").html() + "<br />" + e.data;
          $("#messages").html(text); //set the textarea to include the new message
        };

        ws.onclose = function() { // when socket is closed, do nothing now
        };
      }

      function onSubmit() { // when the user clicks the send button
        ws.send($("#user").attr("value") + ": " +
            $("#content").attr("value")); // send the message
        $("#content").val(""); // empty the textarea
      }

      window.onload = function() {
        init();
      };

    </script>
  </head>
  <body>
    <h1>Chatting</h1>
    <p id="messages"></p>
    <input type="text" id="user"/><br />
    <textarea id="content" rows="3" cols="30"></textarea><br />
    <input type="button" onclick="onSubmit()" value="send"/><br />
  </body>
</html>
