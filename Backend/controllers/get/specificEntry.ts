import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;

import { bigquery } from "../../utils/bigQuery";

const getDataForSpecificEntry = async (req: Request, res: Response) => {
    const title = req.params.title;
    const table = req.params.table;
    const dataset = req.params.dataset;

    const query = `select * from ${BQ_PROJECT}.${dataset}.${table} where title = @title`;

    try {
        // Run the query
        const options = {
            query,
            params: { title, table },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        console.log(query, options.params);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();

        console.log(rows);

        res.json(rows);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send("Server Error");
    }
};

export { getDataForSpecificEntry };
