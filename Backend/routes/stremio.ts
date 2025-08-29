import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { stremioLogic } from "../controllers/stremio";

const stremioRoutes = express.Router();

stremioRoutes.get("/api/create_stremio_output", stremioLogic);

export { stremioRoutes };
