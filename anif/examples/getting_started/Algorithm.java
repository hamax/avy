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
