import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;
const MUSIC_TABLES_DATASET = process.env.MUSIC_TABLES_DATASET;

import { bigquery } from "../../utils/bigQuery";

const addToCurrentlyListening = async (req: Request, res: Response) => {
    const album = req.params.album;
    const table = req.params.table;

    const query = `
        INSERT INTO \`${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_currentlyListening\`
        (title, id, original_table, currently_listening) VALUES (@album, GENERATE_UUID(), @table, 'true')
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { album, table },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        console.log(query, options.params);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log("Rows affected:", rows);

        if (rows.length === 0) {
            return res.json("No rows");
        }

        res.status(200).send({ message: "Album added successfully" });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send("Server Error");
    }
};

export { addToCurrentlyListening };
