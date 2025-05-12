import dotenv from "dotenv";
dotenv.config();

import express from "express";

import {
    whichBookTable,
    whichShowTable,
    whichFilmTable,
    whichMusicTable,
} from "../controllers/get/whichTable";

const whichTableRoutes = express.Router();

// Routes to get from individual table

whichTableRoutes.get("/api/whichFilmTable", whichFilmTable);

whichTableRoutes.get("/api/whichMusicTable", whichMusicTable);

whichTableRoutes.get("/api/whichShowTable", whichShowTable);

whichTableRoutes.get("/api/whichBookTable", whichBookTable);

export { whichTableRoutes };
