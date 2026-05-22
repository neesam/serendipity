import os
import json
import logging
import sys

import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import CacheHandler
from supabase import create_client

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


class SupabaseCacheHandler(CacheHandler):
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.token_id = "spotify_token"

    def get_cached_token(self):
        try:
            result = (
                self.supabase.schema("music_tables")
                .table("spotify_cache")
                .select("token_info")
                .eq("id", self.token_id)
                .execute()
            )
            if result.data and len(result.data) > 0:
                return json.loads(result.data[0]["token_info"])
            return None
        except Exception as e:
            print(f"Error getting cached token: {e}")
            return None

    def save_token_to_cache(self, token_info):
        try:
            self.supabase.schema("music_tables").table("spotify_cache").upsert(
                {"id": self.token_id, "token_info": json.dumps(token_info)}
            ).execute()
        except Exception as e:
            print(f"Error saving token to cache: {e}")


cache_handler = SupabaseCacheHandler()

sp_oauth = SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri="https://example.com/callback",
    scope="playlist-modify-public playlist-modify-private",
    cache_handler=cache_handler,
)

try:
    token_info = sp_oauth.get_access_token(as_dict=False)
except Exception as e:
    logging.exception(f"Failed to get access token from Spotipy: {e}")

try:
    sp = spotipy.Spotify(auth=token_info)
except Exception as e:
    logging.exception(f"Failed to initialize Spotipy client: {e}")

album = sys.argv[1]

try:
    tracks_res = json.loads(
        supabase.schema("music_tables")
        .table("album_spotifyPlaylistIds")
        .select("track")
        .eq("album", album)
        .execute()
        .model_dump_json()
    )["data"]
except Exception as e:
    logging.exception(f"Failed to retrieve tracks for {album}: {e}")

tracks = [i["track"] for i in tracks_res]

try:
    sp.playlist_remove_all_occurrences_of_items(
        playlist_id="2BHeysCh0gYOjVIH7pU6uy", items=tracks
    )
except Exception as e:
    logging.exception(
        f"Failed to remove {album} tracks from currently listening playlist: {e}"
    )

try:
    sp.playlist_remove_all_occurrences_of_items(
        playlist_id="6Gm5NaBxTJVUQycxYhsEeP", items=[tracks[0]]
    )
except Exception as e:
    logging.exception(
        f"Failed to remove {album} tracks from currently listening albums playlist: {e}"
    )

try:
    supabase.schema("music_tables").table("album_spotifyPlaylistIds").delete().eq(
        "album", album
    ).execute()
except Exception as e:
    logging.exception(
        f"Failed to remove {album} track IDs from album_spotifyPlaylistIds : {e}"
    )
