/*
  The catalogue backdrops are near-white with JPEG blocks in them (#f6–#fd), which show as grey
  patches on the white plate. Every near-white pixel CONNECTED TO THE IMAGE EDGE is set to white;
  a highlight inside the part is not connected to the edge and is left alone, so the product is
  untouched. A room photograph has no near-white border and passes through unchanged.
*/
export function whitenBackground(data, width, height, channels, threshold = 236) {
  const seen = new Uint8Array(width * height);
  const stack = [];
  const light = (i) => data[i * channels] >= threshold && data[i * channels + 1] >= threshold && data[i * channels + 2] >= threshold;
  for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1);
  while (stack.length) {
    const i = stack.pop();
    if (seen[i] || !light(i)) continue;
    seen[i] = 1;
    for (let k = 0; k < 3; k++) data[i * channels + k] = 255;
    const x = i % width;
    if (x > 0) stack.push(i - 1);
    if (x < width - 1) stack.push(i + 1);
    if (i >= width) stack.push(i - width);
    if (i < width * (height - 1)) stack.push(i + width);
  }
  return data;
}
