#!/usr/bin/perl

use strict;

package UserData;

sub new {
  my $class = shift;
  my $self = {
    _id => shift,
  };
  bless $self, $class;
  return $self;
};

1;
