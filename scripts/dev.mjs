import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const incoming = process.argv.slice(2);

let hostname = "0.0.0.0";
let port = "3000";

for (let index = 0; index < incoming.length; index += 1) {
  const argument = incoming[index];
  if ((argument === "--host" || argument === "--hostname") && incoming[index + 1]) {
    hostname = incoming[index + 1];
    index += 1;
  } else if ((argument === "--port" || argument === "-p") && incoming[index + 1]) {
    port = incoming[index + 1];
    index += 1;
  }
}

const child = spawn(process.execPath, [nextBin, "dev", "--hostname", hostname, "--port", port], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
