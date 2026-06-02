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
playlist = sys.argv[2]
original_table = sys.argv[3]


def get_tracks_for_album():

    album_id_placeholder = ""
    tracks = []

    try:
        search_result = sp.search(album, type="album")
    except Exception as e:
        logging.exception(f"Search failed for {album}: {e}")

    albums = search_result["albums"]["items"]

    candidates = [
        album["name"].lower() + " - " + album["artists"][0]["name"].lower()
        for album in albums
    ][:3]

    if " - " in album and len(album.split(" - ")) == 2:
        for index, album_candidate in enumerate(candidates):
            if album_candidate == album.lower():
                album_id = search_result["albums"]["items"][index]["id"]
                break
            else:
                continue

        for index, album_candidate in enumerate(candidates):
            if " - ".join(album_candidate.split(" - ")[::-1]) == album.lower():
                album_id = search_result["albums"]["items"][index]["id"]
                break
            else:
                continue

        if "&" in album.split(" - ")[0]:
            for index, album_candidate in enumerate(candidates):
                if (
                    album.split(" - ")[0].split(" & ")[0].lower()
                    == album_candidate.split(" - ")[1]
                    or album.split(" - ")[0].split(" & ")[1].lower()
                    == album_candidate.split(" - ")[1]
                ):
                    if album.split(" - ")[1].lower() == "".join(
                        album_candidate.split(" - ")[0].split(" - ")
                    ) or " ".join(album.split(" - ")[1].lower().split("-")) == "".join(
                        album_candidate.split(" - ")[0].split(" - ")
                    ):
                        album_id = search_result["albums"]["items"][index]["id"]
                        break
                    else:
                        album_id = search_result["albums"]["items"][index]["id"]
                        break
                else:
                    continue

        for index, album_candidate in enumerate(candidates):
            if (
                album.split(" - ")[0].lower() == album_candidate.split(" - ")[0].lower()
                or album.split(" - ")[0].lower()
                == album_candidate.split(" - ")[1].lower()
                or album.split(" - ")[1].lower()
                == album_candidate.split(" - ")[0].lower()
                or album.split(" - ")[1].lower()
                == album_candidate.split(" - ")[1].lower()
            ):
                album_id = search_result["albums"]["items"][index]["id"]
                break

    else:
        for index, album_candidate in enumerate(candidates):
            if (
                album == album_candidate.split(" - ")[1]
                or album.lower() == album_candidate.split(" - ")[1]
                or album.title() == album_candidate.split(" - ")[1]
            ):
                album_id = search_result["albums"]["items"][index]["id"]
                break

    if not album_id:
        return False

    album_id_placeholder = album_id

    try:
        album = sp.album_tracks(album_id_placeholder)
    except Exception as e:
        logging.exception(f"Failed to retrieve album tracks for {album}: {e}")

    for j in album["items"]:
        tracks.append(j["id"])

    return tracks


def add_to_rym_playlist(tracks):
    tracks = get_tracks_for_album()

    if playlist == "4.5":
        try:
            sp.playlist_add_items(playlist_id="39wTXtcyVDlGd2wrIqxKlx", items=tracks)
        except Exception as e:
            logging.exception(f"Failed to upload tracks to 4.5/5 playlist: {e}")

        try:
            sp.playlist_add_items(playlist_id="2SGW5aO6eNibN1xHWkb7EX", items=tracks)
        except Exception as e:
            logging.exception(f"Failed to upload tracks to favorites playlist: {e}")

        try:
            four_point_five_count = (
                supabase.table("table_playlist_stats")
                .select("four_point_five_count")
                .eq("table_name", original_table)
                .execute()
            )
        except Exception as e:
            logging.exception(f"Failed to retrieve four_point_five_count: {e}")

        four_point_five_count = (
            next(iter(four_point_five_count))[1][0]["four_point_five_count"] + 1
        )

        try:
            supabase.table("table_playlist_stats").update(
                {
                    "four_point_five_count": four_point_five_count,
                }
            ).eq("table", original_table).execute()
        except Exception as e:
            logging.exception(f"Failed to update fetch_count: {e}")
    else:
        try:
            sp.playlist_add_items(playlist_id="2SGW5aO6eNibN1xHWkb7EX", items=tracks)
        except Exception as e:
            logging.exception(f"Failed to upload tracks to favorites playlist: {e}")

        try:
            four_point_five_count = (
                supabase.table("table_playlist_stats")
                .select("five_count")
                .eq("table_name", original_table)
                .execute()
            )
        except Exception as e:
            logging.exception(f"Failed to retrieve five_count: {e}")

        five_count = next(iter(five_count))[1][0]["five_count"] + 1

        try:
            supabase.table("table_playlist_stats").update(
                {
                    "five_count": five_count,
                }
            ).eq("table", original_table).execute()
        except Exception as e:
            logging.exception(f"Failed to update fetch_count: {e}")


add_to_rym_playlist()
