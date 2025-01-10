import "dotenv/config"; // Load .env file in local development
import express, { Router } from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import chartRoutes from "./routes/chartRoutes";
import { ChartModule } from "./entities/modules/ChartModule";
import { AbstractModule } from "./entities/modules/AbstractModule";

const app = express();
const PORT = process.env.PORT || 3000;

// mapping of all used module types with their corresponding routers 
const moduleTypes: [ { moduleEntity: typeof AbstractModule, moduleRouter: Router } ] = [ 
    {
        moduleEntity: ChartModule,
        moduleRouter: chartRoutes
    },
]

app.use(bodyParser.json());

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
            .getRepository(moduleType.moduleEntity)
            .createQueryBuilder("module")
            .where("module.enabled = true")
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

// Initialize the database and start the server
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source initialized");
        loadEndpoints();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error("Error during Data Source initialization:", error));