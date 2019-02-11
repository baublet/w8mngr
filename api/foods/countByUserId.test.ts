import count from "./countByUserId";

describe("Food: count", function() {
  it("return a count", async () => {
    return await count(1);
  });
});
