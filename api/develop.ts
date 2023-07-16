import path from "path";
import { unstable_dev } from "wrangler";

console.log("Starting server...");
unstable_dev(path.resolve(path.join(__dirname, "graphql.ts")), {
  config: path.resolve(path.join(__dirname, "..", "graphql.wrangler.toml")),
}).then((server) => {
  console.log(`Server started at http://${server.address}:${server.port}`);
});
