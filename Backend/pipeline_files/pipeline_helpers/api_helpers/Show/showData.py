import os
import requests
from datetime import datetime, date

from dotenv import load_dotenv
from google.cloud import bigquery

load_dotenv()

BQ_SERVICE_ACCOUNT = os.getenv('BQ_SERVICE_ACCOUNT')
BQ_PROJECT = os.getenv('BQ_PROJECT')
TMDB_API_KEY = os.getenv('TMDB_API_KEY')

METADATA_DATASET = os.getenv('METADATA_DATASET')
SHOW_METADATA_TABLE = os.getenv('SHOW_METADATA_TABLE')
SHOW_RECS_METADATA_TABLE = os.getenv('SHOW_RECS_METADATA_TABLE')

def search_tv_show(api_key, query, page=1):
    url = f"https://api.themoviedb.org/3/search/tv"
    
    params = {
        'api_key': api_key,
        'query': query,
        'page': page
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if 'results' in data and len(data['results']) >= 1:
            data = data['results'][0]
            return data
        else:
            print(f"No shows found")
    else:
        print(f"Error: {response.status_code}")
        return None

def getShowDetails(data):

    show_title = data[1]

    genres_map = {
        10759: 'Action & Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        10762: 'Kids',
        9648: 'Mystery',
        10763: 'News',
        10764: 'Reality',
        10765: 'Science Fiction & Fantasy',
        10766: 'Soap',
        10767: 'Talk',
        10768: 'War & Politics',
        37: 'Western'
    }
        
    api_key = TMDB_API_KEY # Replace with your actual TMDb API key
    query = show_title  # The TV show you're searching for

    tv_show = search_tv_show(api_key, query)

    if tv_show:
        id = tv_show['id']
        title = tv_show['name']
        overview = tv_show['overview']
        overview_cleaned = overview.replace("\n", " ")
        first_air_date = tv_show['first_air_date']
        vote_avg = tv_show['vote_average']
        poster_path = tv_show['poster_path']
        poster_url = f'https://image.tmdb.org/t/p/w500{poster_path}'
        genres = tv_show['genre_ids']
        added_date = date.today()
    else:
        return None

    first_air_date = datetime.strptime(first_air_date, "%Y-%m-%d")
    formatted_first_air_date = first_air_date.strftime("%B %d, %Y")

    formatted_added_date = added_date.strftime("%B %d, %Y")

    genres_list = []

    for i, j in genres_map.items():
        if i in genres:
            genres_list.append(genres_map[i])

    if '"' in overview_cleaned:
        overview_cleaned = overview_cleaned.replace('"', '\\"')

    try:
        # Initialize BigQuery client with project ID and credentials
        client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

        # Define the query
        QUERY = f'''
            INSERT INTO
            `{METADATA_DATASET}.{SHOW_METADATA_TABLE}`
            (id, title, overview, first_air_date, vote_avg, poster_url, genres, added_date)
            VALUES
            ('{id}', '{title}', "{overview_cleaned}", '{formatted_first_air_date}', '{vote_avg}', '{poster_url}', {genres_list}, '{formatted_added_date}')
        '''
        print(QUERY)
        # Run the query
        query_job = client.query(QUERY)
        query_job.result()

    except Exception as e:
        print(f"Error executing query: {e}")

    url = f'https://api.themoviedb.org/3/tv/{id}/recommendations?api_key={TMDB_API_KEY}&total_results=10'
    response = requests.get(url)
    data = response.json()
    
    if 'results' in data:
        for i in data['results']:
            title = i['name']
            overview = i['overview']
            overview_cleaned = overview.replace("\n", " ")
            poster_path = i['poster_path']
            url = f'https://image.tmdb.org/t/p/w500{poster_path}'
            genres = i['genre_ids']
            release_date = i['first_air_date']
            vote_avg = i['vote_average']
            vote_count = i['vote_count']

            release_date = datetime.strptime(release_date, "%Y-%m-%d")
            formatted_release_date = release_date.strftime("%B %d, %Y")

            genres_list = []

            for i, j in genres_map.items():
                if i in genres:
                    genres_list.append(genres_map[i])

            if '"' in overview_cleaned:
                overview_cleaned = overview_cleaned.replace('"', '\\"')

            try:
                # Initialize BigQuery client with project ID and credentials
                client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

                # Define the query
                QUERY = f'''
                    INSERT INTO
                    `{METADATA_DATASET}.{SHOW_RECS_METADATA_TABLE}`
                    (original_show_id, title, overview, poster_path, genres, release_date, vote_avg, vote_count)
                    VALUES
                    ('{id}', '{title}', "{overview_cleaned}", '{url}', {genres_list}, '{formatted_release_date}', '{vote_avg}', '{vote_count}')
                '''

                print(QUERY)
                # Run the query
                query_job = client.query(QUERY)
                query_job.result()

            except Exception as e:
                print(f"Error executing query: {e}")
        else:
            print('No recommendations found.')