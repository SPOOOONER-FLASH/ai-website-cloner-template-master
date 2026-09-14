"""Editable studio sets using archived real photographs, never generated metal geometry."""
import bpy
import sys
import json
import hashlib
from pathlib import Path
from array import array
from mathutils import Vector

cfg = json.loads(Path(sys.argv[sys.argv.index('--') + 1]).read_text(encoding='utf-8-sig'))
out = Path(cfg['outputDirectory'])
out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 12
scene.cycles.use_denoising = True
scene.render.resolution_x = cfg.get('resolution', 1800)
scene.render.resolution_y = int(scene.render.resolution_x / 1.5)
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'Standard'
scene.world = bpy.data.worlds.new('Soft studio fill')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .45

def matte(name, color):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    p = material.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = .87
    noise = material.node_tree.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 140
    bump = material.node_tree.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = .07
    bump.inputs['Distance'].default_value = .002
    material.node_tree.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    material.node_tree.links.new(bump.outputs[0], p.inputs['Normal'])
    return material

def slab(name, size, location, material):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.scale = size
    ob.data.materials.append(material)
    return ob

style = cfg.get('style', 'stone')
colors = {'stone': (.69,.65,.58), 'box': (.13,.15,.16), 'white': (.90,.90,.88), 'technical': (.76,.77,.76), 'oak': (.30,.23,.17)}
slab('Studio surface', (5,4,.08), (0,0,-.045), matte('Surface', colors[style]))
if style == 'stone':
    slab('Stone edge', (.14,3,.05), (-1.65,0,-.035), matte('Stone edge', (.37,.35,.30)))
    # Keep the title clear; no prop crosses the image border.
if style == 'box':
    oak = matte('Natural oak tray', (.35,.26,.16))
    slab('Tray base', (3.35,2.12,.08), (0,-.015,-.035), oak)
    for x in [-1.68,1.68]: slab('Tray rim', (.035,2.2,.11), (x,-.015,.025), oak)
    for y in [-1.10,1.07]: slab('Tray rim', (3.38,.035,.11), (0,y,.025), oak)

def text(body, x, y, size=.043, color=(.075,.075,.065)):
    curve = bpy.data.curves.new(body, type='FONT')
    curve.body = body
    curve.size = size
    curve.space_character = 1.1
    ob = bpy.data.objects.new(body, curve)
    bpy.context.collection.objects.link(ob)
    ob.location = (x,y,.13)
    ob.visible_shadow = False
    mat = bpy.data.materials.new(body+' ink')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    em = nodes.new('ShaderNodeEmission')
    em.inputs[0].default_value = (*color,1)
    output = nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(em.outputs[0], output.inputs[0])
    curve.materials.append(mat)

