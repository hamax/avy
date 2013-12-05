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
	"github.com/gorilla/mux"
	"net/http"

	"server/common"
)

func Init(s *mux.Router) {
	visualizationsInit(s.PathPrefix("/visualizations/").Subrouter())
	modulesInit(s.PathPrefix("/modules/").Subrouter())
	s.HandleFunc("/{path:.*}", api404)
}

// Serve a 404 error - object not found in the database etc.
func api404(w http.ResponseWriter, r *http.Request) {
	common.Serve404(w)
}