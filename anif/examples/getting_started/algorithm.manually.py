#!/usr/bin/env python3
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

avy_file = open('0.avy', 'w') # Start a new avy file
list = []
for i in range(10):
	avy_file.write('step()\n') # Step in the animation
	list.append(i)
	avy_file.write('list.add(%d)\n' % i) # Tell avy that we added i to the list
