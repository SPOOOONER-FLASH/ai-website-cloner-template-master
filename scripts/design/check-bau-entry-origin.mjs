#!/usr/bin/env node
/** Read the real HTTPS origin with the production hostname; never purge or submit forms. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";

const args = process.argv.slice(2);
const expectAr4 = args.includes("--expect-ar4");
const outputIndex = args.indexOf("--out");
const output = path.resolve(outputIndex < 0 ? "tmp/codex-bau-entry-qa/origin" : args[outputIndex + 1]);
const hostname = "cantonlock.com";
const origin = "43.131.27.225";
await mkdir(output, { recursive: true });

function get(route, capture = true) {
  return new Promise((resolve, reject) => {
    const request = https.get(`https://${hostname}${route}`, {
      agent: false,
      servername: hostname,
      lookup: (_host, options, callback) => {
        if (options?.all) callback(null, [{ address: origin, family: 4 }]);
        else callback(null, origin, 4);
      },
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => { if (capture) chunks.push(chunk); });
      response.on("end", () => resolve({ status: response.statusCode, contentType: response.headers["content-type"], body: Buffer.concat(chunks) }));
      response.on("error", reject);
    });
    request.setTimeout(30000, () => request.destroy(new Error(`Origin timeout: ${route}`)));
    request.on("error", reject);
  });
}

const assets = new Set();
const photographs = new Set();
const pages = [];
for (const route of ["/", "/de/", "/bau-2027/", "/de/bau-2027/"]) {
  const response = await get(route);
  assert.equal(response.status, 200, `${route}: origin status`);
  const html = response.body.toString("utf8");
  if (route === "/" || route === "/de/") {
    for (const marker of ["data-bau-info-band", "data-bau-showcase"]) {
      const blocks = [...html.matchAll(new RegExp(`<section\\b[^>]*${marker}[^>]*>[\\s\\S]*?<\\/section>`, "g"))];
      assert.equal(blocks.length, 1, `${route}: one ${marker}`);
      const block = blocks[0][0];
      assert.match(block, /<a\b[^>]*href="\/bau-2027\/"/, `${route}: English link`);
      assert.match(block, /<a\b[^>]*href="\/de\/bau-2027\/"/, `${route}: German link`);
      assert.ok(block.includes("C4") && block.includes("523"), `${route}: stand`);
    }
    if (expectAr4) {
      const ar4 = html.match(/<section\b[^>]*data-content-module="argentina-ar4"[^>]*>[\s\S]*?<\/section>/)?.[0];
      assert.ok(ar4, `${route}: original AR4 section`);
      for (const model of ["AR4-110", "AR4-140", "AR4-101", "AR4-1121"]) assert.ok(ar4.includes(model), `${route}: ${model}`);
      assert.ok(ar4.includes("argentina-ar4-entry"), `${route}: original AR4 hero`);
      for (const image of ar4.matchAll(/<img\b[^>]*src="([^"]+)"/g)) photographs.add(image[1]);
      assert.doesNotMatch(html, /<h2\b[^>]*id="flagship-tooling-heading"/, `${route}: repeated flagship section removed`);
    }
  } else {
    assert.match(html, /id="bau-form"/, `${route}: meeting form target`);
    assert.match(html, /<form\b/, `${route}: form markup`);
  }
  for (const tag of html.match(/<(?:script|link)\b[^>]*>/g) ?? []) {
    const url = /\b(?:src|href)="([^"]+)"/.exec(tag)?.[1];
    if (url?.startsWith("/_next/") && (/^<script/.test(tag) || /\b(?:rel="stylesheet"|as="font")/.test(tag))) assets.add(url);
  }
  await writeFile(path.join(output, `${route.replaceAll("/", "_") || "home"}.html`), response.body);
  pages.push({ route, status: response.status, sha256: createHash("sha256").update(response.body).digest("hex") });
}
const assetResults = await Promise.all([...assets].map(async (route) => {
  const response = await get(route, false);
  assert.equal(response.status, 200, `${route}: origin asset`);
  return { route, status: response.status };
}));
const photographResults = await Promise.all([...photographs].map(async (route) => {
  const response = await get(route, false);
  assert.equal(response.status, 200, `${route}: original photograph`);
  assert.match(response.contentType ?? "", /^image\//, `${route}: image content type`);
  return { route, status: response.status, contentType: response.contentType };
}));
await writeFile(path.join(output, "verification.json"), JSON.stringify({
  checkedAt: new Date().toISOString(), hostname, origin, expectAr4, pages, assets: assetResults, photographs: photographResults,
}, null, 2) + "\n");
console.log(`Origin verified: 4 pages, BAU EN/DE entrances and forms, ${assetResults.length} JS/CSS/font assets${expectAr4 ? `, ${photographResults.length} original AR4 photographs and removed repeated flagship` : ""}.`);
