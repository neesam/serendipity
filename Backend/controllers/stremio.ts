import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { bigquery } from "../utils/bigQuery";

const FILM_TABLES_DATASET = process.env.FILM_TABLES_DATASET;
const BQ_PROJECT = process.env.BQ_PROJECT;

const stremioLogic = async (req: Request, res: Response) => {
    try {
        let query = `DELETE FROM ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_addtostremio WHERE TRUE`;

        let [job] = await bigquery.createQueryJob(query);

        let [rows] = await job.getQueryResults();

        const date = new Date();

        query = `SELECT * FROM ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_stremiolibrary WHERE date_last_accessed IS NULL`;

        console.log(query);

        [job] = await bigquery.createQueryJob(query);

        [rows] = await job.getQueryResults();

        console.log(rows.length);

        for (let i = 0; i < rows.length; i++) {
            try {
                query = `INSERT INTO ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_addtostremio (title) values ("${rows[i]["title"]}")`;

                [job] = await bigquery.createQueryJob(query);

                let [queryResults] = await job.getQueryResults();
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        }

        query = `UPDATE ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_stremiolibrary SET date_last_accessed = '${date.toDateString()}' WHERE TRUE`;

        console.log(query);

        [job] = await bigquery.createQueryJob(query);

        [rows] = await job.getQueryResults();

        res.json(rows);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

export { stremioLogic };
