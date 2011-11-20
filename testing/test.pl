#!/usr/bin/perl

require "aux.pl";

print_sth();

my @array = (1, 2, 3, 5);

$hash{0} = 1;

@hash{1} = @array;

print "$hash{0}\n";
print "@hash{1}\n";

$string = "aa";
if (!$string) {
  print "empty\n";
}
