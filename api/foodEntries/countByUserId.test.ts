import count from "./countByUserId";

describe("Food Entry: count by user id", function() {
  it("return a count", async () => {
    return await count(1);
  });
});
