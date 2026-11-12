import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { getUserMusicTables } from "../controllers/get/userMusicTables";
import { requireUser } from '../middleware/requireUser';

const userSpecificRoutes = express.Router();

userSpecificRoutes.get("/api/userMusicTables", requireUser, getUserMusicTables);

export { userSpecificRoutes };
