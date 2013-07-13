package model

import (
	"appengine"
	"time"
)

type Account struct {
	Devname string
}

type Visualization struct {
	Title string
	Date time.Time
	Files []File
}

type Module struct {
	Devname string
	Name string
	Date time.Time
	Files []File
}

type File struct {
	Filename string
	BlobKey appengine.BlobKey
}