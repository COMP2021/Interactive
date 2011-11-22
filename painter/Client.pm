use strict;

package Client;

sub new {
  my $class = shift;
  my $self = {
      _wsclient => shift,
      _cname => shift,
      _cid => shift,
  };
  bless $self, $class;
  return $self;
}

sub get_wsclient {
  my $self = $_[0];
  return $self->{_wsclient};
}

sub get_cname {
  my $self = $_[0];
  return $self->{_cname};
}

sub get_cid {
  my $self = $_[0];
  return $self->{_cid};
}

1;
