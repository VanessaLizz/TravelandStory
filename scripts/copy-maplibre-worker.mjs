import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

const packageDirectory = path.dirname(
  require.resolve("maplibre-gl/package.json"),
);

const distributionDirectory = path.join(
  packageDirectory,
  "dist",
);

const destinationDirectory = path.join(
  process.cwd(),
  "public",
  "maplibre",
);

mkdirSync(destinationDirectory, {
  recursive: true,
});

const files = [
  "maplibre-gl-worker.mjs",
  "maplibre-gl-shared.mjs",
  "maplibre-gl.css",
];

for (const file of files) {
  copyFileSync(
    path.join(distributionDirectory, file),
    path.join(destinationDirectory, file),
  );
}