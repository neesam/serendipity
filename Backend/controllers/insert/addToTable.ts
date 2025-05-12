import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;

import { bigquery } from "../../utils/bigQuery";

const addToTable = async (req: Request, res: Response) => {
    const table = req.params.table;
    const entry = req.params.entry;
    const dataset = req.params.dataset;

    if (table === "album_currentlyListening") {
        const query = `
        INSERT INTO \`${BQ_PROJECT}.${dataset}.${table}\`
        (id, title, currently_listening, original_table) VALUES (GENERATE_UUID(), @entry, 'true', null)
    `;

        try {
            // Run the query
            const options = {
                query,
                params: { entry },
            };
            const [job] = await bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);

            // Wait for the query to finish
            const [rows] = await job.getQueryResults();
            console.log("Rows affected:", rows);

            res.status(200).send({ message: "Entry added successfully" });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            res.status(500).send("Server Error");
        }
    } else {
        const query = `
        INSERT INTO \`${BQ_PROJECT}.${dataset}.${table}\`
        (id, title) VALUES (GENERATE_UUID(), @entry)
    `;
        try {
            // Run the query
            const options = {
                query,
                params: { entry },
            };
            const [job] = await bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);

            // Wait for the query to finish
            const [rows] = await job.getQueryResults();
            console.log("Rows affected:", rows);

            res.status(200).send({ message: "Entry added successfully" });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            res.status(500).send("Server Error");
        }
    }
};

export { addToTable };
