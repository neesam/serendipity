import dotenv from "dotenv";
dotenv.config();

import express from "express";

const albumRoutes = express.Router();

import { addToCurrentlyListening } from "../controllers/insert/album";

// BigQuery initialization

albumRoutes.post(
    "/api/addToCurrentlyListening/:album/:table",
    addToCurrentlyListening
);

export { albumRoutes };
