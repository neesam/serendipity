import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { spawn } from "child_process";

export const PYTHON_PACKAGE = process.env.PYTHON_PACKAGE;
export const PIPELINE_FILE_PATH = process.env.PIPELINE_FILE_PATH;
export const SPOTIFY_PIPELINE_FILE_PATH = process.env.SPOTIFY_PIPELINE_FILE_PATH;
export const SPOTIFY_DELETE_FROM_PLAYLIST_PATH = process.env.SPOTIFY_DELETE_FROM_PLAYLIST_PATH;
export const SPOTIFY_UPDATE_FETCH_COUNT_PATH = process.env.SPOTIFY_UPDATE_FETCH_COUNT_PATH;
export const SPOTIFY_ADD_TO_RYM_PLAYLIST_PATH = process.env.SPOTIFY_ADD_TO_RYM_PLAYLIST_PATH;

const pipelineLogic = async (req: Request, res: Response) => {
    const python = spawn(`${PYTHON_PACKAGE}`, [`${PIPELINE_FILE_PATH}`]);

    let responseSent = false;

    python.stdout.on("data", (data) => {
        console.log("Python output:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.send(data.toString());
        }
    });

    python.on("close", (code) => {
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(`Python process finished with code: ${code}`);
        }
    });

    python.stderr.on("data", (data) => {
        console.error("Error from Python:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(
                `Error running Python script: ${data.toString()}`
            );
        }
    });
};

const addToSpotifyPipeline = async (req: Request, res: Response) => {

    const python = spawn(`${PYTHON_PACKAGE}`, [`${SPOTIFY_PIPELINE_FILE_PATH}`]);

    let responseSent = false;

    python.stdout.on("data", (data) => {
        console.log("Python output:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.send(data.toString());
        }
    });

    python.on("close", (code) => {
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(`Python process finished with code: ${code}`);
        }
    });

    python.stderr.on("data", (data) => {
        console.error("Error from Python:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(
                `Error running Python script: ${data.toString()}`
            );
        }
    });
};

const deleteFromSpotifyPipeline = async (req: Request, res: Response) => {

    const album = req.params.album;

    const python = spawn(`${PYTHON_PACKAGE}`, [`${SPOTIFY_DELETE_FROM_PLAYLIST_PATH}`, `${album}`]);

    let responseSent = false;

    python.stdout.on("data", (data) => {
        console.log("Python output:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.send(data.toString());
            console.log("Deleted", album)
        }
    });

    python.on("close", (code) => {
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(`Python process finished with code: ${code}`);
        }
    });

    python.stderr.on("data", (data) => {
        console.error("Error from Python:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(
                `Error running Python script: ${data.toString()}`
            );
        }
    });
};

const addToRYMSpotifyPlaylist = async (req: Request, res: Response) => {

    const album = req.params.album;
    const playlist = req.params.playlist;
    const originalTable = req.params.original_table;

    const python = spawn(`${PYTHON_PACKAGE}`, [`${SPOTIFY_ADD_TO_RYM_PLAYLIST_PATH}`, `${album}`, `${playlist}`, `${originalTable}`]);

    let responseSent = false;

    python.stdout.on("data", (data) => {
        console.log("Python output:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.send(data.toString());
            console.log("Added", album)
        }
    });

    python.on("close", (code) => {
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(`Python process finished with code: ${code}`);
        }
    });

    python.stderr.on("data", (data) => {
        console.error("Error from Python:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(
                `Error running Python script: ${data.toString()}`
            );
        }
    });
};

const updateFetchCountPipeline = async (req: Request, res: Response) => {

    const table = req.params.table;

    const python = spawn(`${PYTHON_PACKAGE}`, [`${SPOTIFY_UPDATE_FETCH_COUNT_PATH}`, `${table}`]);

    let responseSent = false;

    python.stdout.on("data", (data) => {
        console.log("Python output:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.send(data.toString());
            console.log("Updated fetch count for:", table)
        }
    });

    python.on("close", (code) => {
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(`Python process finished with code: ${code}`);
        }
    });

    python.stderr.on("data", (data) => {
        console.error("Error from Python:", data.toString());
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(
                `Error running Python script: ${data.toString()}`
            );
        }
    });
};

export { pipelineLogic, addToSpotifyPipeline, deleteFromSpotifyPipeline, updateFetchCountPipeline, addToRYMSpotifyPlaylist };
