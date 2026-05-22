import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { getTableFetchCounts } from "../controllers/get/fetchCounts";

const fetchCountRoutes = express.Router();

fetchCountRoutes.get("/api/table_fetch_counts", getTableFetchCounts);

export { fetchCountRoutes };
