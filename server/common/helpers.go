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