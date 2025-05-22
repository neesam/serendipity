import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {
    addToOneTable,
    addToTwoTables,
} from "../controllers/insert/addToTable";

const addToTableRoute = express.Router();

// BigQuery initialization

addToTableRoute.post("/:table/:entry/:dataset", addToOneTable);
addToTableRoute.post("/:destination/:origin/:entry/:dataset", addToTwoTables);

export { addToTableRoute };
