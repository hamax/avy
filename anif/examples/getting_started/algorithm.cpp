#include <vector>

#ifdef EAVY
#include "../../tools/avy.h"
#else
#define AVY(...)
#endif

using namespace std;

int main() {
	AVY(start); // Start a new avy file
	vector<int> list;
	for (int i = 0; i < 10; i++) {
	    AVY(step); // Step in the animation
	    list.push_back(i);
	    AVY(list.add, P(i)); // Tell avy that we added i to the list
	}
}
