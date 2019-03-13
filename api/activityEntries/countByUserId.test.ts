import count from "./countByUserId";

describe("ActivityEntries: count", function() {
  it("return a count", async () => {
    return await count(1);
  });
});
