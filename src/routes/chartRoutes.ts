import express from "express";
import { basename } from "path";
import { AppDataSource } from "../data-source";
import { ChartModule } from "../entities/modules/ChartModule";
import { ChartUserData } from "../entities/data/ChartUserData";

const router = express.Router();

// Add a new record
router.post("/", async (req, res) => {
    const { value, timestamp } = req.body;


    const chartModule = await AppDataSource
            .getRepository(ChartModule)
            .createQueryBuilder("chartModule")
            .getOne();
    
    if(chartModule !== null) {
        const dataRecord = new ChartUserData();
    
        dataRecord.value = value;
        dataRecord.timestamp = timestamp;
        dataRecord.chartModule = chartModule;
    
        const savedItem = await AppDataSource.getRepository(ChartUserData).save(dataRecord);
    
        res.json({ success: true, item: savedItem });
    } else {
        res.json({ success: false, message: "Could not find corresponding Module" });
    }

});

// Get all items
router.get("/items", async (_req, res) => {
    // const items = await AppDataSource.getRepository(Item).find();
    res.json("testtest");
});

export default router;