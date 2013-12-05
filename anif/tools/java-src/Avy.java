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

package net.algoviz;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import com.google.gson.Gson;

public class Avy {
	private static int fileIndex = 0;
	private static PrintWriter file = null;
	
	private static Gson gson = new Gson();
	
	public static void cmd(String name, Object ...args) {
		if (name.equals("start")) {
			if (file != null) {
				file.close();
			}
			
			try {
				file = new PrintWriter(new FileWriter(String.format("%d.avy", fileIndex++)));
			} catch (IOException e) {
				// TODO: do something with the exception
				return;
			}
			return;
		}
		
		StringBuffer sb = new StringBuffer(name);
		sb.append("(");
		for (int i = 0; i < args.length; i++) {
			if (i > 0) {
				sb.append(", ");
			}
			sb.append(gson.toJson(args[i]));
		}
		sb.append(")");
		file.println(sb.toString());
	}
	
	public static void close() {
		if (file != null) {
			file.close();
		}
	}
}
