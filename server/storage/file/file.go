package file

import (
	"appengine"
	"appengine/blobstore"
	"net/http"

	"server/storage"
)

type File struct {
	Filename string
	BlobKey appengine.BlobKey
}

func init() {
	http.HandleFunc("/rest/uploadurl", storage.CreateHandler(get, nil, nil, nil))
}

// TODO: validate parameters
func get(w http.ResponseWriter, r *http.Request) interface{} {
	c := appengine.NewContext(r)

	r.ParseForm()
	url := "/rest/visualization/file?key=" + r.Form["vkey"][0]

	uploadUrl, err := blobstore.UploadURL(c, url, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil
	}

	return uploadUrl.Path
}