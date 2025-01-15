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

}

export const utils = new Utils();