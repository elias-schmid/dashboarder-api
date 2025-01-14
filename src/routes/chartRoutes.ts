import express from "express";
import { utils } from "../utils"
import { AppDataSource } from "../data-source";
import { ChartModule } from "../entities/modules/ChartModule";
import { ChartUserData } from "../entities/data/ChartUserData";

const router = express.Router();

// Add a new record
router.post("/", async (req, res) => {
    try {
        const { value, timestamp, type } = req.body;

        const chartModule = await AppDataSource
                .getRepository(ChartModule)
                .createQueryBuilder("chartModule")
                .where("endpoint = :endpoint", { endpoint: utils.getEndpoint(req) })
                .getOne();
        
        if(chartModule !== null) {
            const dataRecord = new ChartUserData();
        
            dataRecord.value = value;
            dataRecord.timestamp = timestamp;
            dataRecord.chartModule = chartModule;
            if(type !== undefined) {
                dataRecord.type = type;
            }

            const savedItem = await AppDataSource.getRepository(ChartUserData).save(dataRecord);
        
            res.json({ success: true, item: savedItem });
        } else {
            res.json({ success: false, message: "Could not find corresponding Module" });
        }
    } catch {
        res.json({ success: false, message: "Error occured" });
    }

});

// Get all items
router.get("/test", async (req, res) => {
    // const items = await AppDataSource.getRepository(Item).find();

});

export default router;