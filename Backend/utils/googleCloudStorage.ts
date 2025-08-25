import dotenv from "dotenv";
dotenv.config();

import { Storage } from "@google-cloud/storage";

const creds = JSON.parse(process.env.GCP_CREDS);

export const storage = new Storage({
    credentials: creds,
});
