package model

import (
	"appengine"
	"time"
)

type Account struct {

}

type Visualization struct {
	Title string
	Date time.Time
	Files []File
}

type File struct {
	Filename string
	BlobKey appengine.BlobKey
}