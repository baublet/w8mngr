import count from "./countByUserId";

describe("Activities: count", function() {
  it("return a count", async () => {
    return await count(1);
  });
});
