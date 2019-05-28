const fs = require("fs");
const path = require("path");

let memoizedIsCi = false;
let memoizedCheck = false;

export default function isCi() {
  if (memoizedCheck) {
    return memoizedIsCi;
  }
  memoizedIsCi = fs.existsSync(path.resolve(".", ".ci-test"));
  memoizedCheck = true;
  return memoizedIsCi;
}
