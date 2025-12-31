import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { supabase } from "../../utils/supabase";

const getAllEntriesFromTable = async (req: Request, res: Response) => {
    const dataset = req.params.dataset;
    const table = req.params.table;

    const { data, error } = await supabase.schema(dataset).from(table).select();

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for ${table}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for ${table}`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for ${table}`,
        data: data,
    });
};

export { getAllEntriesFromTable };
