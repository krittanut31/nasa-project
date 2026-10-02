require("dotenv").config();

const mongoose = require("mongoose");
const planets = require("./models/planets.mongo");

// ใช้ database แยกสำหรับเทส จะได้ไม่ไปแตะข้อมูลของ dev
const TEST_DB_NAME = "nasa-test";

async function connectTestDb() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: TEST_DB_NAME });
}

async function seedPlanets() {
  await planets.updateOne(
    { keplerName: "Kepler-186 f" },
    { keplerName: "Kepler-186 f" },
    { upsert: true }
  );
}

async function disconnectTestDb() {
  await mongoose.disconnect();
}

module.exports = { connectTestDb, seedPlanets, disconnectTestDb };
