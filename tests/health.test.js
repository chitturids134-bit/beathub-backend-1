const request = require("supertest");
const app = require("../app");

describe("GET /health", () => {
  it("returns service health metadata", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("environment");
  });
});
