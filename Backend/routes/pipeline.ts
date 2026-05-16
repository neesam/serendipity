import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { pipelineLogic, spotifyPipeline } from "../controllers/pipeline";

const pipelineRoutes = express.Router();

pipelineRoutes.post("/api/pipeline", pipelineLogic);
pipelineRoutes.post("/api/spotifyPipeline", spotifyPipeline)

export { pipelineRoutes };
