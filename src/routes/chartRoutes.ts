import express from "express";
import { utils } from "../utils"
import { AppDataSource } from "../data-source";
import { ChartModule } from "../entities/modules/ChartModule";
import { ChartUserData } from "../entities/data/ChartUserData";
import { DataMapping } from "../entities/DataMapping";

const router = express.Router();

// Add a new record
router.post("/", async (req, res) => {
    try {
        const chartModule = await AppDataSource
                .getRepository(ChartModule)
                .createQueryBuilder("chartModule")
                .where("endpoint = :endpoint", { endpoint: utils.getEndpoint(req) })
                .getOne();

                
        if(chartModule !== null) { 

            const columns = AppDataSource
                .getRepository(ChartUserData).metadata.columns
                .map(column => column.propertyName)
                .filter((column) => !['id', 'parameters'].includes(column));
            utils.getMappings(chartModule).then((mappings) => {
                const dataRecord = new ChartUserData();

                let parameters: Record<string, any> = {};
                mappings.forEach(mapping => {
                    let parameter = req.body[mapping.external];
                    if(parameter !== undefined) {
                        if(!columns.includes(mapping.internal)) {
                            parameters[mapping.internal] = parameter;
                        }
                    }
                });

                const getValueWithIndex = (index: string) => req.body[mappings.find((mapping) => mapping.internal == index)?.external || index] || null;


                dataRecord.value = getValueWithIndex('value');

                dataRecord.timestamp = utils.getISOTimestamp(getValueWithIndex('timestamp'));

                dataRecord.chartModule = chartModule;

                dataRecord.type = getValueWithIndex('type');

                dataRecord.parameters = parameters;
                
                AppDataSource.getRepository(ChartUserData).save(dataRecord).then((savedItem) => {
                    res.json({ success: true, item: savedItem });
                });
            });
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

    // console.log(req.body);
    res.json({success: true})
});

export default router;