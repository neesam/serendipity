import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";

import { spawn } from "child_process";

const PYTHON_PACKAGE = process.env.PYTHON_PACKAGE;
const PIPELINE_FILE_PATH = process.env.PIPELINE_FILE_PATH;

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

export { pipelineLogic };
