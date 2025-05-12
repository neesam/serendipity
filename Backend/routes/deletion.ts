import dotenv from "dotenv";
dotenv.config();

import express from "express";

const deletionRoutes = express.Router();

import {
    deleteFromSourceTable,
    deleteFromCurrentlyListening,
    deleteFromCurrentlyListeningAndOgTable,
} from "../controllers/delete/delete";

deletionRoutes.delete("/:id/from/:whichTable/:dataset", deleteFromSourceTable);
deletionRoutes.delete("/:id/with/:album", deleteFromCurrentlyListening);
deletionRoutes.delete(
    "/:id/:album/:original_table/:dataset",
    deleteFromCurrentlyListeningAndOgTable
);

export { deletionRoutes };
