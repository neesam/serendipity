import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;

import { bigquery } from "../../utils/bigQuery";

const addToOneTable = async (req: Request, res: Response) => {
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
            res.status(500).send({ message: "Server Error" });
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

const addToTwoTables = async (req: Request, res: Response) => {
    const destination = req.params.destination;
    const origin = req.params.origin;
    const entry = req.params.entry;
    const dataset = req.params.dataset;

    if (destination === "album_currentlyListening") {
        const query1 = `
        INSERT INTO \`${BQ_PROJECT}.${dataset}.${destination}\`
        (id, title, currently_listening, original_table) VALUES (GENERATE_UUID(), @entry, 'true', @origin)
    `;

        try {
            // Run the query
            const options = {
                query1,
                params: { entry, origin },
            };

            const [job] = await bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);

            // Wait for the query to finish
            const [rows] = await job.getQueryResults();
            console.log("Rows affected:", rows);

            res.status(200).send({
                message: "Entry added to destination successfully",
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            res.status(500).send({ message: "Server Error" });
        }

        const query2 = `
        INSERT INTO \`${BQ_PROJECT}.${dataset}.${origin}\`
        (id, title) VALUES (GENERATE_UUID(), @entry)
    `;
        try {
            // Run the query
            const options = {
                query2,
                params: { entry },
            };
            const [job] = await bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);

            // Wait for the query to finish
            const [rows] = await job.getQueryResults();
            console.log("Rows affected:", rows);

            res.status(200).send({
                message: "Entry added to origin successfully",
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            res.status(500).send("Server Error");
        }
    } else {
        const query1 = `
        INSERT INTO \`${BQ_PROJECT}.${dataset}.${destination}\`
        (id, title) VALUES (GENERATE_UUID(), @entry)
    `;
        try {
            // Run the query
            const options = {
                query1,
                params: { entry },
            };
            const [job] = await bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);

            // Wait for the query to finish
            const [rows] = await job.getQueryResults();
            console.log("Rows affected:", rows);

            res.status(200).send({
                message: "Entry added to destination successfully",
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            res.status(500).send("Server Error");
        }

        const query2 = `
        INSERT INTO \`${BQ_PROJECT}.${dataset}.${origin}\`
        (id, title) VALUES (GENERATE_UUID(), @entry)
    `;
        try {
            // Run the query
            const options = {
                query2,
                params: { entry },
            };
            const [job] = await bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);

            // Wait for the query to finish
            const [rows] = await job.getQueryResults();
            console.log("Rows affected:", rows);

            res.status(200).send({
                message: "Entry added to origin successfully",
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            res.status(500).send("Server Error");
        }
    }
};

export { addToOneTable, addToTwoTables };
