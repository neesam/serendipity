import os
import requests
from datetime import date

from dotenv import load_dotenv
from google.cloud import bigquery

load_dotenv()

BQ_SERVICE_ACCOUNT = os.getenv('BQ_SERVICE_ACCOUNT')
BQ_PROJECT = os.getenv('BQ_PROJECT')

GOOGLE_BOOKS_API_KEY = os.getenv('GOOGLE_BOOKS_API_KEY')

METADATA_DATASET= os.getenv('METADATA_DATASET')
BOOK_METADATA_TABLE = os.getenv('BOOK_METADATA_TABLE')

def getBookDetails(data):
    
    book_title = data[1]

    response = requests.get(f'https://www.googleapis.com/books/v1/volumes?q={book_title}&key={GOOGLE_BOOKS_API_KEY}')
    
    if response.status_code == 200:
        data = response.json()
        item = data['items'][0]
        
        authors = item['volumeInfo']['authors']
        genres = item['volumeInfo']['categories']
        description = item['volumeInfo']['imageLinks']['thumbnail']
        previewLink = item['accessInfo']['webReaderLink']
        title = item['volumeInfo']['title']
        pageCount = item['volumeInfo']['pageCount']
        added_date = date.today()

        formatted_added_date = added_date.strftime("%B %d, %Y")


        if '"' in description:
            description = description.replace('"', '\\"')

        try:
            # Initialize BigQuery client with project ID and credentials
            client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

            # Define the query
            QUERY = f'''
                INSERT INTO
                `{METADATA_DATASET}.{BOOK_METADATA_TABLE}`
                (title, authors, description, genres, page_count, preview_link, added_date)
                VALUES
                ('{title}', {authors}, "{description}", {genres}, '{pageCount}', '{previewLink}', '{formatted_added_date}')
            '''
            print(QUERY)
            # Run the query
            query_job = client.query(QUERY)
            query_job.result()

        except Exception as e:
            print(f"Error executing query: {e}")
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")            
