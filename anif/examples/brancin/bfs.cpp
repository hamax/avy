/* ========================================================================
 * Avy Algorithm Visualization Framework
 * https://github.com/hamax/avy
 * ========================================================================
 * Copyright 2013 Ziga Ham
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

#include <cstdio>
#include <cassert>
#include <cstring>
#include <algorithm>
#include <queue>

#ifdef EAVY
#include "../../tools/avy.h"
#else
#define AVY(...)
#endif

using namespace std;

int adjacent[][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

class state {
public:
	int x, y, c;
	state(int x, int y, int c) {
		this->x = x;
		this->y = y;
		this->c = c;
	}
};

int main() {
	AVY(start);

	// Read input data
	int m, n, k, x1, y1, x2, y2;
	scanf("%d%d%d%d%d%d%d", &m, &n, &x1, &y1, &x2, &y2, &k);
	x1--; y1--; x2--; y2--;

	bool grid[m][n];
	memset(grid, false, sizeof grid);
	grid[x1][y1] = true;
	for (int i = 0; i < k; i++) {
		int x1, y1, x2, y2;
		scanf("%d%d%d%d", &x1, &y1, &x2, &y2);
		x1--; y1--; x2--; y2--;
		if (x1 == x2) {
			if (y1 > y2) {
				swap(y1, y2);
			}
			for (int j = y1; j <= y2; j++) {
				// Mark as taken
				grid[x1][j] = true;
				AVY(grid.set, P(x1), P(j), M(color, P("gray")));
			}
		} else {
			assert(y1 == y2);
			if (x1 > x2) {
				swap(x1, x2);
			}
			for (int j = x1; j <= x2; j++) {
				// Mark as taken
				grid[j][y1] = true;
				AVY(grid.set, P(j), P(y1), M(color, P("gray")));
			}
		}
	}

	// Mark start and goal
	// in queue: cyan
	// current pos: red
	// goal: green
	// other: blue
	AVY(grid.set, P(x1), P(y1), M(value, P(0)));
	AVY(grid.set, P(x1), P(y1), M(color, P("cyan")));
	AVY(grid.set, P(x2), P(y2), M(color, P("green")));

	// Do BFS
	queue<state> q;
	q.push(state(x1, y1, 0));
	while (!q.empty()) {
		state s = q.front();
		q.pop();

		AVY(step);
		AVY(grid.set, P(s.x), P(s.y), M(color, P("red")));
		AVY(step);

		for (int i = 0; i < 4; i++) {
			int nx = s.x + adjacent[i][0], ny = s.y + adjacent[i][1];
			if (nx >= 0 && nx < m && ny >= 0 && ny < n && !grid[nx][ny]) {
				grid[nx][ny] = true;
				q.push(state(nx, ny, s.c + 1));

				AVY(grid.set, P(nx), P(ny), M(value, P(s.c + 1)));
				if (nx == x2 && ny == y2) {
					printf("%d\n", s.c + 1);
					return 0;
				}
				AVY(grid.set, P(nx), P(ny), M(color, P("cyan")));
			}
		}

		AVY(grid.set, P(s.x), P(s.y), M(color, P("blue")));
	}

	// No path found
	return 1;
}