import count from "./countByUserId";

describe("Measurements: count", function() {
  it("return a count", async () => {
    return await count(1);
  });
});
