from dotenv import load_dotenv
import os
import json

import spotipy
from spotipy.oauth2 import SpotifyOAuth
from supabase import create_client

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")

sp_oauth = SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri="https://example.com/callback",
    scope="playlist-modify-public playlist-modify-private"
)

token_info = sp_oauth.get_access_token(as_dict=False)

sp = spotipy.Spotify(auth=token_info)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def getCurrentlyListeningIds():

    currently_listening_playlist_res = json.loads(supabase.schema("music_tables").table("album_spotifyPlaylistIds").select().execute().model_dump_json())['data']
    currently_listening_table_res = json.loads(supabase.schema("music_tables").table("album_currentlyListening").select().execute().model_dump_json())['data']

    playlist_albums = set(i['album'] for i in currently_listening_playlist_res)

    table_albums = set(i['title'] for i in currently_listening_table_res if i['original_table'] not in ('youtube', 'vinyl', None))

    new = table_albums - playlist_albums

    if new:
        currently_listening_ids = [{'album': i, 'tracks': [], 'album_id': ""} for i in new]
                
        for i in currently_listening_ids:
            try:
                search_result = sp.search(i['album'], type='album')
                album_id = search_result['albums']['items'][0]['id']
                i['album_id'] = album_id
                
                album = sp.album_tracks(album_id)

                for j in album['items']:
                    i['tracks'].append(j['id'])
            except:
                continue

    return currently_listening_ids

# def removeFromCurrentlyListeningPlaylist():

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

    for entry in currently_listening_ids:
        for track in entry['tracks']:
            supabase.schema("music_tables").table("album_spotifyPlaylistIds").insert({"album": entry['album'], "album_id": entry['album_id'], "track": track}).execute()


    for entry in currently_listening_ids:
        sp.user_playlist_add_tracks(user=sp.current_user()['id'], playlist_id='2BHeysCh0gYOjVIH7pU6uy', tracks=entry['tracks'])

insertIntoCurrentlyListeningPlaylist()