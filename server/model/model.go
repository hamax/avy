package model

import (
	"appengine"
)

type File struct {
	Filename string
	BlobKey appengine.BlobKey
}

type Visualization struct {
	Title string
	Files []File
}