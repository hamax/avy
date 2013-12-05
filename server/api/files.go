/* ========================================================================
 * Avy Algorithm Visualization Framework
 * https://github.com/hamax/avy
 * ========================================================================
 * Copyright 2013 Ziga Ham
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

package api

import (
	"appengine"
	"appengine/blobstore"
	"net/http"

	"server/model"
)

// Common function for uploading a file
func uploadFile(c appengine.Context, r *http.Request, currentFiles []model.File) ([]model.File, error) {
	// Parse file uploads
	blobs, _, err := blobstore.ParseUpload(r)
	if err != nil {
		return currentFiles, err
	}
	files := blobs["file"]
	if len(files) == 0 {
		c.Errorf("no file uploaded")
		return currentFiles, nil
	}

	// Add the new file
	for i := range files {
		newFile := model.File{files[i].Filename, files[i].BlobKey}

		// Check if it already exists
		exists := false
		for j := range currentFiles {
			if currentFiles[j].Filename == newFile.Filename {
				// Overwrite
				// TODO: delete the old file
				currentFiles[j] = newFile
				exists = true
				break
			}
		}

		if !exists {
			currentFiles = append(currentFiles, newFile)
		}
	}

	return currentFiles, nil
}

// Common function for deleating a file
func deleteFile(c appengine.Context, r *http.Request, files []model.File) ([]model.File, error) {
	filename := r.PostFormValue("filename")

	// Find and delete the file
	for i := range files {
		if files[i].Filename == filename {
			// TODO: delete the file
			result := make([]model.File, len(files) - 1)
			copy(result, files[:i])
			copy(result[i:], files[i + 1:])
			return result, nil
		}
	}

	// TODO: error, file not found
	return nil, nil
}