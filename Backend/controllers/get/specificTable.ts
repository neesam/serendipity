import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;

import { bigquery } from "../../utils/bigQuery";

// Gets a random entry from a table and content type specific by the user

const getEntryFromSpecificTable = async (req: Request, res: Response) => {
    const table = req.params.table;
    const dataset = req.params.dataset;

    console.log(table);
    console.log(req.params);

    const sqlQuery = `select * from ${BQ_PROJECT}.${dataset}.${table} order by rand() limit 1`;

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows);
        console.log(rows);
    } catch (err) {
        if (err instanceof Error) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
        res.status(500).send("Server Error");
    }
};

export { getEntryFromSpecificTable };
