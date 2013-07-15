#include <stdarg.h>
#include <stdio.h>
#include <string.h>

#define AVY(name, args...) avy_print(#name, AVY_N_ARGS(args), ##args);
#define P(param) avy_package(&param)

#define AVY_N_ARGS(args...) AVY_N_ARGS_HELPER(dummy, ##args, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)
#define AVY_N_ARGS_HELPER(dummy, x1, x2, x3, x4, x5, x6, x7, x8, x9, n, x...) n

typedef struct {
	int type;
	void *data;
} avy_param;

avy_param avy_param_new(int type, void *data) {
	avy_param a;
	a.type = type;
	a.data = data;
	return a;
}

avy_param avy_package(int *a) {
	return avy_param_new(0, (void*)a);
}

#ifdef __cplusplus
#include <vector>

avy_param avy_package(std::vector<int> *a) {
	return avy_param_new(1, (void*)a);
}

#endif

int avy_file_index = 0;
FILE *avy_file = NULL;

void avy_print(const char *name, int n, ...) {
	int i, j;

	if (strcmp(name, "start") == 0) {
		if (avy_file) {
			fclose(avy_file);
		}
		char filename[256];
		sprintf(filename, "%d.avy", avy_file_index++);
		avy_file = fopen(filename, "w");
		return;
	}

	fprintf(avy_file, "%s(", name);
	va_list ap;
	va_start(ap, n);
	for (i = 0; i < n; i++) {
		if (i > 0) {
			fprintf(avy_file, ", ");
		}
		avy_param arg = va_arg(ap, avy_param);
		switch (arg.type) {
			case 0:
				fprintf(avy_file, " %d", *(int*)arg.data);
				break;
			#ifdef __cplusplus
			case 1:
				std::vector<int> *a = (std::vector<int>*)arg.data;
				fprintf(avy_file, "[");
				for (j = 0; j < a->size(); j++) {
					if (j > 0) {
						fprintf(avy_file, ",");
					}
					fprintf(avy_file, "%d", (*a)[j]);
				}
				fprintf(avy_file, "]");
				break;
			#endif
		}
	}
	va_end(ap);
	fprintf(avy_file, ")\n");
}