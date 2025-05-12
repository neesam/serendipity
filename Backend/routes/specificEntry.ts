import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { getDataForSpecificEntry } from "../controllers/get/specificEntry";

const specificEntryRoute = express.Router();

// BigQuery initialization

specificEntryRoute.get("/:title/:table/:dataset", getDataForSpecificEntry);

export { specificEntryRoute };
