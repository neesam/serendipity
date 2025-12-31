import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { supabase } from "../utils/supabase";

const FILM_TABLES_DATASET = process.env.FILM_TABLES_DATASET;

const stremioLogic = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .schema(FILM_TABLES_DATASET)
            .from("film_addtostremio")
            .delete()
            .neq("title", " ");
    } catch (err) {
        console.log(err);
    }

    const date = new Date();

    let add_to_stremio = [];

    try {
        const { data, error } = await supabase
            .schema(FILM_TABLES_DATASET)
            .from("film_stremiolibrary")
            .select("*")
            .is("date_last_accessed", null);

        console.log(data);

        add_to_stremio = data;
    } catch (err) {
        console.log(err);
    }

    for (let i = 0; i < add_to_stremio.length; i++) {
        try {
            const { data, error } = await supabase
                .schema(FILM_TABLES_DATASET)
                .from("film_addtostremio")
                .insert({ title: add_to_stremio[i]["title"] });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    for (let i = 0; i < add_to_stremio.length; i++) {
        try {
            const { data, error } = await supabase
                .schema(FILM_TABLES_DATASET)
                .from("film_stremiolibrary")
                .update({ date_last_accessed: `${date.toDateString()}` })
                .neq("title", add_to_stremio[i]["title"]);
        } catch (err) {
            console.log(err);
        }
    }
};

export { stremioLogic };
