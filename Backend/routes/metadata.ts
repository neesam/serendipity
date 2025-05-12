import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { getAllEntriesFromTable } from "../controllers/get/allEntriesFromTable";

const allEntriesFromTableRoute = express.Router();

// BigQuery initialization

allEntriesFromTableRoute.get("/:table/:dataset", getAllEntriesFromTable);

export { allEntriesFromTableRoute };
