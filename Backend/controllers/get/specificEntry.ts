import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { supabase } from "../../utils/supabase";

const getDataForSpecificEntry = async (req: Request, res: Response) => {
    const title = req.params.title;
    const table = req.params.table;
    const dataset = req.params.dataset;

    const { data, error } = await supabase
        .schema(dataset)
        .from(table)
        .select()
        .eq("title", title);

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table: ${table} and title: ${title}`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table: ${table} and title: ${title}`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for table: ${table} and title: ${title}`,
        data: data,
    });
};

export { getDataForSpecificEntry };
