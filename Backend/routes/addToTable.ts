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
    "/:entry/:dataset/currentlyListening/3/4",
    addToCurrentlyListening
);
addToTableRoute.post("/:entry/:origin/:dataset/4/5", addToCurrentlyListening);

export { addToTableRoute };
