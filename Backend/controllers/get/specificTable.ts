import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

const BQ_PROJECT = process.env.BQ_PROJECT;

import { supabase } from "../../utils/supabase";

// Gets a random entry from a table and content type specific by the user

const getEntryFromSpecificFilmTable = async (req: Request, res: Response) => {
    const table = req.params.table;
    const dataset = req.params.dataset;

    console.log(table);
    console.log(req.params);

    if (table === "film_international") {
        let randomInternationalTable = "";
        try {
            const { data, error } = await supabase.rpc(
                "get_random_from_table",
                {
                    random_table_name: table,
                    dataset: dataset,
                },
            );

            if (error) {
                return res.status(500).json({
                    message: `Fetch failed for table: ${table}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't fetch for table: ${table}`,
                });
            }

            console.log(data);

            randomInternationalTable = data["data"][0]["name"];

            console.log(randomInternationalTable);

            try {
                const { data, error } = await supabase.rpc(
                    "get_random_from_table",
                    {
                        random_table_name: randomInternationalTable,
                        dataset: dataset,
                    },
                );

                console.log("HERES THE DATA", data);

                if (error) {
                    return res.status(500).json({
                        message: `Fetch failed for table: ${table}`,
                        error: error.message,
                    });
                }

                if (!data || data.length === 0) {
                    return res.status(404).json({
                        message: `Couldn't fetch for table: ${table}`,
                    });
                }

                return res.status(200).json({
                    message: `Fetched successfully for table: ${table}`,
                    data: data,
                    randomTable: randomInternationalTable,
                });
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const { data, error } = await supabase.rpc(
                "get_random_from_table",
                {
                    random_table_name: table,
                    dataset: dataset,
                },
            );

            if (error) {
                return res.status(500).json({
                    message: `Fetch failed for table: ${table}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't fetch for table: ${table}`,
                });
            }

            return res.status(200).json({
                message: `Fetched successfully for table: ${table}`,
                data: data,
                randomTable: table,
            });
        } catch (error) {
            console.log(error);
        }
    }
};

const getEntryFromSpecificAlbumTable = async (req: Request, res: Response) => {
    const table = req.params.table;
    const dataset = req.params.dataset;
    console.log(table, dataset);

    const { data, error } = await supabase.rpc("get_random_from_table", {
        random_table_name: table,
        dataset: dataset,
    });

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table: ${table}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table: ${table}`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for table: ${table}`,
        data: data,
    });
};

const getEntryFromSpecificShowTable = async (req: Request, res: Response) => {
    const table = req.params.table;
    const dataset = req.params.dataset;

    const { data, error } = await supabase.rpc("get_random_from_table", {
        random_table_name: table,
        dataset: dataset,
    });

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table: ${table}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table: ${table}`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for table: ${table}`,
        data: data,
    });
};

const getEntryFromSpecificBookTable = async (req: Request, res: Response) => {
    const table = req.params.table;
    const dataset = req.params.dataset;

    const { data, error } = await supabase.rpc("get_random_from_table", {
        random_table_name: table,
        dataset: dataset,
    });

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table: ${table}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table: ${table}`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for table: ${table}`,
        data: data,
    });
};

export {
    getEntryFromSpecificFilmTable,
    getEntryFromSpecificAlbumTable,
    getEntryFromSpecificShowTable,
    getEntryFromSpecificBookTable,
};
