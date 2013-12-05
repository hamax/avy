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

import heapq
import sys

if len(sys.argv) > 1 and sys.argv[1] == 'avy':
	from avy import avy
else:
	def avy(*argv):
		pass

avy('start')

# Preberemo cel vhod (hitreje kot vsako vrstico posebej)
lines = sys.stdin.read().strip().split('\n')

# Iz vhoda razberemo n, m, z
n, m = map(int, lines[0].split())
z = int(lines[1])

# Za vsako prijateljico pripravimo seznam cest
pov = [[] for i in range(n)]
for line in lines[2:]:
	a, b, c = map(int, line.split())
	pov[b].append((a, c))
	avy('graph.addLink', b, a, {'value': c})

# Obicajen Dijkstra algoritem, dist so izracunane razdalje,
# queue je vrsta (priority queue).
dist = [float('inf')] * n
dist[z] = 0
queue = [(0, z)]
avy('graph.updateNode', z, {'value': 0})

while len(queue) > 0:
	avy('step')
	# Iz vrste vzamemo trenutno najkrajso razdaljo
	d, node = heapq.heappop(queue)
	avy('graph.updateNode', node, {'selected': 'step'})
	# Preizkusimo vse ceste
	for node2, cost in pov[node]:
		avy('graph.updateLink', node, node2, {'selected': 'step'})
		new_dist = dist[node] + cost
		if new_dist < dist[node2]:
			dist[node2] = new_dist
			heapq.heappush(queue, (new_dist, node2))
			avy('graph.updateNode', node2, {'value': new_dist})
 
# Izpisemo izracunane razdalje
for i in range(n):
    print(dist[i])
