#!/usr/bin/perl

use Mojolicious::Lite;
use Mojo::JSON;

use UserData;
use Workspace;

# our %workspaces = ();
our %clients = ();
our %userbuffer = ();
# database used to store the line drawn
our @draw_db = ();

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
  # add a canvas to each clients' page
}

# when the user leaves
sub on_finish {
}

# map the fields of the message to the indices of the parsed array
sub map_field_to_idx {
  # create a hashtable here for mapping
}

# deal with adding new users
sub exec_new_user_req {
  my ($username, $client_id) = @_;
  print "$username $client_id\n";
  my $json = Mojo::JSON->new;
  my $data = $json->encode( {
    action => "new_canvas",
    userid => $client_id
  });
  return $data;
}

# deals with the msg for painting, returns the msg to be sent back
sub exec_draw_req {
  my ($userid, $shape, @start, @end, @fg, @bg, $width, $fill) = @_;
  my $json = Mojo::JSON->new;
  my $data = $json->encode( {
    action => "draw",
    userid => $userid,
    shape => $shape,
  });
  return $data;
}

# deals with the msg for undoing
sub exec_undo_req {
  my @items = @_;
}

# deals with the msg for redoing
sub exec_redo_req {
  my @items = @_;
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
        $client_id
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
  }
}

# send the message to the clients, does not create or modify the message
sub send_msg_to_clients {
  my ($message) = @_;
  while ((my $id, my $client) = each(%clients)) {
    $client->send_message($message);
  }
}

# server side, deal with the data the client side sends
websocket '/server' => sub {
  my $self = shift; # $self is the current client

  my $client_id = $client_cnt;
  $clients{$client_id} = $self;
  $client_cnt++;
  
  $self->on_finish(sub {
    delete $clients{$client_id};
  });

  $self->on_message(sub { # when receiving a message from the client
    my ($self, $message) = @_; # get the value of the client and the message
    my $msg_back = exec_msg($message, $client_id);
    send_msg_to_clients($msg_back);
  });
};

app->start; # start the appliction
