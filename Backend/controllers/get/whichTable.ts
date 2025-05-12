import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { getUniqueRandomValue } from "../../utils/uniqueTable";

import { bigquery } from "../../utils/bigQuery";

// Lists to use

import {
    musicTables,
    bookTables,
    bookAnthologies,
    allTables,
    showTables,
    filmTables,
} from "../../../Frontend/helper/lists";

//  Environment variables

const BQ_PROJECT = process.env.BQ_PROJECT;

const FILM_TABLES_DATASET = process.env.FILM_TABLES_DATASET;
const MUSIC_TABLES_DATASET = process.env.MUSIC_TABLES_DATASET;
const SHOW_TABLES_DATASET = process.env.SHOW_TABLES_DATASET;
const BOOK_TABLES_DATASET = process.env.BOOK_TABLES_DATASET;

const whichFilmTable = async (req: Request, res: Response) => {
    const randomTable = await getUniqueRandomValue(
        filmTables,
        "used_film_tables"
    );

    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.${randomTable} order by rand() limit 1`;

    console.log(sqlQuery);

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        const plainRows = rows.map((row) => ({ ...row }));
        res.json({ rows: plainRows, randomTable });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send("Server Error");
    }
};

const whichMusicTable = async (req: Request, res: Response) => {
    const randomTable = await getUniqueRandomValue(
        musicTables,
        "used_music_tables"
    );
    console.log(randomTable);
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.${randomTable} order by rand() limit 1`;

    console.log(sqlQuery);

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        const plainRows = rows.map((row) => ({ ...row }));
        res.json({ rows: plainRows, randomTable });
    } catch (err) {
        if (err instanceof Error) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
        res.status(500).send("Server Error");
    }
};

const whichShowTable = async (req: Request, res: Response) => {
    const randomTable = await getUniqueRandomValue(
        showTables,
        "used_show_tables"
    );

    const sqlQuery = `select * from ${BQ_PROJECT}.${SHOW_TABLES_DATASET}.${randomTable} order by rand() limit 1`;

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        const plainRows = rows.map((row) => ({ ...row }));
        res.json({ rows: plainRows, randomTable });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send("Server Error");
    }
};

const whichBookTable = async (req: Request, res: Response) => {
    const randomTable = await getUniqueRandomValue(
        bookTables,
        "used_book_tables"
    );

    const sqlQuery = `select * from ${BQ_PROJECT}.${BOOK_TABLES_DATASET}.${randomTable} order by rand() limit 1`;

    console.log(sqlQuery);

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        const plainRows = rows.map((row) => ({ ...row }));
        res.json({ rows: plainRows, randomTable });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        res.status(500).send("Server Error");
    }
};

export { whichBookTable, whichFilmTable, whichShowTable, whichMusicTable };
