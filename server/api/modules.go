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
	s.HandleFunc("/{devname}/{name}/files", uploadModuleFile).Methods("POST")
}

func listModules(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	q := datastore.NewQuery("module").Order("-Date");

	// Parse filter parameters
	r.ParseForm()
	fUser := r.Form["user"]
	if len(fUser) > 0 && fUser[0] == "me" {
		u := user.Current(c)
		if u == nil {
			// TODO: access denied
		}
		q = q.Ancestor(common.GetAccountKey(c, u))
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

func newModule(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	u := user.Current(c)
	
	acc, err := common.GetAccount(c, u)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	// Parse form data
	devname := r.PostFormValue("devname")
	name := r.PostFormValue("name")

	// Set user developer name
	if acc.Devname == "" {
		if devname == "" {
			// TODO: error
		}
		acc.Devname = devname
		err := common.SaveAccount(c, u, acc)
		if err != nil {
			common.ServeError(c, w, err)
			return
		}
	} else {
		devname = acc.Devname
	}

	e := model.Module{devname, name, time.Now(), nil}
	_, err = datastore.Put(c, datastore.NewKey(c, "module", name, 0, common.GetAccountKey(c, u)), &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, map[string]string{"Devname": devname, "Name": name})
}

func getModule(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	// TODO: get account key from devname
	u := user.Current(c)
	key := datastore.NewKey(c, "module", vars["name"], 0, common.GetAccountKey(c, u))

	var e model.Module
	err := datastore.Get(c, key, &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, e)
}

func getModuleFileUploadUrl(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	uploadUrl, err := blobstore.UploadURL(c, "/api/modules/" + vars["devname"] + "/" + vars["name"] + "/files", nil)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, uploadUrl.Path)
}

func uploadModuleFile(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	// TODO: get account key from devname
	u := user.Current(c)
	key := datastore.NewKey(c, "module", vars["name"], 0, common.GetAccountKey(c, u))

	// Start a datastore transaction
	var e model.Module
	err := datastore.RunInTransaction(c, func(c appengine.Context) error {
		// Get the visualization object
		err := datastore.Get(c, key, &e)
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
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, e)
}