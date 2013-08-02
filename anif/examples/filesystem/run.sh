#!/bin/bash
set -e

# compile
javac -cp '.:../../tools/avy.jar' Filesystem.java

# run
java -cp '.:../../tools/avy.jar' Filesystem

# cleanup
rm *.class