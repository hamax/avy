package model

import (
	"appengine"
	"time"
)

type File struct {
	Filename string
	BlobKey appengine.BlobKey
}

type Visualization struct {
	Title string
	Date time.Time
	Files []File
}