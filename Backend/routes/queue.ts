import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { queueAlbumLogic } from "../controllers/queue/album";
import { queueBookLogic } from "../controllers/queue/book";
import { queueFilmLogic } from "../controllers/queue/film";
import { queueShowLogic } from "../controllers/queue/show";

const queueRoutes = express.Router();

queueRoutes.post("/api/addAlbumToQueue/:album", queueAlbumLogic);

queueRoutes.post("/api/addBookToQueue/:book", queueBookLogic);

queueRoutes.post("/api/addFilmToQueue/:film", queueFilmLogic);

queueRoutes.post("/api/addShowToQueue/:show", queueShowLogic);

export { queueRoutes };
