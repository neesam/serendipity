import dotenv from "dotenv";
dotenv.config();

import { BigQuery } from "@google-cloud/bigquery";

const BQ_SERVICE_ACCOUNT = process.env.BQ_SERVICE_ACCOUNT;

export const bigquery = new BigQuery({
    keyFilename: BQ_SERVICE_ACCOUNT,
});
