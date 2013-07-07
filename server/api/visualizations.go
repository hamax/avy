package api

import (
	"appengine"
	"appengine/blobstore"
	"appengine/datastore"
	"github.com/gorilla/mux"
	"net/http"

	"server/common"
	"server/model"
)

func visualizationsInit(s *mux.Router) {
	s.HandleFunc("/{key}", getVisualization).Methods("GET")
	s.HandleFunc("/", newVisualization).Methods("POST")
	s.HandleFunc("/{key}/uploadurl", getVisualizationFileUploadUrl).Methods("GET")
	s.HandleFunc("/{key}/files", uploadVisualizationFile).Methods("POST")
}

func getVisualization(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	r.ParseForm()
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

	common.WriteJson(c, w, e)
}

func newVisualization(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	print("hello")

	e := model.Visualization{"Untitled", nil}

	key, err := datastore.Put(c, datastore.NewIncompleteKey(c, "visualization", nil), &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, map[string]*datastore.Key{"key": key})
}

// TODO: transaction, multiple files, error checking
func uploadVisualizationFile(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	// Check if we have a file uploaded
	blobs, _, err := blobstore.ParseUpload(r)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	files := blobs["file"]
	if len(files) == 0 {
		c.Errorf("no file uploaded")
		return
	}

	// Get the visualization object
	r.ParseForm()
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

	// Add the new file
	for i := range files {
		e.Files = append(e.Files, model.File{files[i].Filename, files[i].BlobKey})
	}
	
	// Save the visualization object
	key, err = datastore.Put(c, key, &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, e)
}

func getVisualizationFileUploadUrl(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	r.ParseForm()

	uploadUrl, err := blobstore.UploadURL(c, "/api/visualizations/" + vars["key"] + "/files", nil)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, uploadUrl.Path)
}