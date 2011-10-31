#!/usr/bin/perl -w

use strict;

package Workspace;

sub new {
  my $class = shift;
  my $self = {
    _id => shift,
  };
  bless $self, $class;
  return $self;
}

1;
