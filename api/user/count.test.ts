import countUsers from "./count";

describe("User: count users", function() {
  it("return a count", async () => {
    return await countUsers();
  });
});
