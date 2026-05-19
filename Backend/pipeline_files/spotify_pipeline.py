from dotenv import load_dotenv
import os
import json

import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import CacheHandler
from supabase import create_client

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class SupabaseCacheHandler(CacheHandler):
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.token_id = 'spotify_token'

    def get_cached_token(self):
        try:
            result = self.supabase.schema("music_tables").table('spotify_cache') \
                .select('token_info') \
                .eq('id', self.token_id) \
                .execute()
            if result.data and len(result.data) > 0:
                return json.loads(result.data[0]['token_info'])
            return None
        except Exception as e:
            print(f'Error getting cached token: {e}')
            return None

    def save_token_to_cache(self, token_info):
        try:
            self.supabase.schema("music_tables").table('spotify_cache') \
                .upsert({
                    'id': self.token_id,
                    'token_info': json.dumps(token_info)
                }) \
                .execute()
        except Exception as e:
            print(f'Error saving token to cache: {e}')

cache_handler = SupabaseCacheHandler()

sp_oauth = SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri="https://example.com/callback",
    scope="playlist-modify-public playlist-modify-private",
    cache_handler=cache_handler
)

token_info = sp_oauth.get_access_token(as_dict=False)
sp = spotipy.Spotify(auth=token_info)

def getCurrentlyListeningIds():

    currently_listening_playlist_res = json.loads(supabase.schema("music_tables").table("album_spotifyPlaylistIds").select().execute().model_dump_json())['data']
    currently_listening_table_res = json.loads(supabase.schema("music_tables").table("album_currentlyListening").select().execute().model_dump_json())['data']

    playlist_albums = set(i['album'] for i in currently_listening_playlist_res)

    table_albums = set(i['title'] for i in currently_listening_table_res if i['original_table'] not in ('youtube', 'vinyl', 'underground', None))

    new = table_albums - playlist_albums

    if new:
        currently_listening_ids = [{'album': i, 'tracks': [], 'album_id': ""} for i in new]
                
        for i in currently_listening_ids:
            try:
                search_result = sp.search(i['album'], type='album')

                albums = search_result['albums']['items']
                candidates = [album['name'].lower() + " - " + album['artists'][0]['name'].lower() for album in albums][:3]

                if "-" in i['album'] and len(i['album'].split('-')) == 2:
                    for index, album in enumerate(candidates):
                        if album == i['album'].lower():
                            album_id = search_result['albums']['items'][index]['id']
                            break
                        else:
                            continue

                    for index, album in enumerate(candidates):
                        if " - ".join(album.split(" - ")[::-1]) == i['album'].lower():
                            album_id = search_result['albums']['items'][index]['id']
                            break
                        else:
                            continue

                else:
                    for index, album in enumerate(candidates):
                        if i['album'].lower() in album:
                            album_id = search_result['albums']['items'][index]['id']
                            break
                        else:
                            continue

                i['album_id'] = album_id
                
                album = sp.album_tracks(album_id)

                for j in album['items']:
                    i['tracks'].append(j['id'])
            except:
                continue

    return currently_listening_ids

def insertIntoCurrentlyListeningPlaylist():

    currently_listening_ids = getCurrentlyListeningIds()

    for entry in currently_listening_ids:
        for track in entry['tracks']:
            supabase.schema("music_tables").table("album_spotifyPlaylistIds").insert({"album": entry['album'], "album_id": entry['album_id'], "track": track}).execute()


    for entry in currently_listening_ids:
        sp.playlist_add_items(playlist_id='2BHeysCh0gYOjVIH7pU6uy', items=entry['tracks'])

insertIntoCurrentlyListeningPlaylist()