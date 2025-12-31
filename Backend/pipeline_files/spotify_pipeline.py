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

def getCurrentlyListeningIds():

    QUERY = f'''
        SELECT * FROM {BQ_PROJECT}.{MUSIC_TABLES_DATASET}.album_currentlyListening
    '''

    query_job = client.query(QUERY)
    rows = query_job.result()

    currently_listening = []

    for row in rows:
        if 'vinyl' in row[1]:
            continue
        elif 'youtube' in row[1]:
            continue
        else:
            currently_listening.append(row[1])
            
    currently_listening_ids = [[] for i in range(len(currently_listening) - 1)]
    albums_to_go = len(currently_listening) - 1

    for i in currently_listening:
        try:
            search_result = sp.search(i, type='album')
            album_id = search_result['albums']['items'][0]['id']
            album = sp.album_tracks(album_id)

            for j in album['items']:
                currently_listening_ids[albums_to_go - 1].append(j['id'])
            albums_to_go -= 1
        except:
            continue

    return currently_listening_ids

def removeFromCurrentlyListeningPlaylist():

    try:


        SELECT_QUERY = f'''
            SELECT track_ids FROM {BQ_PROJECT}.{MUSIC_TABLES_DATASET}.album_spotifyPlaylistIds
        '''

        query_job = client.query(SELECT_QUERY)
        [rows] = query_job.result()

        rows = rows[0]

        tracks = [{'uri': rows[i], 'positions': [i]} for i in range(len(rows))]

        tracks_to_delete = []

        while len(tracks) > 0:
            if len(tracks) < 10:
                for i in range(0, len(tracks)):
                    tracks_to_delete.append(tracks[i])
                sp.user_playlist_remove_specific_occurrences_of_tracks(user=sp.current_user()['id'], playlist_id='2BHeysCh0gYOjVIH7pU6uy', tracks=tracks_to_delete)
                tracks_to_delete.clear()
                for i in range(0, len(tracks)):
                    tracks.pop(0)
            else:
                for i in range(0, 10):
                    tracks_to_delete.append(tracks[i])
                sp.user_playlist_remove_specific_occurrences_of_tracks(user=sp.current_user()['id'], playlist_id='2BHeysCh0gYOjVIH7pU6uy', tracks=tracks_to_delete)
                tracks_to_delete.clear()
                for i in range(0, 10):
                    tracks.pop(0)

    except Exception as e:
        print(e)

    DELETE_QUERY = f'''
        DELETE FROM {BQ_PROJECT}.{MUSIC_TABLES_DATASET}.album_spotifyPlaylistIds WHERE 1 = 1
    '''

    query_job = client.query(DELETE_QUERY)
    query_job.result()

def insertIntoCurrentlyListeningPlaylist():

    currently_listening_ids = getCurrentlyListeningIds()

    all = []

    for i in currently_listening_ids:
        for j in i:
            all.append(j)

    INSERT_QUERY = f'''
        INSERT INTO {BQ_PROJECT}.{MUSIC_TABLES_DATASET}.album_spotifyPlaylistIds (id, track_ids) VALUES (1, {all})
    '''

    query_job = client.query(INSERT_QUERY)
    query_job.result()

    for album in currently_listening_ids:
        sp.user_playlist_add_tracks(user=sp.current_user()['id'], playlist_id='2BHeysCh0gYOjVIH7pU6uy', tracks=album)

def createSpotifyPlaylist():

    removeFromCurrentlyListeningPlaylist()

    insertIntoCurrentlyListeningPlaylist()

createSpotifyPlaylist()