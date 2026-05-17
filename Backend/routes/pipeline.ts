import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { pipelineLogic, spotifyPipeline, testPipeline } from "../controllers/pipeline";

const pipelineRoutes = express.Router();

pipelineRoutes.post("/api/pipeline", pipelineLogic);
pipelineRoutes.post("/api/spotifyPipeline", spotifyPipeline)
pipelineRoutes.post("/api/testPipeline", testPipeline)

export { pipelineRoutes };
