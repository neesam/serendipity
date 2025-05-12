import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;
const METADATA_DATASET = process.env.METADATA_DATASET;
const QUEUE_TABLE = process.env.QUEUE_TABLE;

import { bigquery } from "../../utils/bigQuery";

const queueFilmLogic = async (req: Request, res: Response) => {
    const film = req.params.film;

    const query = `
            INSERT INTO \`${BQ_PROJECT}.${METADATA_DATASET}.${QUEUE_TABLE}\`
            (title, id, type) VALUES (@film, GENERATE_UUID(), 'film')
        `;

    try {
        // Run the query
        const options = {
            query,
            params: { film },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log("Rows affected:", rows);

        if (rows.length === 0) {
            return res.status(404).send("Table not found");
        }

        res.status(200).send({ message: "Film added successfully" });
    } catch (err) {
        if (err instanceof Error) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
        res.status(500).send("Server Error");
    }
};

export { queueFilmLogic };
