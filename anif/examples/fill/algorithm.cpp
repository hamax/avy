#include <iostream>
#include <queue>
#include <map>
#include <cstring>

#ifdef EAVY
#include "../../tools/avy.h"
#else
#define AVY(...)
#endif

using namespace std;

class state {
public:
	int cost;
	vector<int> q;
	
	state(int cost, vector<int> q) {
		this->cost = cost;
		this->q = q;
	}

	bool operator<(const state &o) const {
		return this->cost > o.cost;
	}
};

int main() {
	int cases;
	cin >> cases;
	for (int i = 0; i < cases; i++) {
		AVY(start)

		vector<int> cap, q;
		for (int i = 0; i < 3; i++) {
			int a;
			cin >> a;
			cap.push_back(a);
			q.push_back(0);
		}
		q[2] = cap[2];

		// Init the queue
		priority_queue<state> queue;
		queue.push(state(0, q));

		// Init the results
		int result[201];
		memset(result, -1, sizeof result);
		map<vector<int>, bool> visited;
		map<vector<int>, int> best;
		best[q] = 0;

		AVY(graph.addNode, P(q))
		while (!queue.empty()) {
			state s = queue.top();
			queue.pop();

			// Check if we have already visited this node
			if (visited[s.q]) {
				continue;
			}
			visited[s.q] = true;

			AVY(step)

			// Mark the results
			for (int i = 0; i < 3; i++) {
				if (result[s.q[i]] == -1) {
					result[s.q[i]] = s.cost;
				}
			}

			// Do the allowed operations
			for (int source = 0; source < 3; source++) {
				for (int target = 0; target < 3; target++) {
					if (source != target) {
						// Pour source to target
						int amount = min(s.q[source], cap[target] - s.q[target]);
						if (amount > 0) {
							state n = s;
							n.cost += amount;
							n.q[source] -= amount;
							n.q[target] += amount;
							if (best.find(n.q) == best.end() || n.cost < best[n.q]) {
								best[n.q] = n.cost;
								queue.push(n);
								AVY(graph.addNode, P(n.q), P(s.q))
							}
						}
					}
				}
			}
		}

		// Print the result
		int d;
		cin >> d;
		while (d >= 0) {
			if (result[d] != -1) {
				cout << result[d] << " " << d << endl;
				break;
			}
			d--;
		}
	}
}