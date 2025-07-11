import dotenv from "dotenv";
dotenv.config();

import { BigQuery } from "@google-cloud/bigquery";

const creds = JSON.parse(process.env.GCP_CREDS);

export const bigquery = new BigQuery({
    credentials: creds,
});
