import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { getEntryFromSpecificTable } from "../controllers/get/specificTable";

const specificTableRoute = express.Router();

specificTableRoute.get("/:table/:dataset", getEntryFromSpecificTable);

export { specificTableRoute };
