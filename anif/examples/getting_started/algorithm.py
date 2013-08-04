import sys

if len(sys.argv) > 1 and sys.argv[1] == 'avy':
	from avy import avy
else:
	def avy(*argv):
		pass

avy('start') # Start a new avy file
list = []
for i in range(10):
	avy('step') # Step in the animation
	list.append(i)
	avy('list.add', i) # Tell avy that we added i to the list
