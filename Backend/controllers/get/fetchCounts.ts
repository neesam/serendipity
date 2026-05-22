import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { supabase } from "../../utils/supabase";

const getTableFetchCounts = async (req: Request, res: Response) => {

    const { data, error } = await supabase
        .schema("music_tables")
        .from("table_fetch_count")
        .select()
        .order("fetch_count", {ascending: false})

    if (error) {
        return res.status(500).json({
            message: `Fetch failed for table_fetch_count`,
            error: error.message,
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: `Couldn't fetch for table_fetch_count`,
        });
    }

    return res.status(200).json({
        message: `Fetched successfully for table_fetch_count`,
        data: data,
    });
};

export { getTableFetchCounts };
