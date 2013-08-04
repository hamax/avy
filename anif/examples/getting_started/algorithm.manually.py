avy_file = open('0.avy', 'w') # Start a new avy file
list = []
for i in range(10):
	avy_file.write('step()\n') # Step in the animation
	list.append(i)
	avy_file.write('list.add(%d)\n' % i) # Tell avy that we added i to the list
