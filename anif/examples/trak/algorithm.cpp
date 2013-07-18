#include <iostream>
#include <cstdio>
#include <set>
#include <queue>
#include <list>

#ifdef EAVY
#include "../../tools/avy.h"
#else
#define AVY(...)
#endif

using namespace std;

int n, m, status[20000], c;
set<int> child[20000], parent[20000];
priority_queue<int, vector<int>, greater<int> > vrsta;
list<int> seq;

int main() {
	scanf("%d %d", &n, &m);
	
	AVY(start);
	for (int i = 0; i < n; i++) {
		AVY(graph.addNode, P(i));
	}
	
	for (int i = 0; i < m; i++) {
		int a, b;
 		scanf("%d %d", &a, &b); a--; b--;
		child[b].insert(a);
		parent[a].insert(b);
		status[b] = 1;
		if (a != -1 && b != -1) {
			AVY(graph.addLink, P(a), P(b));
		}
	}
	AVY(step);
	
	for (int i = 0; i < n; i++) {
		if (!status[i]) {
			vrsta.push(i);
			AVY(graph.updateNode, P(i), M(selected, P(true)));
		}
	}
	AVY(step);
	
	while (!vrsta.empty()) {
		int t = vrsta.top(); vrsta.pop();
		seq.push_back(t); c++;
		AVY(graph.delNode, P(t));
		AVY(list.add, P(t));
		for (set<int>::iterator i = parent[t].begin(); i != parent[t].end(); i++) {
			child[*i].erase(t);
			if (child[*i].empty()) {
				vrsta.push(*i);
				AVY(graph.updateNode, P(*i), M(selected, P(true)));
			}
		}
		AVY(step);
	}
	
	if (c == n) {
		for (list<int>::iterator i = seq.begin(); i != seq.end(); i++) {
			if (i != seq.begin()) printf(" ");
			printf("%d", *i + 1);
		}
		printf("\n");
	} else {
		printf("-1\n");
	}
}