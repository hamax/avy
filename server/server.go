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

package server

import (
	"appengine"
	"appengine/user"
	"github.com/gorilla/mux"
	"html/template"
	"net/http"

	"server/anif"
	"server/api"
	"server/common"
	"server/model"
)

// dev
const (
	domain = "avy"
	port = ":8080"
)

// prod
/*
const (
	domain = "algoviz.net"
	port = ""
)
*/

var templates = template.Must(template.ParseGlob("client/index.html"))

type IndexData struct {
	User *user.User
	Accout *model.Account
	Domain string
	Port string
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
	www.HandleFunc("/{path:.*}", root) // Anything else goes to AngularJS

	// Register handles for anif subdomain
	anif.Init(r.Host("anif." + domain).Subrouter())

	http.Handle("/", r)
}

// Redirects to the main www domain (keeps the path)
func redirect(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	http.Redirect(w, r, "http://www." + domain + port + "/" + vars["path"], http.StatusFound)
}

// Serves the AngularJS application
func root(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	// Get user and account
	u := user.Current(c)
	acc, err := model.GetAccount(c, u)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	templates.ExecuteTemplate(w, "index", IndexData{u, acc, domain, port})
}

// Login using Google account
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