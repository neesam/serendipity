import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { spawn } from "child_process";

export const PYTHON_PACKAGE = process.env.PYTHON_PACKAGE;
export const PIPELINE_FILE_PATH = process.env.PIPELINE_FILE_PATH;
export const SPOTIFY_DELETE_FROM_PLAYLIST_PATH = process.env.SPOTIFY_DELETE_FROM_PLAYLIST_PATH;

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

const spotifyPipeline = async (req: Request, res: Response) => {

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

const testPipeline = async (req: Request, res: Response) => {

    const { album } = req.params.album;

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

export { pipelineLogic, spotifyPipeline, testPipeline };
