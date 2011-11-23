#!/usr/bin/perl

use strict;

# this uses the same id as the hashtable %clients, stores a buffer of the current line seg
our %buffer = ();

# database used to store the line drawn
our @seg_db = ();

# set the user's buffer to the newest line seg
sub set_buffer {
  my ($user_id, $data) = @_;
  $buffer{$user_id} = $data;
}

# append a string to the buffer, only for drawing with a pen
sub append_to_buffer {
  my ($user_id, $data) = @_;
  # use a delimeter separate the strings
  if ($buffer{$user_id}) { # the buffer is defined
    $buffer{$user_id} .= "|".$data;
  } else { # the buffer is empty
    set_buffer($user_id, $data);
  }
}
  my @segs = ();

# push the data in the buffer into the database
sub buffer2db {
  my $user_id = $_[0];
  my $buf = $buffer{$user_id};
  if ($buf) {
    $buf =~ s/\"tentative\":1/\"tentative\":0/g;
  }
  push(@seg_db, $buf);
}

# discard the data in the buffer, used when the user click the mouse
sub dump_buffer {
  my $user_id = $_[0];
  $buffer{$user_id} = 0;
}

# return the database
sub get_db {
  return @seg_db;
}

sub get_buffer {
  my $user_id = $_[0];
  return $buffer{$user_id};
}

# return all the buffers
sub get_all_buffer {
  return %buffer;
}

# print the info of the database, for debugging
sub print_database {
  foreach my $item (@seg_db) {
    print "$item\n";
  }
}

# print the info of a buffer, for debugging
sub print_buffer {
  my $user_id = $_[0];
  print "$buffer{$user_id}\n";
}

# print all, for debugging
sub print_all_buffer {
  foreach my $key (keys(%buffer)) {
    print_buffer($key);
  }
}

1;
