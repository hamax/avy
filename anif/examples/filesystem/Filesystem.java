import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import net.algoviz.Avy;

public class Filesystem {
	public static void main(String[] argv) throws IOException {
	    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
	    PrintWriter out = new PrintWriter(System.out);
	    
	    Folder cur = new Folder("", null);
	    Avy.cmd("start");
	    Avy.cmd("self.addNode", cur.hashCode(), "/");
	    Avy.cmd("step");
	    
	    int n = Integer.parseInt(in.readLine());
	    for (int i = 0; i < n; i++) {
	    	String[] cmd = in.readLine().trim().split(" ");
	    	
	    	if (cmd[0].equals("pwd")) {
	    		out.println(cur.pwd());
	    	} else if (cmd[0].equals("mkdir")) {
	    		cur.mkdir(cmd[1]);
	    	} else if (cmd[0].equals("cd")) {
	    		cur = cur.cd(cmd[1]);
	    		Avy.cmd("self.select", cur.hashCode());
	    		Avy.cmd("step");
	    	}
	    }
	    
	    out.close();
	    Avy.close();
	}
}

class Folder {
	private String name;
	private Folder parent;
	private HashMap<String, Folder> children;
	
	Folder(String name, Folder parent) {
		this.name = name;
		this.parent = parent;
		this.children = new HashMap<String, Folder>();
	}
	
	String pwd() {
		if (parent == null) {
			return "/";
		}
		
		ArrayList<Folder> list = new ArrayList<Folder>();
		Folder c = this;
		while (c.parent != null) {
			list.add(c);
			c = c.parent;
		}
		
		StringBuffer path = new StringBuffer();
		for (int i = list.size() - 1; i >= 0; i--) {
			path.append("/");
			path.append(list.get(i).name);
		}
		return path.toString();
	}
	
	void mkdir(String name) {
		if (!children.containsKey(name)) {
			Folder n = new Folder(name, this);
			children.put(name, n);
			Avy.cmd("self.addNode", n.hashCode(), name, hashCode());
			Avy.cmd("step");
		}
	}
	
	Folder cd(String name) {
		if (name.equals("..")) {
			if (parent != null) {
				return parent;
			}
		} else {
			Folder c = children.get(name);
			if (c != null) {
				return c;
			}
		}
		
		// In case of error, don't change the dir
		return this;
	}
}