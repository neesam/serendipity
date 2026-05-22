
from dotenv import load_dotenv
import os
import logging
import sys

from supabase import create_client

load_dotenv()

SUPABASE_URL=os.getenv("SUPABASE_URL")
SUPABASE_KEY=os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_fetch_count(table):
    try:
        fetch_count = supabase.schema("music_tables").table("table_fetch_count").select("fetch_count").eq("table", table).execute()
    except Exception as e:
        logging.exception(f"Failed to retrieve fetch_count: {e}")

    fetch_count = next(iter(fetch_count))[1][0]['fetch_count'] + 1

    try:
        supabase.schema("music_tables").table("table_fetch_count").update({"fetch_count": fetch_count}).eq("table", table).execute()
    except Exception as e:
        logging.exception(f"Failed to update fetch_count: {e}")

if __name__ == "__main__":
    table = sys.argv[1]

    try:
        update_fetch_count(table)
    except Exception as e:
        logging.exception(f"Failed to update fetch count for {table}: {e}")
