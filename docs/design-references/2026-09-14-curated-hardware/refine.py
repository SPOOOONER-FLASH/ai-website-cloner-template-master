from pathlib import Path
p=Path('scripts/blender/curated-hardware-scenes.py')
s=p.read_text(encoding='utf8')
s=s.replace('scene.cycles.samples = 24','scene.cycles.samples = 12')
s=s.replace("    slab('Window reveal', (2,.035,.4), (-1.4,1.15,.10), matte('Plaster', (.8,.77,.71)))", "    # Keep the title clear; no prop crosses the image border.")
s=s.replace("dw = item['width']; dh = dw*height/width", "dw = min(item['width'],item.get('maxHeight',9)*width/height); dh = dw*height/width")
p.write_text(s,encoding='utf8')
