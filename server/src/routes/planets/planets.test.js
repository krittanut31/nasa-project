const request = require("supertest");
const app = require("../../app");
const {
  connectTestDb,
  seedPlanets,
  disconnectTestDb,
} = require("../../test-utils");

describe("Test GET /planets", () => {
  beforeAll(async () => {
    await connectTestDb();
    await seedPlanets();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  test("It should respond with 200 and a list of planets", async () => {
    const response = await request(app)
      .get("/planets")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toContainEqual({ keplerName: "Kepler-186 f" });
  });
});
