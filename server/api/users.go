package api

/*
func usersInit(s *mux.Router) {
	s.HandleFunc("/{key}", getUser).Methods("GET")
}

func getVisualization(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	vars := mux.Vars(r)

	key, err := datastore.DecodeKey(vars["key"])
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	var e model.Visualization
	err = datastore.Get(c, key, &e)
	if err != nil {
		common.ServeError(c, w, err)
		return
	}

	common.WriteJson(c, w, e)
}
*/