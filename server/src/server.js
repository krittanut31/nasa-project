const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://krittanat12300_db_user:wBRGAMa1n24rd9aZ@nasacluster.mhgbnd8.mongodb.net/?appName=NASACluster";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB conection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
