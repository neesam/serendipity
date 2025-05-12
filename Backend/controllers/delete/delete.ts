import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;

import { bigquery } from "../../utils/bigQuery";

const MUSIC_TABLES_DATASET = process.env.MUSIC_TABLES_DATASET;

const deleteFromSourceTable = async (req: Request, res: Response) => {
    const id = req.params.id;
    const whichTable = req.params.whichTable;
    const dataset = req.params.dataset;

    console.log(
        `Received DELETE request for id: ${id} from table: ${whichTable}`
    );

    const query = `
        DELETE FROM \`${BQ_PROJECT}.${dataset}.${whichTable}\`
        WHERE id  = @id
    `;

    console.log(query);

    try {
        // Run the query
        const options = {
            query,
            params: { id },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log("Rows affected:", rows);

        if (rows.length === 0) {
            return res.status(404).send("Not found");
        }

        res.status(200).send({ message: "Deleted successfully" });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send("Server Error");
    }
};

const deleteFromCurrentlyListening = async (req: Request, res: Response) => {
    const id = req.params.id;
    const album = req.params.album;

    console.log(
        `Received DELETE request for album: ${album} from table: album_currentlyListening`
    );

    // Query to delete from album_currentlyListening
    const query1 = `
    DELETE FROM \`${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_currentlyListening\`
    WHERE id = @id
    `;

    try {
        // Execute the first query
        const options1 = {
            query: query1,
            params: { id },
        };
        const [job1] = await bigquery.createQueryJob(options1);
        console.log(`Job ${job1.id} started.`);
        await job1.getQueryResults();

        res.status(200).send({ message: "Album deleted successfully" });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send({ error: "Server Error" });
    }
};

const deleteFromCurrentlyListeningAndOgTable = async (
    req: Request,
    res: Response
) => {
    console.log("hello");

    const id = req.params.id;
    const originalTable = req.params.original_table;
    const album = req.params.album;
    const dataset = req.params.dataset;

    console.log(
        `Received DELETE request for album: ${album} from table: ${originalTable} and album_currentlyListening`
    );

    // Query to delete from album_currentlyListening
    const query1 = `
    DELETE FROM \`${BQ_PROJECT}.${dataset}.album_currentlyListening\`
    WHERE id = @id
    `;

    // Query to delete from the original table
    const query2 = `
        DELETE FROM \`${BQ_PROJECT}.${dataset}.${originalTable}\`
        WHERE title = @album
    `;

    try {
        // Execute the first query
        const options1 = {
            query: query1,
            params: { id },
        };
        const [job1] = await bigquery.createQueryJob(options1);
        console.log(`Job ${job1.id} started.`);
        await job1.getQueryResults();

        // Execute the second query
        const options2 = {
            query: query2,
            params: { album },
        };
        const [job2] = await bigquery.createQueryJob(options2);
        console.log(`Job ${job2.id} started.`);
        await job2.getQueryResults();

        res.status(200).send({ message: "Album deleted successfully" });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send({ error: "Server Error" });
    }
};

export {
    deleteFromSourceTable,
    deleteFromCurrentlyListening,
    deleteFromCurrentlyListeningAndOgTable,
};
