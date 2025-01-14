import express from "express";
import { basename } from "path";

class Utils {

    getEndpoint(req:express.Request): string {
        return basename(req.baseUrl);
    }

}

export const utils = new Utils();