package common

import (
	"appengine"
	"encoding/json"
	"io"
	"net/http"
)

// Server error - something unexpected happend on the server, like a database fail
func ServeError(c appengine.Context, w http.ResponseWriter, err error) {
        w.WriteHeader(http.StatusInternalServerError)
        w.Header().Set("Content-Type", "text/plain")
        io.WriteString(w, "Internal Server Error")
        c.Errorf("%v", err)
}

// Not found
func Serve404(w http.ResponseWriter) {
        w.WriteHeader(http.StatusNotFound)
        w.Header().Set("Content-Type", "text/plain")
        io.WriteString(w, "Not Found")
}

// User not loged in
func Serve401(w http.ResponseWriter) {
        w.WriteHeader(http.StatusUnauthorized)
        w.Header().Set("Content-Type", "text/plain")
        io.WriteString(w, "Unauthorized")
}

// Permission denied
func Serve403(w http.ResponseWriter) {
        w.WriteHeader(http.StatusForbidden)
        w.Header().Set("Content-Type", "text/plain")
        io.WriteString(w, "Forbidden")
}

// Write object serialized to JSON
func WriteJson(c appengine.Context, w http.ResponseWriter, obj interface{}) {
	if obj != nil {
		buff, err := json.Marshal(obj)
		if err != nil {
			ServeError(c, w, err)
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.Write(buff)
		}
	}
}