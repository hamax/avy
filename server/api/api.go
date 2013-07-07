package api

import (
	"github.com/gorilla/mux"
)

func Init(s *mux.Router) {
	visualizationsInit(s.PathPrefix("/visualizations/").Subrouter())
}