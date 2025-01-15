import "dotenv/config"; // Load .env file in local development
import express, { Router } from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import chartRoutes from "./routes/chartRoutes";
import { ChartModule } from "./entities/modules/ChartModule";
import { Module } from "./entities/modules/Module";
import { DataMapping } from "./entities/DataMapping";

const app = express();
const PORT = process.env.PORT || 3000;

// mapping of all used module types with their corresponding routers 
const moduleTypes: [ { moduleEntity: string, moduleRouter: Router } ] = [ 
    {
        moduleEntity: 'ChartModule',
        moduleRouter: chartRoutes
    },
]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// endpoint to reload all endpoints without restarting the whole app
app.use("/reload", (req, res) => {
    resetRoutes();
    loadEndpoints();
    res.json({success: true});
});

async function loadEndpoints() {
    const moduleEndpointPrefix = "/api/modules";

    // iterate over all module types and create their endpoints
    moduleTypes.forEach((moduleType) => {
        AppDataSource
            .getRepository(Module)
            .createQueryBuilder("module")
            .where("module.enabled = true AND module.type = :type", { type: moduleType.moduleEntity })
            .getMany()
            .then((modules) => {
                modules.forEach((module) => {
                    const endpointPath = `${moduleEndpointPrefix}/${module.endpoint}`;
                    app.use(endpointPath, moduleType.moduleRouter);
                    console.log(`loaded ${endpointPath}`)
                });
            });
    })
}

// Function to reset all routes
function resetRoutes() {
    console.log("resetting routes");
    app._router.stack = app._router.stack.filter((layer: any) => {
      // Keep only non-routing middleware (e.g., body-parser)
      return !(layer.route || (layer.name === 'router'));
    });
}

async function initDev() {

    const chartModule = new ChartModule();

    chartModule.name = "Chart Module";
    chartModule.description = "Chart Module Description";
    chartModule.unit = "Module Unit";
    chartModule.lowerBound = "0.0";
    chartModule.upperBound = "5.0";
    chartModule.enabled = true;
    chartModule.endpoint = "chart-test";

    await AppDataSource.getRepository(Module).save(chartModule);

    const mapping = new DataMapping();
    
    mapping.internal = "timestamp";
    mapping.external = "timestomp";
    if(chartModule !== null) {
        mapping.module = chartModule;
    }
    
    await AppDataSource.getRepository(DataMapping).save(mapping);
}

// Initialize the database and start the server
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source initialized");
        if (process.env.NODE_ENV === "development") {
            initDev().then(() => console.log("Dev entities initialized")).then(loadEndpoints);
        } else {
            loadEndpoints();
        }
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error("Error during Data Source initialization:", error));