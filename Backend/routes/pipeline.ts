import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { pipelineLogic, addToSpotifyPipeline, deleteFromSpotifyPipeline, updateFetchCountPipeline  } from "../controllers/pipeline";

const pipelineRoutes = express.Router();

pipelineRoutes.post("/api/pipeline", pipelineLogic);
pipelineRoutes.post("/api/add_to_spotify", addToSpotifyPipeline)
pipelineRoutes.post("/api/delete_from_spotify/:album", deleteFromSpotifyPipeline)
pipelineRoutes.post("/api/update_fetch_count/:table", updateFetchCountPipeline)

export { pipelineRoutes };
