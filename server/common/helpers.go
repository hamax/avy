package common

import (
	"appengine"
	"encoding/json"
	"io"
	"net/http"
)

func ServeError(c appengine.Context, w http.ResponseWriter, err error) {
        w.WriteHeader(http.StatusInternalServerError)
        w.Header().Set("Content-Type", "text/plain")
        io.WriteString(w, "Internal Server Error")
        c.Errorf("%v", err)
}

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