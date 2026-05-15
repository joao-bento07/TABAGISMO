import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir  = join(__dirname, '../public/icons');

const tasks = [
  { svg: 'icon.svg',          size: 192, out: 'icon-192.png'          },
  { svg: 'icon-maskable.svg', size: 512, out: 'icon-512.png'          },
  { svg: 'icon.svg',          size: 180, out: 'apple-touch-icon.png'  },
];

for (const { svg, size, out } of tasks) {
  const source = readFileSync(join(iconsDir, svg), 'utf8');
  const resvg   = new Resvg(source, { fitTo: { mode: 'width', value: size } });
  const png     = resvg.render().asPng();
  writeFileSync(join(iconsDir, out), png);
  console.log(`  ✓ ${out}  (${size}x${size})`);
}

console.log('\nÍcones PNG gerados em public/icons/');
