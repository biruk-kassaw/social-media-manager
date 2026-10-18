import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function findTests(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findTests(fullPath));
    } else if (file.endsWith(".test.ts")) {
      results.push(fullPath);
    }
  }
  return results;
}

const testFiles = findTests("src");
if (testFiles.length === 0) {
  console.log("No test files found.");
  process.exit(0);
}

const result = spawnSync("node", ["--import", "tsx", "--test", ...testFiles], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 0);
