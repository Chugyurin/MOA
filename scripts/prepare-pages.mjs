import { copyFile, mkdir, writeFile } from "node:fs/promises";
const root = new URL("../dist/public/", import.meta.url);
for (const path of ["how", "care", "price", "about", "404"]) {
  const dir = new URL(`${path}/`, root);
  await mkdir(dir, { recursive: true });
  await copyFile(new URL("index.html", root), new URL("index.html", dir));
}
await copyFile(new URL("index.html", root), new URL("404.html", root));
await writeFile(new URL(".nojekyll", root), "");
