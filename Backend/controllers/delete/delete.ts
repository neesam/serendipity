import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { supabase } from "../../utils/supabase";

const MUSIC_TABLES_DATASET = process.env.MUSIC_TABLES_DATASET;

const deleteFromSourceTable = async (req: Request, res: Response) => {
    const id = req.params.id;
    const whichTable = req.params.whichTable;
    const dataset = req.params.dataset;

    console.log(
        `Received DELETE request for id: ${id} from table: ${whichTable}`
    );

    const { data, error } = await supabase
        .schema(dataset)
        .from(whichTable)
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json({
            message: "Delete failed",
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: "Record not found",
        });
    }

    return res.status(200).json({
        message: "Deleted successfully",
        data: data,
    });
};

const deleteFromCurrentlyListening = async (req: Request, res: Response) => {
    const id = req.params.id;
    const album = req.params.album;
    const dataset = req.params.dataset;

    console.log(
        `Received DELETE request for album: ${album} from table: album_currentlyListening`
    );

    const { data, error } = await supabase
        .schema(dataset)
        .from("album_currentlyListening")
        .delete()
        .eq("id", id)
        .select();

    console.log(data);

    if (error) {
        return res.status(500).json({
            message: "Delete failed",
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: "Record not found",
        });
    }

    return res.status(200).json({
        message: "Deleted successfully",
        data: data,
    });
};

const deleteFromCurrentlyListeningAndOgTable = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id;
    const originalTable = req.params.original_table;
    const album = req.params.album;
    const dataset = req.params.dataset;

    console.log(
        `Received DELETE request for album: ${album} from table: ${originalTable} and album_currentlyListening`
    );

    try {
        const { data, error } = await supabase
            .schema(dataset)
            .from("album_currentlyListening")
            .delete()
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({
                message: "Delete failed for currently",
                error: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Record not found",
            });
        }

        return res.status(200).json({
            message: "Deleted successfully",
            data: data,
        });
    } catch (err) {
        console.log(err);
    }

    try {
        const { data, error } = await supabase
            .schema(dataset)
            .from(originalTable)
            .delete()
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({
                message: "Delete failed for og",
                error: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Record not found",
            });
        }

        return res.status(200).json({
            message: "Deleted successfully",
            data: data,
        });
    } catch (err) {
        console.log(err);
    }
};

export {
    deleteFromSourceTable,
    deleteFromCurrentlyListening,
    deleteFromCurrentlyListeningAndOgTable,
};
