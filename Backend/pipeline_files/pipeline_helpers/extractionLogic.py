import os

from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

# ENVIRONMENT VARIABLES

BQ_SERVICE_ACCOUNT = os.getenv('BQ_SERVICE_ACCOUNT')
BQ_PROJECT = os.getenv('BQ_PROJECT')

METADATA_DATASET= os.getenv('METADATA_DATASET')
QUEUE_TABLE = os.getenv('QUEUE_TABLE')

def extract():
    try:
        # Initialize BigQuery client with project ID and credentials
        client = bigquery.Client.from_service_account_json(f"{BQ_SERVICE_ACCOUNT}", project=f"{BQ_PROJECT}")

        # Define the query
        QUERY = f'''
            SELECT * 
            from `{METADATA_DATASET}.{QUEUE_TABLE}`
        '''

        # Run the query
        query_job = client.query(QUERY)
        rows = query_job.result()

        # Collect the result into a list
        return [row for row in rows]
    except Exception as e:
        print(f"Error executing query: {e}")

