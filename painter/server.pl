#!/usr/bin/perl

use Mojolicious::Lite;
use Mojo::JSON;

use Client;

require "database.pl";

our %clients = ();

# our $workspace_id = 0;
our $client_cnt = 0;

# forend webpage, load index.html.ep in the __DATA__ part
get '/index' => sub {
  my $self = shift; # $self is the current client
  $self->render(template => 'index'); # render the webpage to the client
};

# when connected, ask to login and choose workspace 
sub on_connect {
}

# initialize the canvas
sub on_enter_wksp {
  # add a canvas to each client's page
}

# when the user leaves
sub on_finish {
}

# deal with adding new users
sub exec_new_user_req {
  my ($username, $client_id) = @_;
  my $json = Mojo::JSON->new;
  my @allids = ();
  # first part: send back to the new user
  foreach my $id (keys(%clients)) {
    if ($id != $client_id) {
      push(@allids, $id);
    }
  }
  my $data_user= $json->encode( {
    action => "new_user",
    userid => $client_id,
    allid => \@allids
  });
  $clients{$client_id}->get_wsclient()->send_message($data_user); # send all the canvases to the new user

  # send part: send to all the users
  my $data_canvas = $json->encode( {
    action => "new_canvas",
    userid => $client_id,
  });
  return $data_canvas;
}

# deals with the msg for painting, returns the msg to be sent back
sub exec_draw_req {
  my ($userid, $shape, $start, $end, $fg, $bg, $width, $fill) = @_;
  my $json = Mojo::JSON->new;
  my $data = $json->encode( {
    action => "draw",
    userid => $userid,
    shape => $shape,
    start => $start,
    end => $end,
    fg => $fg,
    bg => $bg,
    width => $width,
    fill => $fill
  });
  if ($shape eq "pen") {
    append_to_buffer($userid, $data);
  } else {
    set_buffer($userid, $data);
  }
  return $data;
}

sub exec_beginseg_req {
# TODO
  # Here we should also put the data in the client's buffer into the shared database, 
  # if just performed undo, do not push it in, merely replace it with a new line seg,
  # and we also need to rearrange the order of the canvases here.
  my ($userid, $undoed) = @_;
  if (!$undoed) { # not undo performed
    buffer2db($userid);
  }
  dump_buffer($userid);
  my $json = Mojo::JSON->new;
  my $data = $json->encode( {
    action => "begin_seg",
    userid => $userid,
    undoed => $undoed
  });
  return $data;
}

sub exec_endseg_req {
# TODO
  # Here we should end the seg
}

# deals with the msg for undoing
sub exec_undo_req {
  my @items = @_;
# TODO
  # send the clients a msg to clear the canvas but keep the buffer unchanged
  # also set a flag to indicate that we performed undo
}

# deals with the msg for redoing
sub exec_redo_req {
  my @items = @_;
# TODO
  # send the clients a msg to restore the canvas we cleared
  # also trun off the flag to indicate that we have not ust performed undo
}

# accepts a message as arg and call different methods according to the type,
# return a message that will be sent to the clients
sub exec_msg {
  my ($message, $client_id) = @_;
  my $json = Mojo::JSON->new;
  my $data = $json->decode($message);
  my $action = $data->{"action"};
  if ($action eq "new_user") { # new user request
    return exec_new_user_req(
        $data->{"username"},
        $client_id,
    );
  } elsif ($action eq "draw") { # drawing request
    return exec_draw_req(
        $data->{"userid"}, 
        $data->{"shape"}, 
        $data->{"start"}, 
        $data->{"end"}, 
        $data->{"fg"}, 
        $data->{"bg"}, 
        $data->{"width"}, 
        $data->{"fill"}
    );
  } elsif ($action eq "begin_seg") { # starting a new seg at mouseclick
    exec_beginseg_req(
        $data->{"userid"},
        $data->{"undoed"}
    );
  }
}

# send the message to the clients, does not create or modify the message
sub send_msg_to_all {
  my ($message) = @_;
  while ((my $id, my $client) = each(%clients)) {
    $client->get_wsclient()->send_message($message);
  }
}

# server side, deal with the data the client side sends
websocket '/server' => sub {
  my $self = shift; # $self is the current client

  # connection established
  my $client_id = $client_cnt;
  my $clt = new Client($self, "shabi", $client_id);
  $clients{$client_id} = $clt;
  $client_cnt++;

  # connection closed
  $self->on_finish(sub {
    delete $clients{$client_id};
  });

  # The following is the server/client interface:
  # get the messages from the clients and send messages to them
  $self->on_message(sub { # when receiving a message from the client
    my ($self, $message) = @_; # get the value of the client and the message
    my $msg_back = exec_msg($message, $client_id);
    send_msg_to_all($msg_back);
  });
};

app->start; # start the appliction
