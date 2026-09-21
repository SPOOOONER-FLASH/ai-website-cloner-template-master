import bpy, json, hashlib
from pathlib import Path
base=Path('docs/design-references/2026-09-14-curated-hardware').resolve()
reports=[]
for file in sorted(base.glob('curated-*.blend')):
    bpy.ops.wm.open_mainfile(filepath=str(file))
    cfg=json.loads(bpy.data.texts['SOURCE_AND_LIMITS'].as_string().split('\nPRODUCTS ARE')[0])
    photos=[ob for ob in bpy.data.objects if ob.name.startswith('REAL PHOTO / ')]
    assert len(photos)==len(cfg['photos']), file
    textures=[im for im in bpy.data.images if im.type=='IMAGE' and im.name!='Render Result']
    assert len(textures)==len(photos) and all(im.packed_file for im in textures), file
    for p in cfg['photos']:
        assert hashlib.sha256(Path(p['source']).read_bytes()).hexdigest()==p['sha256'], p['source']
    assert all(ob.get('is_product_cad') is False for ob in photos)
    reports.append({'file':file.name,'packedTextures':len(textures),'sourceHashesVerified':True,'reopened':True})
(base/'blender-reopen-review.json').write_text(json.dumps(reports,indent=2),encoding='utf8')
print('VERIFIED_REOPENED_SCENES',len(reports))
