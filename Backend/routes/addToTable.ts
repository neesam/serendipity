import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {
    addToOneTable,
    addToTwoTables,
    addToStremio,
    addToCurrentlyListening,
} from "../controllers/insert/addToTable";

const addToTableRoute = express.Router();

addToTableRoute.post("/:table/:entry/:dataset", addToOneTable);
addToTableRoute.post("/:table/:entry/:dataset/2", addToStremio);
addToTableRoute.post("/:destination/:origin/:entry/:dataset", addToTwoTables);
addToTableRoute.post(
    "/:entry/:origin/:dataset/currentlyListening/2",
    addToCurrentlyListening
);

export { addToTableRoute };
