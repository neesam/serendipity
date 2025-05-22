import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { BigQuery } from "@google-cloud/bigquery";

import { pipelineRoutes } from "../routes/pipeline";
import { queueRoutes } from "../routes/queue";
import { whichTableRoutes } from "../routes/whichTables";
import { specificTableRoute } from "../routes/specificTable";
import { specificEntryRoute } from "../routes/specificEntry";
import { albumRoutes } from "../routes/currentlyListening";
import { deletionRoutes } from "../routes/deletion";
import { allEntriesFromTableRoute } from "../routes/metadata";
import { addToTableRoute } from "../routes/addToTable";

// Initialize express

const app = express();

// Set port

const port = 5002;

//  Environment variables

const BQ_SERVICE_ACCOUNT = process.env.BQ_SERVICE_ACCOUNT;

// Middleware

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ROUTES

// Metadata pipeline routes

app.use(pipelineRoutes);

// Queue routes

app.use(queueRoutes);

// whichTable routes

app.use(whichTableRoutes);

// Specific table route

app.use("/api/album", specificTableRoute);
app.use("/api/book", specificTableRoute);
app.use("/api/film", specificTableRoute);
app.use("/api/show", specificTableRoute);

// Get specific entry's data (used to set state for further activities)

app.use("/api/specificMusicEntry", specificEntryRoute);
app.use("/api/specificFilmEntry", specificEntryRoute);
app.use("/api/specificShowEntry", specificEntryRoute);
app.use("/api/specificBookEntry", specificEntryRoute);

// Album specific routes

app.use(albumRoutes);

// Deletion routes

app.use("/api/albums", deletionRoutes);
app.use("/api/books", deletionRoutes);
app.use("/api/film", deletionRoutes);
app.use("/api/shows", deletionRoutes);

// Get all for metadata table

app.use("/api/film_metadata_all", allEntriesFromTableRoute);
app.use("/api/music_metadata_all", allEntriesFromTableRoute);
app.use("/api/show_metadata_all", allEntriesFromTableRoute);
app.use("/api/book_metadata_all", allEntriesFromTableRoute);

// Get all for specific table

app.use("/api/all_from_selected_music_table", allEntriesFromTableRoute);
app.use("/api/all_from_selected_film_table", allEntriesFromTableRoute);
app.use("/api/all_from_selected_shows_table", allEntriesFromTableRoute);
app.use("/api/all_from_selected_book_table", allEntriesFromTableRoute);

// Add entry to table

app.use("/api/add_to_music_table", addToTableRoute);
app.use("/api/add_to_film_table", addToTableRoute);
app.use("/api/add_to_show_table", addToTableRoute);
app.use("/api/add_to_book_table", addToTableRoute);

// server listening function

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
