const request = require("supertest");
const app = require("../../app");
const {
  connectTestDb,
  seedPlanets,
  disconnectTestDb,
} = require("../../test-utils");

describe("Launches API", () => {
  beforeAll(async () => {
    await connectTestDb();
    await seedPlanets();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-186 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-186 f",
    };

    const launchDataWithInvalidDate = {
      ...launchDataWithoutDate,
      launchDate: "xxx",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
      expect(typeof response.body.flightNumber).toBe("number");
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing reqiured launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });

  describe("Test DELETE /launches/:id", () => {
    test("It should abort an existing launch", async () => {
      const created = await request(app)
        .post("/launches")
        .send({
          mission: "Abort Me",
          rocket: "NCC 1701-D",
          target: "Kepler-186 f",
          launchDate: "January 4, 2028",
        })
        .expect(201);

      const response = await request(app)
        .delete(`/launches/${created.body.flightNumber}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toStrictEqual({ ok: true });
    });

    test("It should respond with 404 when launch does not exist", async () => {
      const response = await request(app)
        .delete("/launches/999999")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toStrictEqual({ error: "Launch not found" });
    });
  });
});
