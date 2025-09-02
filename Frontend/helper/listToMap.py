import json

ogTables = [

]

for i in ogTables:
    mappedName = input(i + ": ")
    with open('lists.txt', 'a') as file:
        file.write(mappedName + '\n')

mapped = [
    
]

newmap = {}

for i, j in zip(ogTables, mapped):
    newmap[i] = j

print(json.dumps(newmap, indent=4))