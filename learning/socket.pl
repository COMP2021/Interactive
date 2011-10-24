#!/usr/bin/perl

use FindBin;
die "You need to run 'git submodule update --init' to fetch the example requirements\n"
    unless -d "$FindBin::Bin/../mojo/lib";

use lib "$FindBin::Bin/../mojo/lib";
use strict;
use warnings;

use Mojolicious::Lite;

@ARGV = qw( daemon ) unless @ARGV;

websocket '/' => sub {
    my $self = shift;
    warn "client connected\n";
    $self->send_message( 'Congratulations, your Mojo is working!' );
    $self->on_finish( sub {
        # put your disconnected client handling here
        warn "client disconnected\n";
    } );
    $self->on_message(sub {
        my ( $self, $message ) = @_;
        $self->send_message( 'echo:'.$message );
    });
};

get '/' => 'index';

# see script/flash-policy-server
print "Remember, you need to also run script/flash-policy-server as root for this to work...\n";

app->start;

1;

__DATA__

@@ index.html.ep
% my $url = $self->req->url->to_abs->scheme( $self->req->is_secure ? 'wss' : 'ws' )->path( '/' );
<!doctype html>
<html>
<head>
    <title>Mojo Websocket Demo</title>

    <script type="text/javascript">
        // only load the flash fallback when needed
        if ( !( 'WebSocket' in window ) ) {
            document.write([
                '<scr'+'ipt type="text/javascript" src="web-socket-js/swfobject.js"></scr'+'ipt>',
                '<scr'+'ipt type="text/javascript" src="web-socket-js/FABridge.js"></scr'+'ipt>',
                '<scr'+'ipt type="text/javascript" src="web-socket-js/web_socket.js"></scr'+'ipt>'
            ].join(''));
        }
    </script>
    <script type="text/javascript">
        if ( WebSocket.__initialize ) {
            // Set URL of your WebSocketMain.swf here:
            WebSocket.__swfLocation = 'web-socket-js/WebSocketMain.swf';
        }

        // example copied from web-socket-js/sample.html
        var ws, input, log;

        function init() {
            input = document.getElementById( 'input' );
            log = document.getElementById( 'log' );
            output('connecting...');

            // Connect to Web Socket.
            ws = new WebSocket( '<%= $url %>' );

            // Set event handlers.
            ws.onopen = function() {
                output( 'onopen' );
                ws.send( 'test' );
            };
            ws.onmessage = function(e) {
                // e.data contains received string.
                output( 'onmessage: ' + e.data );
            };
            ws.onclose = function() {
                output( 'onclose' );
            };
        }

        function onSubmit() {
            ws.send( input.value );
            output( 'send: ' + input.value );
            input.value = '';
            try{ input.focus(); } catch(e) { };
        }

        function onCloseClick() {
            ws.close();
        }

        function output(str) {
            var escaped = str.replace( /&/, '&amp;' ).replace( /</, '&lt;' ).
                replace( />/, '&gt;' ).replace( /"/, '&quot;' );
            log.innerHTML = escaped + '<br>' + log.innerHTML;
        }

        window.onload = init;
    </script>
</head>
<body>
  <form onsubmit="onSubmit(); return false;">
    <input type="text" id="input">
    <input type="submit" value="Send">
    <button onclick="onCloseClick(); return false;">Disconnect</button>
  </form>
  <div id="log"></div>
</body>
</html>
