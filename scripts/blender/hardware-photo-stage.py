"""Source photograph in an editable Blender stage; no reconstructed hardware.

Run with Blender --background --python-exit-code 1 --python this.py -- config.json.
Only connected near-white backdrop and the separate corner logo become transparent.
Retained source RGB values are asserted unchanged. No product features are created.
Foreground is a photograph, not dimensional CAD; original perspective is retained.
"""
import bpy
import json
import sys
from pathlib import Path
from array import array
from mathutils import Vector

cfg = json.loads(Path(sys.argv[sys.argv.index('--') + 1]).read_text(encoding='utf8'))
out = Path(cfg['outputDirectory'])
out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
source = bpy.data.images.load(cfg['source'])
w, h = source.size
raw = array('f', [0.0]) * (w*h*4)
source.pixels.foreach_get(raw)
mask = bytearray(w*h)
stack = []
for x in range(w):
    stack.extend([x, (h-1)*w+x])
for y in range(h):
    stack.extend([y*w, y*w+w-1])
# A reviewed rectangular corner area contains only the detached catalogue logo.
logo = cfg.get('logoRect', [0, 0, 0, 0])
for y in range(h):
    for x in range(w):
        if logo[0] <= x < logo[2] and logo[1] <= h-1-y < logo[3]:
            mask[y*w+x] = 1
while stack:
    p = stack.pop()
    if mask[p] or min(raw[4*p:4*p+3]) < 0.965:
        continue
    mask[p] = 1
    x, y = p % w, p // w
    if x: stack.append(p-1)
    if x+1 < w: stack.append(p+1)
    if y: stack.append(p-w)
    if y+1 < h: stack.append(p+w)
positions = [p for p in range(w*h) if not mask[p]]
x0, x1 = min(p % w for p in positions), max(p % w for p in positions)+1
y0, y1 = min(p // w for p in positions), max(p // w for p in positions)+1
tw, th = x1-x0, y1-y0
rgba = array('f')
retained = 0
for y in range(y0,y1):
    for x in range(x0,x1):
        p = y*w+x
        rgba.extend(raw[p*4:p*4+3])
        opacity = 0.0 if mask[p] else raw[p*4+3]
        # Attenuate JPEG white matte only on the existing 1-pixel alpha boundary.
        neighbors = [q for q in (p-1,p+1,p-w,p+w) if 0 <= q < w*h]
        if opacity and any(mask[q] for q in neighbors):
            opacity *= 0.10 if min(raw[p*4:p*4+3]) > 0.70 else 0.85
        rgba.append(opacity)
        if not mask[p]: retained += 1
texture = bpy.data.images.new('Actual source pixels / '+cfg['model'], width=tw, height=th, alpha=True)
texture.pixels.foreach_set(rgba)
verified = array('f', [0.0]) * len(rgba)
texture.pixels.foreach_get(verified)
for i in range(0,len(rgba),4):
    assert verified[i:i+3] == rgba[i:i+3], 'Retained RGB changed'
texture.pack()

def matte(name, color, roughness=0.75):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color,1)
    mat.use_nodes = True
    mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*color,1)
    mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = roughness
    return mat

def slab(name, size, location, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.scale = size
    ob.data.materials.append(mat)
    return ob

stone = matte('Quiet warm limestone', (.40,.37,.32))
slab('Architectural display surface',(3,3,.05),(0,0,-.045),stone)
slab('Cropped charcoal material edge',(.13,3,.04),(-.50,0,-.015),matte('Charcoal',(.06,.055,.045)))
mat = bpy.data.materials.new('Original photograph / NO product CAD')
mat.use_nodes = True
nodes, links = mat.node_tree.nodes, mat.node_tree.links
nodes.clear()
tex = nodes.new('ShaderNodeTexImage'); tex.image = texture
emission = nodes.new('ShaderNodeEmission'); emission.inputs['Strength'].default_value=1
alpha = nodes.new('ShaderNodeBsdfTransparent')
mix = nodes.new('ShaderNodeMixShader')
output = nodes.new('ShaderNodeOutputMaterial')
links.new(tex.outputs['Color'],emission.inputs['Color'])
links.new(tex.outputs['Alpha'],mix.inputs[0])
links.new(alpha.outputs[0],mix.inputs[1])
links.new(emission.outputs[0],mix.inputs[2])
links.new(mix.outputs[0],output.inputs[0])
bpy.ops.mesh.primitive_plane_add(size=1, location=(0,0,-.018))
plate = bpy.context.object
plate.name = cfg['model']+' / exact photographic plate'
plate.scale = (.72*tw/max(tw,th),.72*th/max(tw,th),1)
plate.data.materials.append(mat)
plate['is_product_cad'] = False
plate['source'] = cfg['source']
scene = bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=24
scene.cycles.use_denoising=True
scene.world=bpy.data.worlds.new('Soft studio fill')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
bpy.ops.object.light_add(type='AREA', location=(-1,1,2))
light=bpy.context.object
light.data.energy=150
light.data.shape='DISK'
light.data.size=1.8
light.rotation_euler=(Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(0,0,2))
scene.camera=bpy.context.object
scene.camera.data.type='ORTHO'
scene.camera.data.ortho_scale=1.05
scene.camera.rotation_euler=(0,0,0)
scene.view_settings.view_transform='Standard'
scene.render.resolution_x=1254
scene.render.resolution_y=1254
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.filepath=str(out/(cfg['id']+'.png'))
report={**cfg,'technique':'Retained-RGB source-photo plane; alpha removes connected backdrop only; stage geometry only. Not product CAD.','retainedPixels':retained,'rgbAssertion':'passed','sourceSize':[w,h],'textureSize':[tw,th]}
bpy.data.texts.new('PROVENANCE_AND_LIMITS').write(json.dumps(report,ensure_ascii=False,indent=2))
(out/(cfg['id']+'-qa.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
bpy.ops.wm.save_as_mainfile(filepath=str(out/(cfg['id']+'.blend')))
bpy.ops.render.render(write_still=True)
print('HARDWARE_PHOTO_STAGE_OK')
