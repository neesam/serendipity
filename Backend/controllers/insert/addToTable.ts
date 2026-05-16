import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { supabase } from "../../utils/supabase";
import { spawn } from "child_process";

export const SPOTIFY_PIPELINE_FILE_PATH = process.env.SPOTIFY_PIPELINE_FILE_PATH;
export const PYTHON_PACKAGE = process.env.PYTHON_PACKAGE;

const addToOneTable = async (req: Request, res: Response) => {
    console.log("a");
    const table = req.params.table;
    const entry = req.params.entry;
    const dataset = req.params.dataset;

    const { data, error } = await supabase
        .schema(dataset)
        .from(table)
        .insert({
            title: entry,
        })
        .select();

    if (error) {
        return res.status(500).json({
            message: `Insertion failed for table: ${table}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't insert for table: ${table}`,
        });
    }

    return res.status(200).json({
        message: `Inserted successfully for table: ${table}`,
        data: data,
    });
};

const addToTwoTables = async (req: Request, res: Response) => {
    console.log("b");

    const destination = req.params.destination;
    const origin = req.params.origin;
    const entry = req.params.entry;
    const dataset = req.params.dataset;

    if (destination === "album_currentlyListening") {
        try {
            const { data, error } = await supabase
                .schema(dataset)
                .from(destination)
                .insert({
                    title: entry,
                    currently_listening: true,
                    original_table: origin,
                })
                .select();

            if (error) {
                return res.status(500).json({
                    message: `Insertion failed for table: ${destination}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't insert for table: ${destination}`,
                });
            }

            return res.status(200).json({
                message: `Inserted successfully for table: ${destination}`,
                data: data,
            });
        } catch (error) {
            console.log(error);
        }

        try {
            const { data, error } = await supabase
                .schema(dataset)
                .from(origin)
                .insert({
                    title: entry,
                })
                .select();

            if (error) {
                return res.status(500).json({
                    message: `Insertion failed for table: ${origin}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't insert for table: ${origin}`,
                });
            }

            return res.status(200).json({
                message: `Inserted successfully for table: ${origin}`,
                data: data,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const { data, error } = await supabase
                .schema(dataset)
                .from(destination)
                .insert({
                    title: entry,
                })
                .select();

            if (error) {
                return res.status(500).json({
                    message: `Insertion failed for table: ${destination}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't insert for table: ${destination}`,
                });
            }

            return res.status(200).json({
                message: `Inserted successfully for table: ${destination}`,
                data: data,
            });
        } catch (error) {
            console.log(error);
        }

        try {
            const { data, error } = await supabase
                .schema(dataset)
                .from(origin)
                .insert({
                    title: entry,
                })
                .select();

            if (error) {
                return res.status(500).json({
                    message: `Insertion failed for table: ${origin}`,
                    error: error.message,
                });
            }

            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: `Couldn't insert for table: ${origin}`,
                });
            }

            return res.status(200).json({
                message: `Inserted successfully for table: ${origin}`,
                data: data,
            });
        } catch (error) {
            console.log(error);
        }
    }
};

const addToStremio = async (req: Request, res: Response) => {
    console.log("c");

    const table = req.params.table;
    const entry = req.params.entry;
    const dataset = req.params.dataset;

    try {
        const { data, error } = await supabase
            .schema(dataset)
            .from("film_stremiolibrary")
            .insert({
                title: entry,
                currently_in_stremio: true,
            })
            .select();

        if (error) {
            return res.status(500).json({
                message: `Insertion failed for table: film_stremiolibrary`,
                error: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `Couldn't insert for table: film_stremiolibrary`,
            });
        }

        return res.status(200).json({
            message: `Inserted successfully for table: film_stremiolibrary`,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }

    try {
        const { data, error } = await supabase
            .schema(dataset)
            .from(table)
            .delete()
            .eq("title", entry)
            .select();

        if (error) {
            return res.status(500).json({
                message: `Insertion failed for table: ${table}`,
                error: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `Couldn't insert for table: ${table}`,
            });
        }

        return res.status(200).json({
            message: `Inserted successfully for table: ${table}`,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
};

const addToCurrentlyListening = async (req: Request, res: Response) => {
    const python = spawn(`${PYTHON_PACKAGE}`, [`${SPOTIFY_PIPELINE_FILE_PATH}`]);

    const entry = req.params.entry;
    const origin = req.params.origin;
    const dataset = req.params.dataset;

    console.log({ entry: entry, origin: origin, dataset: dataset });

    try {
        const { data, error } = await supabase
            .schema(dataset)
            .from("album_currentlyListening")
            .insert({
                title: entry,
                original_table: origin,
                currently_listening: true,
            })
            .select();

        if (error) {
            return res.status(500).json({
                message: `Insertion failed for table: album_currentlyListening`,
                error: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: `Couldn't insert for table: album_currentlyListening`,
            });
        }

        return res.status(200).json({
            message: `Inserted successfully for table: album_currentlyListening`,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
};

export { addToOneTable, addToTwoTables, addToStremio, addToCurrentlyListening };
