#include <stdarg.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Main Avy macro
// Usage: AVY(command string, P(arg1 variable), P(arg2 variable), ...)
#define AVY(name, args...) avy_print(#name, AVY_N_ARGS(args), ##args);
// Macro for packaging parameters
#define P(param) avy_package(param)
// Macro for building one key and one value maps, val must be packaged
// Usage: M(key string, P(val variable))
#define M(key, val) avy_package_map(#key, val)

// Helper for counting arguments (up to 9)
#define AVY_N_ARGS(args...) AVY_N_ARGS_HELPER(dummy, ##args, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)
#define AVY_N_ARGS_HELPER(dummy, x1, x2, x3, x4, x5, x6, x7, x8, x9, n, x...) n

// Like sprintf, but returns a new string
char* avy_printf(const char *fmt, ...) {
	char *r;
	va_list ap;
	va_start(ap, fmt);
	vasprintf(&r, fmt, ap);
	va_end(ap);
	return r;
}

// Append to a string
char* avy_append(char **s, const char *fmt, ...) {
	char *p;
	va_list ap;
	va_start(ap, fmt);
	vasprintf(&p, fmt, ap);
	va_end(ap);

	if (!*s) {
		*s = p;
	} else {
		char *r = avy_printf("%s%s", *s, p);
		free(*s);
		free(p);
		*s = r;
	}
}

// Packaging for integers
char* avy_package(int a) {
	return avy_printf("%d", a);
}

// Packaging for C strings
char* avy_package(const char *a) {
	return avy_printf("%s", a);
}

// Packaging for one key and one value maps
char* avy_package_map(const char *key, char *val) {
	char *r = avy_printf("{\"%s\":\"%s\"}", key, val);
	// val is already packaged argument, so we need to free it
	free(val);
	return r;
}

#ifdef __cplusplus
#include <vector>

// Packaging for C++ booleans
char* avy_package(bool a) {
	return avy_printf(a ? "true" : "false");
}

// Packaging for STL vectors
char* avy_package(std::vector<int> a) {
	int i, j;
	char *r = NULL;
	avy_append(&r, "[");
	for (j = 0; j < a.size(); j++) {
		if (j > 0) {
			avy_append(&r, ",");
		}
		avy_append(&r, "%d", a[j]);
	}
	avy_append(&r, "]");
	return r;
}

#endif

int avy_file_index = 0;
FILE *avy_file = NULL;

// Main function
void avy_print(const char *name, int n, ...) {
	int i, j;

	// Start is a special command that ones a file
	if (strcmp(name, "start") == 0) {
		if (avy_file) {
			fclose(avy_file);
		}
		char filename[256];
		sprintf(filename, "%d.avy", avy_file_index++);
		avy_file = fopen(filename, "w");
		return;
	}

	// Write command and json serialized arguments
	fprintf(avy_file, "%s(", name);
	va_list ap;
	va_start(ap, n);
	for (i = 0; i < n; i++) {
		if (i > 0) {
			fprintf(avy_file, ", ");
		}
		char* arg = va_arg(ap, char*);
		fprintf(avy_file, "%s", arg);
		// Free string that was created in the packaging function
		free(arg);
	}
	va_end(ap);
	fprintf(avy_file, ")\n");
}