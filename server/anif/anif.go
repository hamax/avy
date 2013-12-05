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

package anif

import (
	"appengine"
	"appengine/blobstore"
	"appengine/datastore"
	"github.com/gorilla/mux"
	"html/template"
	"net/http"

	"server/common"
	"server/model"
)

var templates = template.Must(template.ParseGlob("anif/index.html"))

func Init(s *mux.Router) {
	s.HandleFunc("/visualizations/{key}/", getVisualizationIndex).Methods("GET")
	s.HandleFunc("/visualizations/{key}/{filename}", getVisualizationFile).Methods("GET")
	s.HandleFunc("/modules/{devname}/{name}/{filename}", getModuleFile).Methods("GET")
	s.HandleFunc("/{path:.*}", anif404)
}

// Serve a 404 error - file not found
func anif404(w http.ResponseWriter, r *http.Request) {
	common.Serve404(w)
}

// Get index file (html) for a visualization
func getVisualizationIndex(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	// Get visualization object
	key, err := datastore.DecodeKey(vars["key"])
	if err != nil {
		common.Serve404(w)
		return
	}

	var e model.Visualization
	err = datastore.Get(c, key, &e)
	if err != nil {
		if err == datastore.ErrNoSuchEntity {
			common.Serve404(w)
			return
		}
		common.ServeError(c, w, err)
		return
	}

	// Check if avy.js exists
	exists := false
	for i := range e.Files {
		if e.Files[i].Filename == "avy.js" {
			exists = true
			break
		}
	}

	if exists {
		templates.ExecuteTemplate(w, "index", nil)
	} else {
		templates.ExecuteTemplate(w, "noavyjs", nil)
	}
}

// Get a file that is part of a visualization
func getVisualizationFile(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	// Get visualization object
	key, err := datastore.DecodeKey(vars["key"])
	if err != nil {
		common.Serve404(w)
		return
	}

	var e model.Visualization
	err = datastore.Get(c, key, &e)
	if err != nil {
		if err == datastore.ErrNoSuchEntity {
			common.Serve404(w)
			return
		}
		common.ServeError(c, w, err)
		return
	}

	// Find blob key
	filename := vars["filename"]
	for i := range e.Files {
		if e.Files[i].Filename == filename {
			blobstore.Send(w, appengine.BlobKey(e.Files[i].BlobKey))
			return
		}
	}

	common.Serve404(w)
}

// Get a file that is part of a module
func getModuleFile(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	// Get module object
	accKey, _, err := model.GetAccountByDevname(c, vars["devname"])
	if err != nil {
		common.ServeError(c, w, err)
		return
	}
	if accKey == nil {
		common.Serve404(w)
		return
	}
	key := datastore.NewKey(c, "module", vars["name"], 0, accKey)

	var e model.Module
	err = datastore.Get(c, key, &e)
	if err != nil {
		if err == datastore.ErrNoSuchEntity {
			common.Serve404(w)
			return
		}
		common.ServeError(c, w, err)
		return
	}

	// Find blob key
	filename := vars["filename"]
	for i := range e.Files {
		if e.Files[i].Filename == filename {
			blobstore.Send(w, appengine.BlobKey(e.Files[i].BlobKey))
			return
		}
	}

	common.Serve404(w)
}