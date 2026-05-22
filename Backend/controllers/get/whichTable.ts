import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { getUniqueRandomValue } from "../../utils/uniqueTable";

import { supabase } from "../../utils/supabase";

// Lists to use

import {
    musicTables,
    bookTables,
    bookAnthologies,
    allTables,
    showTables,
    filmTables,
} from "../../helper/lists";

//  Environment variables

const BQ_PROJECT = process.env.BQ_PROJECT;

const FILM_TABLES_DATASET = process.env.FILM_TABLES_DATASET;
const MUSIC_TABLES_DATASET = process.env.MUSIC_TABLES_DATASET;
const SHOW_TABLES_DATASET = process.env.SHOW_TABLES_DATASET;
const BOOK_TABLES_DATASET = process.env.BOOK_TABLES_DATASET;

const whichFilmTable = async (req: Request, res: Response) => {
    const randomTable = await getUniqueRandomValue(
        filmTables,
        "used_film_tables",
    );

    if (randomTable === "film_international") {
        let randomInternationalTable = "";
        try {
            const { data, error } = await supabase.rpc(
                "get_random_from_table",
                {
                    random_table_name: randomTable,
                    dataset: FILM_TABLES_DATASET,
                },
            );

            randomInternationalTable = data["title"];

            if (error) {
                return res.status(500).json({
                    message: `Fetch failed for table: ${randomTable}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't fetch for table: ${randomTable}`,
                });
            }
        } catch (error) {
            console.log(error);
        }
        try {
            const { data, error } = await supabase.rpc(
                "get_random_from_table",
                {
                    random_table_name: randomInternationalTable,
                    dataset: FILM_TABLES_DATASET,
                },
            );

            if (error) {
                return res.status(500).json({
                    message: `Fetch failed for table: ${randomTable}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't fetch for table: ${randomTable}`,
                });
            }

            return res.status(200).json({
                message: `Fetched successfully for table: ${randomTable}`,
                data: data,
                randomTable: randomInternationalTable,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        const randomTable = await getUniqueRandomValue(
            filmTables,
            "used_film_tables",
        );
        console.log(randomTable);

        const { data, error } = await supabase.rpc("get_random_from_table", {
            random_table_name: randomTable,
            dataset: FILM_TABLES_DATASET,
        });

        if (error) {
            return res.status(500).json({
                message: `Fetch failed for table: ${randomTable}`,
                error: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `Couldn't fetch for table: ${randomTable}`,
            });
        }

        return res.status(200).json({
            message: `Fetched successfully for table: ${randomTable}`,
            data: data,
            randomTable: randomTable,
        });
    }
};

const whichMusicTable = async (req: Request, res: Response) => {
    const randomTable = await getUniqueRandomValue(
        musicTables,
        "used_music_tables",
    );
    console.log(randomTable);

    const { data, error } = await supabase.rpc("get_random_from_table", {
        random_table_name: randomTable,
        dataset: MUSIC_TABLES_DATASET,
    });

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table: ${randomTable}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table: ${randomTable}`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for table: ${randomTable}`,
        data: data,
        randomTable: randomTable,
    });
};

const whichShowTable = async (req: Request, res: Response) => {
    console.log("haha");
    const randomTable = await getUniqueRandomValue(
        showTables,
        "used_show_tables",
    );
    console.log(randomTable);

    const { data, error } = await supabase.rpc("get_random_from_table", {
        random_table_name: randomTable,
        dataset: SHOW_TABLES_DATASET,
    });

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table: ${randomTable}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table: ${randomTable}`,
        });
    }

    console.log("baba");

    return res.status(200).json({
        message: `Fetched successfully for table: ${randomTable}`,
        data: data,
        randomTable: randomTable,
    });
};

const whichBookTable = async (req: Request, res: Response) => {
    const randomTable = await getUniqueRandomValue(
        bookTables,
        "used_book_tables",
    );
    console.log(randomTable);

    const { data, error } = await supabase.rpc("get_random_from_table", {
        random_table_name: randomTable,
        dataset: BOOK_TABLES_DATASET,
    });

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table: ${randomTable}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table: ${randomTable}`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for table: ${randomTable}`,
        data: data,
        randomTable: randomTable,
    });
};

export { whichBookTable, whichFilmTable, whichShowTable, whichMusicTable };
