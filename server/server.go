package server

import (
	"appengine"
	"appengine/user"
	"appengine/blobstore"
	"html/template"
	"net/http"
	"net/url"
	"io"
	"fmt"
)

var templates = template.Must(template.ParseGlob("client/index.html"))

type IndexData struct {
	User *user.User
	UploadUrl *url.URL
}

func serveError(c appengine.Context, w http.ResponseWriter, err error) {
        w.WriteHeader(http.StatusInternalServerError)
        w.Header().Set("Content-Type", "text/plain")
        io.WriteString(w, "Internal Server Error")
        c.Errorf("%v", err)
}

func init() {
	http.HandleFunc("/login", loginHandle)
	http.HandleFunc("/logout", logoutHandle)
	http.HandleFunc("/upload", uploadHandle)
	http.HandleFunc("/serve", serveHandle)
	http.HandleFunc("/", root)
}

func root(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	
	// Get current user
	u := user.Current(c)

	// Get upload url
	uploadUrl, err := blobstore.UploadURL(c, "/upload", nil)
	if err != nil {
		serveError(c, w, err)
		return
	}

	templates.ExecuteTemplate(w, "index", IndexData{u, uploadUrl})
}

func loginHandle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")

	c := appengine.NewContext(r)
	u := user.Current(c)

	if u == nil {
		url, err := user.LoginURL(c, "/")
		if err != nil {
			serveError(c, w, err)
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
			serveError(c, w, err)
			return
		}
		w.Header().Set("Location", url)
		w.WriteHeader(http.StatusFound)
		return
	}

	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusFound)
}

func uploadHandle(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	blobs, _, err := blobstore.ParseUpload(r)
	if err != nil {
		serveError(c, w, err)
		return
	}

	file := blobs["file"]
	if len(file) == 0 {
		c.Errorf("no file uploaded")
		fmt.Fprint(w, "no file uploaded")
		return
	}

	//string(file[0].BlobKey)
	fmt.Fprint(w, "ok")
}

func serveHandle(w http.ResponseWriter, r *http.Request) {
	blobstore.Send(w, appengine.BlobKey(r.FormValue("blobKey")))
}