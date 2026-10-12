import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(here,'60-cpdk-terracotta/source-product.png');
await fs.mkdir(path.join(here,'60-cpdk-terracotta'),{recursive:true});
// Expose existing hidden photographic RGB for inspection; do not invent ground.
await sharp(source).removeAlpha().png().toFile(path.join(here,'60-cpdk-terracotta/native-hidden-rgb-diagnostic.png'));
