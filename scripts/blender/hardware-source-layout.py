"""Photographic proof layouts: source images are printed on physical sample cards.

No product segmentation, retouch, geometry generation or inferred feature. Each photo
retains original RGB, perspective and included parts, with explicit rectangular crops
outside product bounds. ONLY the paper, surface, camera and lights are 3D geometry.
Run with Blender --background --python-exit-code 1 --python this.py -- config.json.
"""
import bpy
import json
import sys
import math
import textwrap
from pathlib import Path
from array import array
from mathutils import Vector

cfg=json.loads(Path(sys.argv[sys.argv.index('--')+1]).read_text(encoding='utf8'))
out=Path(cfg['outputDirectory']);out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=32
scene.cycles.use_denoising=True
scene.render.resolution_x=1600
scene.render.resolution_y=1200
scene.render.resolution_percentage=100
scene.view_settings.view_transform='Standard'
scene.world=bpy.data.worlds.new('Soft daylight fill');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.4

def material(name,color):
    m=bpy.data.materials.new(name);m.use_nodes=True
    p=m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=.8
    return m

def slab(name,size,loc,mat):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    ob=bpy.context.object;ob.name=name;ob.scale=size;ob.data.materials.append(mat)
    return ob

base=material('Architectural desk',tuple(cfg.get('deskColor',[.29,.28,.255])))
noise=base.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=230
bump=base.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.001
base.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height'])
base.node_tree.links.new(bump.outputs['Normal'],base.node_tree.nodes['Principled BSDF'].inputs['Normal'])
slab('Honed limestone work surface',(4,3,.04),(0,0,-.03),base)
slab('Dark oak edge',(.08,3,.02),(-1.18,0,-.005),material('Oak',(.12,.085,.055)))
slab('Architect uncoated folio',(2.24,1.54,.004),(0,-.04,-.006),material('Off-white folio',(.78,.77,.735)))
reports=[]
for item in cfg['photos']:
    src=bpy.data.images.load(item['source']);sw,sh=src.size
    pixels=array('f',[0.0])*(sw*sh*4);src.pixels.foreach_get(pixels)
    left,top,width,height=item.get('crop',[0,0,sw,sh])
    assert 0<=left and 0<=top and left+width<=sw and top+height<=sh
    exact=array('f')
    for y in range(sh-top-height,sh-top):
        exact.extend(pixels[(y*sw+left)*4:(y*sw+left+width)*4])
    tex=bpy.data.images.new(item['model']+' / original cropped photograph',width=width,height=height,alpha=True)
    tex.pixels.foreach_set(exact)
    check=array('f',[0.0])*len(exact);tex.pixels.foreach_get(check)
    assert exact==check, 'Source pixel values changed'
    tex.pack()
    m=bpy.data.materials.new(item['model']+' / source RGB');m.use_nodes=True
    nodes,links=m.node_tree.nodes,m.node_tree.links;nodes.clear()
    texture=nodes.new('ShaderNodeTexImage');texture.image=tex
    emit=nodes.new('ShaderNodeEmission');emit.inputs['Strength'].default_value=1
    output=nodes.new('ShaderNodeOutputMaterial')
    links.new(texture.outputs['Color'],emit.inputs['Color']);links.new(emit.outputs[0],output.inputs[0])
    dw=item['width'];dh=dw*height/width
    bpy.ops.mesh.primitive_plane_add(size=1,location=(*item['position'],.002))
    photo=bpy.context.object;photo.name=item['model']+' / actual photograph (not hardware mesh)'
    photo.scale=(dw,dh,1);photo.data.materials.append(m)
    photo['source']=item['source'];photo['is_product_cad']=False
    # Text identifies photos only: no dimensions, certification or kit claim.
    bpy.ops.object.text_add(location=(item['position'][0]-dw/2,item['position'][1]-dh/2-.05,.004))
    label=bpy.context.object;label.name=item['model']+' caption';label.data.body=item['model']
    label.data.size=.025;label.data.extrude=0
    label.data.materials.append(material('Ink',(.07,.07,.065)))
    reports.append({'model':item['model'],'source':item['source'],'crop':item.get('crop'),'exactSourcePixels':True,'isProductCad':False})
bpy.ops.object.text_add(location=(-1.02,.66,.005))
title=bpy.context.object;title.name='Sample study title';title.data.body=cfg['title'];title.data.size=.026
title.data.materials.append(material('Dark ink',(.09,.09,.08)))
if cfg.get('facts'):
    lines=[]
    for fact in cfg['facts']:
        lines.extend(textwrap.wrap(fact,30));lines.append('')
    bpy.ops.object.text_add(location=(.35,.40,.005))
    facts=bpy.context.object;facts.name='Published catalogue facts'
    facts.data.body='\n'.join(lines);facts.data.size=.028;facts.data.space_line=1.25
    facts.data.materials.append(material('Specification ink',(.10,.10,.095)))
    bpy.ops.object.text_add(location=(.35,-.54,.005))
    provenance=bpy.context.object;provenance.data.body='Original catalogue photograph\nProduct Finder / HYDE\nNo reconstructed metal geometry'
    provenance.data.size=.017;provenance.data.materials.append(material('Quiet ink',(.20,.20,.19)))
bpy.ops.object.light_add(type='AREA',location=(-1.5,1.5,2.5))
light=bpy.context.object;light.data.energy=160;light.data.size=2.5
light.rotation_euler=(Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(0,0,3))
scene.camera=bpy.context.object;scene.camera.data.type='ORTHO';scene.camera.data.ortho_scale=2.55
scene.camera.rotation_euler=(0,0,0)
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(out/(cfg['id']+'.png'))
report={'scope':'Original product photographs composed on a Blender paper/stone stage. Not dimensional product CAD or confirmed kit.','photos':reports}
bpy.data.texts.new('SOURCE_AND_LIMITS').write(json.dumps(report,indent=2))
(out/(cfg['id']+'-qa.json')).write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
bpy.ops.wm.save_as_mainfile(filepath=str(out/(cfg['id']+'.blend')))
bpy.ops.render.render(write_still=True)
print('SOURCE_LAYOUT_OK')
