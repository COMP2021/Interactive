#!/usr/bin/perl -w

use strict;

my %my_hash = ();

$my_hash{"dekai"} = "shabi";
$my_hash{"wu"} = "overfucked";

while ((my $k, my $v) = each(%my_hash)) {
  print $k, $v;
}

delete $my_hash{"wu"};

my @list_of_keys = keys(%my_hash);

print "@list_of_keys\n";
