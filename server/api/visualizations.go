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

// TODO: delte file from blobstore if not needed anymore
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

	key, err := datastore.DecodeKey(vars["key"])
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	// Start a datastore transaction
	var e model.Visualization
	err = datastore.RunInTransaction(c, func(c appengine.Context) error {
		// Get the visualization object
		err = datastore.Get(c, key, &e)
		if err != nil {
			return err
		}

		// Add the new file
		for i := range files {
			nfile := model.File{files[i].Filename, files[i].BlobKey}

			// Check if it already exists
			exists := false
			for j := range e.Files {
				if e.Files[j].Filename == nfile.Filename {
					// Overwrite
					// TODO: delete old file
					e.Files[j] = nfile
					exists = true
					break
				}
			}

			if !exists {
				e.Files = append(e.Files, nfile)
			}
		}
		
		// Save the visualization object
		key, err = datastore.Put(c, key, &e)
		return err
	}, nil)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, e)
}

func getVisualizationFileUploadUrl(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	uploadUrl, err := blobstore.UploadURL(c, "/api/visualizations/" + vars["key"] + "/files", nil)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, uploadUrl.Path)
}