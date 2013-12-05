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

import java.util.ArrayList;

import net.algoviz.Avy;

public class Algorithm {
	public static void main(String[] argv) {
		Avy.cmd("start"); // Start a new avy file
		ArrayList<Integer> list = new ArrayList<Integer>();
		for (int i = 0; i < 10; i++) {
			Avy.cmd("step"); // Step in the animation
			list.add(i);
			Avy.cmd("list.add", i); // Tell avy that we added i to the list
		}
		Avy.close(); // Make sure all files are closed correctly
	}
}
