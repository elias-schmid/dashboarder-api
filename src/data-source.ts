import { DataSource } from "typeorm";
import { ChartModule } from "./entities/modules/ChartModule";
import { ChartUserData } from "./entities/data/ChartUserData";
import { DataMapping } from "./entities/DataMapping";
import { Module } from "./entities/modules/Module";


const isDevelopment = process.env.NODE_ENV === "development";

console.log(isDevelopment?"Dev Mode":"Production Mode");

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "dashboarder",
    synchronize: true, // Auto-create tables in development
    logging: false,
    entities: [ ChartModule, ChartUserData, DataMapping, Module ],
    dropSchema: isDevelopment,
    migrations: [],
    subscribers: [],
});