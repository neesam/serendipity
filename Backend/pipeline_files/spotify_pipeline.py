from dotenv import load_dotenv
import os
import json

from google.cloud import bigquery
import spotipy
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()

BQ_SERVICE_ACCOUNT = os.getenv('BQ_SERVICE_ACCOUNT')
BQ_PROJECT = os.getenv('BQ_PROJECT')
MUSIC_TABLES_DATASET= os.getenv('MUSIC_TABLES_DATASET')
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

sp_oauth = SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri="http://localhost:3000/",
    scope="playlist-modify-public playlist-modify-private"
)

token_info = sp_oauth.get_access_token(as_dict=False)

sp = spotipy.Spotify(auth=token_info)

client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

# Define the query
QUERY = f'''
    SELECT * FROM {BQ_PROJECT}.{MUSIC_TABLES_DATASET}.album_currentlyListening
'''

# print(QUERY)
# Run the query
query_job = client.query(QUERY)
rows = query_job.result()

currently_listening = [row[1] for row in rows]
print(currently_listening)
currently_listening_tracks = [[] for i in range(len(currently_listening) - 1)]
albums_to_go = len(currently_listening) - 1
print(albums_to_go)

for i in currently_listening:
    search_result = sp.search(i, type='album')
    album_id = search_result['albums']['items'][0]['id']
    album = sp.album_tracks(album_id)

    for j in album['items']:
        currently_listening_tracks[albums_to_go - 1].append(j['id'])
    albums_to_go -= 1

print(json.dumps(currently_listening_tracks, indent=3))

# sp.user_playlist_create(user=sp.current_user()['id'], name="Currently Listening", public=True)

for i in currently_listening_tracks:
    sp.user_playlist_add_tracks(user=sp.current_user()['id'], playlist_id='2BHeysCh0gYOjVIH7pU6uy', tracks=i)