paper = matte('Photo mounting paper', (.96,.95,.92))
reports = []
for i, item in enumerate(cfg['photos']):
    source = Path(item['source'])
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    assert digest == item['sha256'], 'Source changed: '+str(source)
    texture_source = Path(item.get('texture', source))
    if item.get('texture'):
        assert hashlib.sha256(texture_source.read_bytes()).hexdigest() == item['textureSha256']
        assert item['exactSourceRGB'] is True
    src = bpy.data.images.load(str(texture_source))
    sw, sh = src.size
    pixels = array('f', [0.0]) * (sw*sh*4)
    src.pixels.foreach_get(pixels)
    left, top, width, height = [0,0,sw,sh] if item.get('texture') else item.get('crop', [0,0,sw,sh])
    assert 0 <= left and 0 <= top and left+width <= sw and top+height <= sh
    exact = array('f')
    for y in range(sh-top-height, sh-top):
        exact.extend(pixels[(y*sw+left)*4:(y*sw+left+width)*4])
    texture = bpy.data.images.new(item['model']+' source', width=width, height=height, alpha=True, float_buffer=True)
    texture.pixels.foreach_set(exact)
    check = array('f', [0.0]) * len(exact)
    texture.pixels.foreach_get(check)
    assert exact == check, 'Source pixels changed'
    texture.pack()
    bpy.data.images.remove(src)
    material = bpy.data.materials.new(item['model']+' original photo')
    material.use_nodes = True
    nodes, links = material.node_tree.nodes, material.node_tree.links
    nodes.clear()
    tex = nodes.new('ShaderNodeTexImage'); tex.image = texture
    em = nodes.new('ShaderNodeEmission'); em.inputs[1].default_value = 1
    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(tex.outputs['Color'], em.inputs[0])
    if item.get('texture'):
        transparent = nodes.new('ShaderNodeBsdfTransparent')
        mix = nodes.new('ShaderNodeMixShader')
        links.new(tex.outputs['Alpha'], mix.inputs[0])
        links.new(transparent.outputs[0], mix.inputs[1])
        links.new(em.outputs[0], mix.inputs[2])
        links.new(mix.outputs[0], output.inputs[0])
    else:
        links.new(em.outputs[0], output.inputs[0])
    x, y = item['position']
    dw = min(item['width'],item.get('maxHeight',9)*width/height); dh = dw*height/width
    assert abs(x)+dw/2 < 1.76 and abs(y)+dh/2 < 1.08, 'Photo outside frame'
    if not item.get('texture'):
        slab(item['model']+' mount', (dw+.04,dh+.11,.014), (x,y-.022,.013), paper)
    elif style == 'box':
        slab(item['model']+' sample recess', (dw+.09,dh+.17,.012), (x,y-.02,.008), matte(item['model']+' felt', (.24,.25,.23)))
    bpy.ops.mesh.primitive_plane_add(size=1, location=(x,y,.002 if item.get('texture') and style!='box' else .022))
    photo = bpy.context.object
    photo.name = 'REAL PHOTO / '+item['model']
    photo.scale = (dw,dh,1)
    photo.data.materials.append(material)
    photo['source_sha256'] = digest
    photo['source'] = str(source)
    photo['is_product_cad'] = False
    label = item.get('displayLabel', item['model'])
    text(label, x-dw/2, y-dh/2-.04, min(.035,dw/max(12,len(label)*.68)))
    reports.append({'model':item['model'],'sha256':digest,'crop':[left,top,width,height], 'exactTexturePixels':True,'reviewedAlpha':bool(item.get('texture'))})

ink = (.90,.88,.81) if style in ['box','oak'] else (.08,.08,.07)
text(cfg.get('heading','HYDE / PRODUCT STUDY'), -1.65, 1.09, .045, ink)
text(cfg.get('note','Catalogue photographs / Individual selections'), -1.65, -1.12, .032, ink)
bpy.ops.object.light_add(type='AREA', location=(-2,3,4))
light = bpy.context.object
light.data.energy = 360
light.data.size = 2.5
light.rotation_euler = (Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(0,0,5))
scene.camera = bpy.context.object
scene.camera.data.type = 'ORTHO'
scene.camera.data.ortho_scale = 3.65
scene.camera.rotation_euler = (0,0,0)
bpy.data.texts.new('SOURCE_AND_LIMITS').write(json.dumps(cfg,ensure_ascii=False,indent=2)+'\nPRODUCTS ARE ARCHIVED PHOTOGRAPHS. BACKGROUND AND MOUNTS ONLY ARE 3D. NO INSTALLATION SCALE OR COMPATIBILITY CLAIM.')
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(out/(cfg['id']+'.png'))
bpy.ops.wm.save_as_mainfile(filepath=str(out/(cfg['id']+'.blend')))
bpy.ops.render.render(write_still=True)
assert all(im.packed_file for im in bpy.data.images if im.type=='IMAGE' and im.name!='Render Result')
(out/(cfg['id']+'-qa.json')).write_text(json.dumps({'id':cfg['id'],'sources':reports,'packed':True,'scope':'Real-photo studio layout, not product CAD'},indent=2),encoding='utf8')
print('CURATED_SCENE_OK '+cfg['id'])
