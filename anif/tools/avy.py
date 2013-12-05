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

import json

avy_file_index = 0
avy_file = None

def avy(name, *args):
	global avy_file_index, avy_file

	# Start is a special command that opens a file
	if name == 'start':
		if avy_file:
			avy_file.close()
		avy_file = open('%d.avy' % avy_file_index, 'w')
		avy_file_index += 1
		return

	# Write the command and json serialized arguments
	sargs = [json.dumps(arg) for arg in args]
	avy_file.write('%s(%s)\n' % (name, ', '.join(sargs)))