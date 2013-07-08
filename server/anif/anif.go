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
}

func getVisualizationIndex(w http.ResponseWriter, r *http.Request) {
	templates.ExecuteTemplate(w, "index", nil)
}

func getVisualizationFile(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	// Get visualization object
	key, err := datastore.DecodeKey(vars["key"])
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	var e model.Visualization
	err = datastore.Get(c, key, &e)
	if err != nil {
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

	common.ServeError(c, w, err)
}