import fs from 'node:fs';
import assert from 'node:assert/strict';
const models = JSON.parse(fs.readFileSync('public/downloads/models/index.json'));
for (const locale of ['', '/es']) {
  const library = fs.readFileSync(`out${locale}/downloads/index.html`, 'utf8');
  for (const model of models) {
    const page = `out${locale}/products/${model.category}/${model.slug}/index.html`;
    const html = fs.readFileSync(page, 'utf8');
    for (const content of [library, html]) {
      assert.ok(content.includes(`id="model-${model.id}"`), `${page}: missing model block`);
      for (const file of [model.blend, model.glb, model.notes]) {
        assert.ok(content.includes(file), `${page}: missing ${file}`);
        assert.deepEqual(fs.readFileSync('out' + file), fs.readFileSync('public' + file));
      }
      assert.ok(content.includes(locale ? 'Modelo 3D parcial' : 'Partial 3D model'));
      assert.ok(content.includes(locale ? 'Abrir vista 3D' : 'Open 3D preview'));
    }
  }
}
console.log('Verified six product pages, two model libraries and all exported model downloads.');
