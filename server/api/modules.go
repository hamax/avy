package api

import (
	"appengine"
	"appengine/blobstore"
	"appengine/user"
	"appengine/datastore"
	"github.com/gorilla/mux"
	"net/http"
	"time"

	"server/common"
	"server/model"
)

func modulesInit(s *mux.Router) {
	s.HandleFunc("/", listModules).Methods("GET")
	s.HandleFunc("/", newModule).Methods("POST")
	s.HandleFunc("/{devname}/{name}/", getModule).Methods("GET")
	s.HandleFunc("/{devname}/{name}/uploadurl", getModuleFileUploadUrl).Methods("GET")
	s.HandleFunc("/{devname}/{name}/files/{action}", uploadModuleFile).Methods("POST")
}

// Get a list of modules
func listModules(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	q := datastore.NewQuery("module").Order("-Date");

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

	// Get modules
	var e []model.Module
	keys, err := q.GetAll(c, &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	// Prepare output
	output := make([]map[string]interface{}, 0)
	for i := range keys {
		output = append(output, map[string]interface{}{"Key": keys[i], "Devname": e[i].Devname, "Name": e[i].Name, "Date": e[i].Date})
	}

	common.WriteJson(c, w, output)
}

// Create a new module
func newModule(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	u := user.Current(c)
	
	acc, err := model.GetAccount(c, u)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}
	if acc == nil {
		common.Serve401(w)
		return
	}

	// Parse form data
	devname := r.PostFormValue("devname")
	name := r.PostFormValue("name")

	// Set user developer name
	if acc.Devname == "" {
		if devname == "" {
			common.Serve404(w) // TODO: maybe 400 instead
			return
		}
		acc.Devname = devname
		err := model.SaveAccount(c, u, acc)
		if err != nil {
			common.ServeError(c, w, err)
			return
		}
	} else {
		devname = acc.Devname
	}

	e := model.Module{devname, name, time.Now(), nil}
	_, err = datastore.Put(c, datastore.NewKey(c, "module", name, 0, model.GetAccountKey(c, u)), &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, map[string]string{"Devname": devname, "Name": name})
}

// Get details about a module
func getModule(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	accKey, _, err := model.GetAccountByDevname(c, vars["devname"])
	if err != nil {
		if err == datastore.ErrNoSuchEntity {
			common.Serve404(w)
			return
		}
		common.ServeError(c, w, err)
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

	res := map[string]interface{}{
		"Owner": key.Parent().StringID(),
		"Devname": e.Devname,
		"Name": e.Name,
		"Date": e.Date,
		"Files": e.Files,
	}

	common.WriteJson(c, w, res)
}

// Get an URL for uploading a file to a module
func getModuleFileUploadUrl(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	uploadUrl, err := blobstore.UploadURL(c, "/api/modules/" + vars["devname"] + "/" + vars["name"] + "/files/upload", nil)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, uploadUrl.Path)
}

// Upload a file to a module
func uploadModuleFile(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)
	u := user.Current(c)

	// Check if user is logged in
	if u == nil {
		common.Serve401(w)
		return
	}

	accKey, _, err := model.GetAccountByDevname(c, vars["devname"])
	if err != nil {
		if err == datastore.ErrNoSuchEntity {
			common.Serve404(w)
			return
		}
		common.ServeError(c, w, err)
		return
	}
	key := datastore.NewKey(c, "module", vars["name"], 0, accKey)

	// Check if user is the owner
	if key.Parent().StringID() != u.ID {
		common.Serve403(w)
		return
	}

	// Start a datastore transaction
	var e model.Module
	err = datastore.RunInTransaction(c, func(c appengine.Context) error {
		// Get the visualization object
		err := datastore.Get(c, key, &e)
		if err != nil {
			return err
		}

		if vars["action"] == "delete" {
			e.Files, err = deleteFile(c, r, e.Files)
			if err != nil {
				return err
			}
		} else {
			e.Files, err = uploadFile(c, r, e.Files)
			if err != nil {
				return err
			}
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

	res := map[string]interface{}{
		"Owner": key.Parent().StringID(),
		"Devname": e.Devname,
		"Name": e.Name,
		"Date": e.Date,
		"Files": e.Files,
	}

	common.WriteJson(c, w, res)
}