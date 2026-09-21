import bpy
from pathlib import Path
base=Path('docs/design-references/2026-09-14-curated-hardware').resolve()
bpy.ops.wm.open_mainfile(filepath=str(base/'curated-selection-box.blend'))
bpy.context.scene.render.engine='BLENDER_EEVEE'
bpy.context.scene.render.resolution_percentage=60
bpy.context.scene.render.filepath=str(base/'eevee-preview.png')
bpy.ops.render.render(write_still=True)
print('EEVEE_PREVIEW_OK')
