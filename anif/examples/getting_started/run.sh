#!/bin/bash
set -e

# C++
g++ algorithm.cpp -DEAVY
./a.out
rm a.out
mv 0.avy cpp.avy

# Python
source ../../tools/setup.sh
python algorithm.py avy
mv 0.avy py.avy

# Java
javac -cp '.:../../tools/avy.jar' Algorithm.java
java -cp '.:../../tools/avy.jar' Algorithm
rm *.class
mv 0.avy java.avy

# Manually
python algorithm.manually.py

# All avy files should have the same content
diff 0.avy cpp.avy
diff 0.avy py.avy
diff 0.avy java.avy

# Cleanup
rm cpp.avy py.avy java.avy
