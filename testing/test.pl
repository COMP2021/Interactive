#!/usr/bin/perl

my $str = "asdff";

foreach my $seg (split(/\|/, $str)) {
  print "$seg\n";
}
