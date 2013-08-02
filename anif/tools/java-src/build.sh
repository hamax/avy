#!/bin/bash
set -e

# extract gson
jar xf gson-2.2.4.jar
rm -r META-INF

# compile
javac Avy.java

# package
mkdir -p net/algoviz
mv Avy.class net/algoviz
jar cf ../avy.jar com net

# cleanup
rm -r com net