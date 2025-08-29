import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { bigquery } from "../utils/bigQuery";

import { appendFile, unlink } from "fs";

const FILM_TABLES_DATASET = process.env.FILM_TABLES_DATASET;
const BQ_PROJECT = process.env.BQ_PROJECT;

const stremioLogic = async (req: Request, res: Response) => {
    try {
        unlink("stremio.txt", (err) => {
            console.log("Successfully deleted stremio.txt!");
        });

        const date = new Date();

        let query = `SELECT * FROM ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_stremiolibrary WHERE date_last_accessed IS NULL`;

        console.log(query);

        let [job] = await bigquery.createQueryJob(query);

        let [rows] = await job.getQueryResults();

        console.log(rows);

        for (let i = 0; i < rows.length; i++) {
            appendFile("stremio.txt", rows[i]["title"], (err) => {
                if (err) {
                    console.error("Error appending to file:", err);
                    return;
                }
                console.log(
                    `${rows[i]["title"]} appended to stremio.txt successfully!`
                );
            });

            res.json(`Added ${rows[i]["title"]}  to stremio.txt!`);
        }

        query = `UPDATE ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_stremiolibrary SET date_last_accessed = '${date.toDateString()}' WHERE TRUE`;

        [job] = await bigquery.createQueryJob(query);

        [rows] = await job.getQueryResults();
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

export { stremioLogic };
