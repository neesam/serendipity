import os

from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

BQ_SERVICE_ACCOUNT = os.getenv('BQ_SERVICE_ACCOUNT')
BQ_PROJECT = os.getenv('BQ_PROJECT')

METADATA_DATASET= os.getenv('METADATA_DATASET')
QUEUE_TABLE = os.getenv('QUEUE_TABLE')

def deleteFromQueue():
    try:
        # Initialize BigQuery client with project ID and credentials
        client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

        # Define the query
        QUERY = f'''
            DELETE 
            from `{METADATA_DATASET}.{QUEUE_TABLE}`
            WHERE 1 = 1
        '''

        # Run the query
        query_job = client.query(QUERY)
        query_job.result()

    except Exception as e:
        print(f"Error executing query: {e}")