package visualization

import (
	"appengine"
	"appengine/datastore"
	"appengine/blobstore"
	"net/http"

	"server/storage"
)

type Visualization struct {
	Title string
	Files []File
}

type File struct {
	Filename string
	BlobKey appengine.BlobKey
}

func init() {
	http.HandleFunc("/rest/visualization", storage.CreateHandler(get, post, nil, nil))
	http.HandleFunc("/rest/visualization/file", storage.CreateHandler(nil, filePost, nil, nil))
}

// TODO: parameter validation
func get(w http.ResponseWriter, r *http.Request) interface{} {
	c := appengine.NewContext(r)

	r.ParseForm()
	key, err := datastore.DecodeKey(r.Form["key"][0])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	var e Visualization
	err = datastore.Get(c, key, &e)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	return e
}

func post(w http.ResponseWriter, r *http.Request) interface{} {
	c := appengine.NewContext(r)

	e := Visualization{}

	key, err := datastore.Put(c, datastore.NewIncompleteKey(c, "visualization", nil), &e)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	return key
}

// TODO: transaction, multiple files, error checking
func filePost(w http.ResponseWriter, r *http.Request) interface{} {
	c := appengine.NewContext(r)

	// Check if we have a file uploaded
	blobs, _, err := blobstore.ParseUpload(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	files := blobs["file"]
	if len(files) == 0 {
		c.Errorf("no file uploaded")
		return nil
	}

	// Get the visualization object
	r.ParseForm()
	key, err := datastore.DecodeKey(r.Form["key"][0])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	var e Visualization
	err = datastore.Get(c, key, &e)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	// Add the new file
	e.Files = append(e.Files, File{"test", files[0].BlobKey})
	
	// Save the visualization object
	key, err = datastore.Put(c, key, &e)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	return nil
}