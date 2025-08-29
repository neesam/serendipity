import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {
    addToOneTable,
    addToTwoTables,
    addToStremio,
} from "../controllers/insert/addToTable";

const addToTableRoute = express.Router();

addToTableRoute.post("/:table/:entry/:dataset", addToOneTable);
addToTableRoute.post("/:table/:entry/:dataset/2", addToStremio);
addToTableRoute.post("/:destination/:origin/:entry/:dataset", addToTwoTables);

export { addToTableRoute };
