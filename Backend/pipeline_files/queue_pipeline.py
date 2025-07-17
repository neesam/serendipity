from dotenv import load_dotenv

from pipeline_files.pipeline_helpers.api_helpers.Music.musicData import getAlbumData
from pipeline_files.pipeline_helpers.api_helpers.Music.musicData import getArtistData
from pipeline_files.pipeline_helpers.api_helpers.Film.movieData import getMovieData
from pipeline_files.pipeline_helpers.api_helpers.Show.showData import getShowDetails
from pipeline_files.pipeline_helpers.api_helpers.Book.bookDetails import getBookDetails
from pipeline_helpers.extractionLogic import extract
from pipeline_helpers.queueDelete import deleteFromQueue

load_dotenv()

def apiCalls(data):
    for i in data:
        if i[2] == 'album':
            artist_id = getAlbumData(i)
            getArtistData(artist_id)
        elif i[2] == 'film':            
            getMovieData(i)
        elif i[2] == 'show':
            getShowDetails(i)
        else:
            getBookDetails(i)

data = extract()
apiCalls(data)
deleteFromQueue()