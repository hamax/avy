#!/bin/bash
# ========================================================================
# Avy Algorithm Visualization Framework
# https://github.com/hamax/avy
# ========================================================================
# Copyright 2013 Ziga Ham
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ========================================================================

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
