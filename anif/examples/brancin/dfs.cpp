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
#include <stack>

#ifdef EAVY
#include "../../tools/avy.h"
#else
#define AVY(...)
#endif

using namespace std;

int adjacent[][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

int m, n, x2, y2, grid[2000][2000];

void dfs(int x, int y, int c) {
	grid[x][y] = c;
	AVY(grid.set, P(x), P(y), M(value, P(c)));
	if (x == x2 && y == y2) {
		// Search is not done, but this path is
		AVY(step);
		return;
	}
	AVY(grid.set, P(x), P(y), M(color, P("red")));
	AVY(step);

	// If we are further away than current best for the goal, we can stop searching
	if (grid[x2][y2] == -1 || grid[x2][y2] > c + 1) {
		for (int i = 0; i < 4; i++) {
			int nx = x + adjacent[i][0], ny = y + adjacent[i][1];
			if (nx >= 0 && nx < m && ny >= 0 && ny < n && (grid[nx][ny] == -1 || grid[nx][ny] > c + 1)) {
				dfs(nx, ny, c + 1);
			}
		}
	}

	AVY(grid.set, P(x), P(y), M(color, P("blue")));
	AVY(step);
}

int main() {
	AVY(start);

	// Read input data
	int x1, y1, k;
	scanf("%d%d%d%d%d%d%d", &m, &n, &x1, &y1, &x2, &y2, &k);
	x1--; y1--; x2--; y2--;

	memset(grid, -1, sizeof grid);
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
				grid[x1][j] = -2;
				AVY(grid.set, P(x1), P(j), M(color, P("gray")));
			}
		} else {
			assert(y1 == y2);
			if (x1 > x2) {
				swap(x1, x2);
			}
			for (int j = x1; j <= x2; j++) {
				// Mark as taken
				grid[j][y1] = -2;
				AVY(grid.set, P(j), P(y1), M(color, P("gray")));
			}
		}
	}

	// Mark goal
	// in queue: cyan
	// current pos: red
	// goal: green
	// other: blue
	AVY(grid.set, P(x2), P(y2), M(color, P("green")));

	// Do DFS
	dfs(x1, y1, 0);

	printf("%d\n", grid[x2][y2]);
}