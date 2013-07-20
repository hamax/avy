package api

import (
	"github.com/gorilla/mux"
	"net/http"

	"server/common"
)

func Init(s *mux.Router) {
	visualizationsInit(s.PathPrefix("/visualizations/").Subrouter())
	modulesInit(s.PathPrefix("/modules/").Subrouter())
	s.HandleFunc("/{path:.*}", api404)
}

func api404(w http.ResponseWriter, r *http.Request) {
	common.Serve404(w)
}