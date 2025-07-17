import requests
import os
from datetime import datetime, date

from google.cloud import bigquery
from dotenv import load_dotenv

from . import spotifyToken

load_dotenv()

access_token = spotifyToken.getSpotifyToken()

BQ_SERVICE_ACCOUNT = os.getenv('BQ_SERVICE_ACCOUNT')
BQ_PROJECT = os.getenv('BQ_PROJECT')

METADATA_DATASET= os.getenv('METADATA_DATASET')
MUSIC_METADATA_TABLE = os.getenv('MUSIC_METADATA_TABLE')

def getAlbumData(data):
    search_url = 'https://api.spotify.com/v1/search'

    query = data[1]
    search_type = 'album'
    limit = 1

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    params = {
        'q': query,  
        'type': search_type,  
        'limit': limit  
    }

    search_response = requests.get(search_url, headers=headers, params=params)
    search_results = search_response.json()

    for item in search_results['albums']['items']:
        # print(json.dumps(item, indent=3))
        artist_name = item['artists'][0]['name']
        artist_id = item['artists'][0]['id']
        artist_url = item['artists'][0]['external_urls']['spotify']
        album_name = item['name']
        album_url = item['external_urls']['spotify']
        release_date = item['release_date']
        image_url = item['images'][0]['url']
        added_date = date.today()

    release_date = datetime.strptime(release_date, "%Y-%m-%d")
    formatted_release_date = release_date.strftime("%B %d, %Y")

    formatted_added_date = added_date.strftime("%B %d, %Y")


    try:
        # Initialize BigQuery client with project ID and credentials
        client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

        # Define the query
        QUERY = f'''
            INSERT INTO
            `{METADATA_DATASET}.{MUSIC_METADATA_TABLE}`
            (artist_name, artist_id, artist_url, album_name, album_url, release_date, image_url, added_date)
            VALUES
            ("{artist_name}", "{artist_id}", '{artist_url}', '{album_name}', '{album_url}', '{formatted_release_date}', '{image_url}', '{formatted_added_date}')
        '''

        # Run the query
        print(QUERY)
        query_job = client.query(QUERY)
        query_job.result()

        return artist_id

    except Exception as e:
        print(f"Error executing query: {e}")

def getArtistData(artist_id):
    print(f"Artist ID: {artist_id}")

    endpoint = f'https://api.spotify.com/v1/artists/{artist_id}'

    query = artist_id
    search_type = 'artist'
    limit = 1

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    params = {
        'q': query,  
        'type': search_type,  
        'limit': limit  
    }

    search_response = requests.get(endpoint, headers=headers, params=params)
    search_results = search_response.json()
    
    if 'genres' in search_results and search_results['genres']:
        genres_list = []
        for i, j in enumerate(search_results['genres']):
            genres_list.append(search_results['genres'][i].capitalize())

        print(genres_list)

        try:
            # Initialize BigQuery client with project ID and credentials
            client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

            # Define the query
            QUERY = f'''
                UPDATE
                `{METADATA_DATASET}.music_metadata`
                SET artist_genres = {genres_list}
                WHERE artist_id = '{artist_id}'
            '''

            # Run the query
            query_job = client.query(QUERY)
            query_job.result()

        except Exception as e:
            print(f"Error executing query: {e}")