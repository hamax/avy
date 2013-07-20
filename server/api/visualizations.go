package api

import (
	"appengine"
	"appengine/user"
	"appengine/blobstore"
	"appengine/datastore"
	"github.com/gorilla/mux"
	"net/http"
	"time"

	"server/common"
	"server/model"
)

func visualizationsInit(s *mux.Router) {
	s.HandleFunc("/", listVisualizations).Methods("GET")
	s.HandleFunc("/", newVisualization).Methods("POST")
	s.HandleFunc("/{key}/", getVisualization).Methods("GET")
	s.HandleFunc("/{key}/title", setVisualizationTitle).Methods("POST")
	s.HandleFunc("/{key}/uploadurl", getVisualizationFileUploadUrl).Methods("GET")
	s.HandleFunc("/{key}/files", uploadVisualizationFile).Methods("POST")
}

func listVisualizations(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	q := datastore.NewQuery("visualization").Order("-Date");

	// Parse filter parameters
	r.ParseForm()
	fUser := r.Form["user"]
	if len(fUser) > 0 && fUser[0] == "me" {
		u := user.Current(c)
		if u == nil {
			common.Serve401(w)
			return
		}
		q = q.Ancestor(model.GetAccountKey(c, u))
	}

	// Get visualizations
	var e []model.Visualization
	keys, err := q.GetAll(c, &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	// Prepare output
	output := make([]map[string]interface{}, 0)
	for i := range keys {
		output = append(output, map[string]interface{}{"Key": keys[i], "Title": e[i].Title, "Date": e[i].Date})
	}

	common.WriteJson(c, w, output)
}

func newVisualization(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	u := user.Current(c)

	if u == nil {
		common.Serve401(w)
		return
	}

	e := model.Visualization{"Untitled", time.Now(), nil}

	key, err := datastore.Put(c, datastore.NewIncompleteKey(c, "visualization", model.GetAccountKey(c, u)), &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, map[string]*datastore.Key{"key": key})
}

func getVisualization(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

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

	common.WriteJson(c, w, e)
}

func setVisualizationTitle(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)
	u := user.Current(c)

	// Check if user is logged in
	if u == nil {
		common.Serve401(w)
		return
	}

	title := r.PostFormValue("title")

	key, err := datastore.DecodeKey(vars["key"])
	if err != nil {
		common.Serve404(w)
		return
	}

	// Check if user is the owner
	if key.Parent().StringID() != u.ID {
		common.Serve403(w)
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

		// Change the title
		e.Title = title
		
		// Save the visualization object
		key, err = datastore.Put(c, key, &e)
		return err
	}, nil)
	if err != nil {
		if err == datastore.ErrNoSuchEntity {
			common.Serve404(w)
			return
		}
		common.ServeError(c, w, err)
		return
	}
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

func uploadVisualizationFile(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)
	u := user.Current(c)

	// Check if user is logged in
	if u == nil {
		common.Serve401(w)
		return
	}

	key, err := datastore.DecodeKey(vars["key"])
	if err != nil {
		common.Serve404(w)
		return
	}

	// Check if user is the owner
	if key.Parent().StringID() != u.ID {
		common.Serve403(w)
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

		e.Files, err = uploadFile(c, r, e.Files)
		if err != nil {
			return err
		}

		// Save the visualization object
		key, err = datastore.Put(c, key, &e)
		return err
	}, nil)
	if err != nil {
		if err == datastore.ErrNoSuchEntity {
			common.Serve404(w)
			return
		}
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, e)
}