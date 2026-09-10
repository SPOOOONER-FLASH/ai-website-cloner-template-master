"""Real photograph on a lit stone stage. Background geometry only, no product CAD."""
import bpy
import json
import sys
from pathlib import Path
from mathutils import Vector

cfg=json.loads(Path(sys.argv[sys.argv.index('--')+1]).read_text(encoding='utf8'))
out=Path(cfg['outputDirectory'])
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.render.resolution_x=1600;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.view_settings.view_transform='Standard'
scene.world=bpy.data.worlds.new('Quiet fill');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.30

def matte(name,color):
    m=bpy.data.materials.new(name);m.use_nodes=True
    p=m.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=.85
    noise=m.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=170
    bump=m.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.10;bump.inputs['Distance'].default_value=.002
    m.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs[0],p.inputs['Normal'])
    return m

def slab(name,size,loc,mat):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    obj=bpy.context.object;obj.name=name;obj.scale=size;obj.data.materials.append(mat)

slab('Honed stone',(4,3,.04),(0,0,-.03),matte('Stone',cfg['color']))
slab('Oak edge',(.17,3,.035),(-1.13,0,-.01),matte('Oak',(.17,.12,.075)))
slab('Window reveal outside product',(1.4,.06,.5),(-1.10,.95,.25),matte('Plaster',(.55,.53,.48)))
im=bpy.data.images.load(cfg['texture']);im.pack()
m=bpy.data.materials.new('Unaltered source RGB with reviewed alpha');m.use_nodes=True
n=m.node_tree.nodes;n.clear();links=m.node_tree.links
t=n.new('ShaderNodeTexImage');t.image=im
em=n.new('ShaderNodeEmission');em.inputs['Strength'].default_value=1
transparent=n.new('ShaderNodeBsdfTransparent');mix=n.new('ShaderNodeMixShader');output=n.new('ShaderNodeOutputMaterial')
links.new(t.outputs['Color'],em.inputs[0]);links.new(t.outputs['Alpha'],mix.inputs[0])
links.new(transparent.outputs[0],mix.inputs[1]);links.new(em.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],output.inputs[0])
bpy.ops.mesh.primitive_plane_add(size=1,location=(.1,0,-.007))
photo=bpy.context.object;photo.name='REAL PHOTO / '+cfg['model'];photo.scale=(cfg['width'],cfg['width']*cfg['textureHeight']/cfg['textureWidth'],1)
photo.data.materials.append(m);photo['is_product_cad']=False;photo['source']=cfg['source']
bpy.ops.object.light_add(type='AREA',location=(-1.2,2.2,3))
light=bpy.context.object;light.data.energy=220;light.data.size=1.8
light.rotation_euler=(Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(0,0,3));scene.camera=bpy.context.object
scene.camera.data.type='ORTHO';scene.camera.data.ortho_scale=2.55;scene.camera.rotation_euler=(0,0,0)
bpy.data.texts.new('SOURCE_AND_LIMITS').write(json.dumps({**cfg,'scope':'Source-photo material study. Not product CAD, installation or real project photography.'},indent=2))
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(out/(cfg['id']+'.png'))
bpy.ops.wm.save_as_mainfile(filepath=str(out/(cfg['id']+'.blend')))
bpy.ops.render.render(write_still=True)
print('MATERIAL_STUDY_OK')
