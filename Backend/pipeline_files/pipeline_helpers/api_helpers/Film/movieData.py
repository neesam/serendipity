import os
import requests
from datetime import datetime, date

from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

BQ_SERVICE_ACCOUNT = os.getenv('BQ_SERVICE_ACCOUNT')
BQ_PROJECT = os.getenv('BQ_PROJECT')

TMDB_API_KEY = os.getenv('TMDB_API_KEY')

METADATA_DATASET= os.getenv('METADATA_DATASET')
FILM_METADATA_TABLE = os.getenv('FILM_METADATA_TABLE')
FILM_RECS_METADATA_TABLE = os.getenv('FILM_RECS_METADATA_TABLE')

def getMovieData(data):

    film_title = data[1]

    genres_map = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
    }

    url = f'https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={film_title}'
    response = requests.get(url)
    if response.status_code == 200:
        # Parse the response JSON
        data = response.json()
        
        # Check if there are any results
        if data['results']:
            # Get the first movie from the results
            movie = data['results'][0]

            title = movie['title']
            id = movie['id']
            overview = movie['overview']
            release_date = movie['release_date']
            vote_avg = movie['vote_average']
            vote_count = movie['vote_count']
            genres = movie['genre_ids']
            poster_path = movie['poster_path']
            url = f'https://image.tmdb.org/t/p/w500{poster_path}'
            added_date = date.today()

            release_date = datetime.strptime(release_date, "%Y-%m-%d")
            formatted_release_date = release_date.strftime("%B %d, %Y")

            formatted_added_date = added_date.strftime("%B %d, %Y")

            if '"' in overview:
                overview = overview.replace('"', '\\"')

            genres_list = []

            for i, j in genres_map.items():
                if i in genres:
                    genres_list.append(genres_map[i])
                    
            try:
                # Initialize BigQuery client with project ID and credentials
                client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

                # Define the query
                QUERY = f'''
                    INSERT INTO
                    `{METADATA_DATASET}.{FILM_METADATA_TABLE}`
                    (id, title, overview, release_date, poster_path, genres, vote_avg, vote_count, added_date)
                    VALUES
                    ('{id}', '{title}', "{overview}", '{formatted_release_date}', '{url}', {genres_list}, '{vote_avg}', '{vote_count}', '{formatted_added_date}')
                '''

                print(QUERY)
                # Run the query
                query_job = client.query(QUERY)
                query_job.result()

            except Exception as e:
                print(f"Error executing query: {e}")

            url = f'https://api.themoviedb.org/3/movie/{id}/recommendations?api_key={TMDB_API_KEY}'
            response = requests.get(url)
            data = response.json()
            
            if data['results']:
                for i in data['results']:
                    title = i['title']
                    overview = i['overview']
                    poster_path = i['poster_path']
                    url = f'https://image.tmdb.org/t/p/w500{poster_path}'
                    genres = i['genre_ids']
                    release_date = i['release_date']
                    vote_avg = i['vote_average']
                    vote_count = i['vote_count']

                    release_date = datetime.strptime(release_date, "%Y-%m-%d")
                    formatted_release_date = release_date.strftime("%B %d, %Y")

                    if '"' in overview:
                        overview = overview.replace('"', '\\"')

                    genres_list = []

                    for i, j in genres_map.items():
                        if i in genres:
                            genres_list.append(genres_map[i])

                    try:
                        # Initialize BigQuery client with project ID and credentials
                        client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

                        # Define the query
                        QUERY = f'''
                            INSERT INTO
                            `{METADATA_DATASET}.{FILM_RECS_METADATA_TABLE}`
                            (original_film_id, title, overview, poster_path, genres, release_date, vote_avg, vote_count)
                            VALUES
                            ('{id}', '{title}', "{overview}", '{url}', {genres_list}, '{formatted_release_date}', '{vote_avg}', '{vote_count}')
                        '''

                        print(QUERY)
                        # Run the query
                        query_job = client.query(QUERY)
                        query_job.result()

                    except Exception as e:
                        print(f"Error executing query: {e}")
            else:
                print('No recommendations found.')

            url = f'https://api.themoviedb.org/3/movie/{id}?api_key={TMDB_API_KEY}'
            response = requests.get(url)
            data = response.json()
            
            if data:
                budget = data['budget']
                imdb_id = data['imdb_id']
                production_companies = data['production_companies']
                runtime = data['runtime']

                prod_company_names = []

                for i in production_companies:
                    prod_company_names.append(i['name'])

                try:
                        # Initialize BigQuery client with project ID and credentials
                        client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

                        # Define the query
                        QUERY = f'''
                            UPDATE
                            `{METADATA_DATASET}.{FILM_METADATA_TABLE}`
                            SET budget = '{budget}', imdb_id = '{imdb_id}', production_companies = {prod_company_names}, runtime = '{runtime}'
                            WHERE id = '{id}'
                        '''

                        print(QUERY)
                        # Run the query
                        query_job = client.query(QUERY)
                        query_job.result()

                except Exception as e:
                    print(f"Error executing query: {e}")
        else:
            print('No movies found.')
    else:
        print(f"Error: Unable to fetch data (Status code: {response.status_code})")
