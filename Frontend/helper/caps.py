import json

def caps(arr):

    # dont = ['of', 'for']

    new = []

    for string in arr:
        new.append(string.title())

    print(json.dumps(new, indent=2))

caps([
    "ted chiang",
    "the stars my destination",
    "greatest short stories volume 4",
    "great american short stories",
    "the treasury of english short stories",
    "mark twain short stories",
    "classic short stories",
    "everythings eventual",
    "we can remember it for you wholesale",
    "LLA1",
    "interfaces",
    "years best science fiction",
    "LLA2",
    "esquire",
    "LLA3",
    "LLA4",
    "LLA6",
    "twentieth century drama",
    "mystery and suspense",
    "ten of the best",
    "pulp fiction",
    "hitchcock",
    "ursula k le guin",
    "harlan ellison",
])