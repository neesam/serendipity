import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;

import { bigquery } from "../../utils/bigQuery";

const getAllEntriesFromTable = async (req: Request, res: Response) => {
    const dataset = req.params.dataset;
    const table = req.params.table;

    const sqlQuery = `select * from ${BQ_PROJECT}.${dataset}.${table}`;

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows);
        console.log(rows);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send("Server Error");
    }
};

export { getAllEntriesFromTable };
