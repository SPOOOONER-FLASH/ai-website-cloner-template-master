"""Reopen the delivered .blend files and verify embedded source photographs."""
import bpy
import json
import sys
from pathlib import Path

base = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
jobs = json.loads((base / 'jobs.json').read_text(encoding='utf-8-sig'))
results = []
for item in jobs['items']:
    for asset in item.get('assets', []):
        if asset.get('archiveOnly') or not asset.get('blend'):
            continue
        target = base / asset['blend']
        bpy.ops.wm.open_mainfile(filepath=str(target))
        photos = [o for o in bpy.data.objects if 'source' in o]
        assert photos, f'No source photograph in {target}'
        for photo in photos:
            assert photo['is_product_cad'] is False
            textures = [n.image for m in photo.data.materials
                        for n in m.node_tree.nodes if n.type == 'TEX_IMAGE']
            assert textures and all(t.packed_file for t in textures), target
        report = json.loads(bpy.data.texts['SOURCE_AND_LIMITS'].as_string())
        assert (all(p['exactSourcePixels'] for p in report['photos'])
                if 'photos' in report else report['exactSourceRGB']), target
        results.append({'file': asset['blend'], 'packedPhotos': len(photos),
                        'reopened': True, 'isProductCad': False})
assert len(results) == 15, len(results)
(base / 'blender-verification.json').write_text(
    json.dumps({'verified': results}, indent=2) + '\n', encoding='utf-8')
print('PACKED_SOURCE_BLENDS_OK', len(results))
