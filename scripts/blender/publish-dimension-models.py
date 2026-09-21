"""Pack references and remove workstation paths from the public Blender copies."""
import bpy,sys,json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
source=root/'docs/design-references/2026-09-14-dimension-models'
output=root/'public/downloads/models'
output.mkdir(parents=True,exist_ok=True)
for name in ['9004s-exterior','lc04-case-envelope','70sn-upper-housing-envelopes']:
    bpy.ops.wm.open_mainfile(filepath=str(source/(name+'.blend')))
    before={o.name:tuple(o.dimensions) for o in bpy.data.objects if o.type=='MESH'}
    for image in bpy.data.images:
        if image.type=='IMAGE':
            assert image.packed_file,image.name
            image.filepath='//references/'+Path(image.filepath).name
    for ob in bpy.data.objects:
        if ob.type=='MESH':assert ob.get('manufacturing_ready') is False
    bpy.ops.wm.save_as_mainfile(filepath=str(output/(name+'.blend')))
    bpy.ops.wm.open_mainfile(filepath=str(output/(name+'.blend')))
    assert before=={o.name:tuple(o.dimensions) for o in bpy.data.objects if o.type=='MESH'}
    assert all(i.packed_file for i in bpy.data.images if i.type=='IMAGE')
print('PUBLIC_MODELS_VERIFIED 3')
