package server

import (
	"appengine"
	"appengine/blobstore"
	"appengine/user"
	"github.com/gorilla/mux"
	"html/template"
	"net/http"

	"server/api"
	"server/common"
)

// dev
const (
	domain = "avy"
	baseUrl = "http://www.avy/"
)

// prod
/*
const (
	domain = "avy-project.appspot.com"
	baseUrl = "http://www.avy-project.appspot.com/"
)
*/

var templates = template.Must(template.ParseGlob("client/index.html"))

type IndexData struct {
	User *user.User
}

func init() {
	r := mux.NewRouter()

	// Register redirect handle for main domain
	r.HandleFunc("/{path:.*}", redirect).Host(domain)

	// Register handles for www subdomain
	www := r.Host("www." + domain).Subrouter()
	api.Init(www.PathPrefix("/api/").Subrouter()) // Api handles
	www.HandleFunc("/login", loginHandle)
	www.HandleFunc("/logout", logoutHandle)
	www.HandleFunc("/{path:.*}", root) // Anything else goes to angularjs

	// Register handles for anif subdomain
	anif := r.Host("anif." + domain).Subrouter()
	anif.HandleFunc("/", serveHandle)

	http.Handle("/", r)
}

func redirect(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	http.Redirect(w, r, baseUrl + vars["path"], http.StatusFound)
}

func root(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	
	// Get current user
	u := user.Current(c)

	templates.ExecuteTemplate(w, "index", IndexData{u})
}

func loginHandle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")

	c := appengine.NewContext(r)
	u := user.Current(c)

	if u == nil {
		url, err := user.LoginURL(c, "/")
		if err != nil {
			common.ServeError(c, w, err)
			return
		}
		w.Header().Set("Location", url)
		w.WriteHeader(http.StatusFound)
		return
	}

	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusFound)
}

func logoutHandle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")

	c := appengine.NewContext(r)
	u := user.Current(c)

	if u != nil {
		url, err := user.LogoutURL(c, "/")
		if err != nil {
			common.ServeError(c, w, err)
			return
		}
		w.Header().Set("Location", url)
		w.WriteHeader(http.StatusFound)
		return
	}

	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusFound)
}

func serveHandle(w http.ResponseWriter, r *http.Request) {
	blobstore.Send(w, appengine.BlobKey(r.FormValue("blobKey")))
}