import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { addToTable } from "../controllers/insert/addToTable";

const addToTableRoute = express.Router();

// BigQuery initialization

addToTableRoute.get("/:table/:entry/:dataset", addToTable);

export { addToTableRoute };
