import dotenv from "dotenv";
dotenv.config();

import express from "express";

import {
    getEntryFromSpecificFilmTable,
    getEntryFromSpecificAlbumTable,
    getEntryFromSpecificShowTable,
    getEntryFromSpecificBookTable,
} from "../controllers/get/specificTable";

const specificTableRoute = express.Router();

specificTableRoute.get(
    "/:table/:dataset/album",
    getEntryFromSpecificAlbumTable
);
specificTableRoute.get("/:table/:dataset/film", getEntryFromSpecificFilmTable);
specificTableRoute.get("/:table/:dataset/show", getEntryFromSpecificShowTable);
specificTableRoute.get("/:table/:dataset/book", getEntryFromSpecificBookTable);

export { specificTableRoute };
