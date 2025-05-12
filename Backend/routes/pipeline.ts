import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { pipelineLogic } from "../controllers/pipeline";

const pipelineRoutes = express.Router();

pipelineRoutes.post("/api/pipeline", pipelineLogic);

export { pipelineRoutes };
