import express from "express";
import { basename } from "path";
import { Module } from "./entities/modules/Module";
import { AppDataSource } from "./data-source";
import { DataMapping } from "./entities/DataMapping";

class Utils {

    getEndpoint(req:express.Request): string {
        return basename(req.baseUrl);
    }

    async getMappings(module: Module) {
        const mappings = await AppDataSource
            .getRepository(DataMapping)
            .createQueryBuilder("mapping")
            .leftJoinAndSelect("mapping.module", "module")
            .where("mapping.module = :module", { module: module.id })
            .getMany();
        return mappings;
    }

    getISOTimestamp(timestamp: string) {
        if(/^[0-9]+$/.test(timestamp)) {
            // Is UNIX timestamp
            let unixTime = parseInt(timestamp, 10);

            // Test if is in millis
            const date = unixTime < 1e12 ? new Date(unixTime * 1000) : new Date(unixTime);

            return date.toISOString();
        } else {
            return new Date(timestamp).toISOString();
        }
    }

}

export const utils = new Utils();