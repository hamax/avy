import json

avy_file_index = 0
avy_file = None

def avy(name, *args):
	global avy_file_index, avy_file

	# Start is a special command that opens a file
	if name == 'start':
		if avy_file:
			avy_file.close()
		avy_file = open('%d.avy' % avy_file_index, 'w')
		avy_file_index += 1
		return

	# Write the command and json serialized arguments
	sargs = [json.dumps(arg) for arg in args]
	avy_file.write('%s(%s)\n' % (name, ', '.join(sargs)))