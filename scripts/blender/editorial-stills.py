"""Original-photo editorial stills. Set pieces are NOT product CAD or installations.

The product is a camera-facing photographic plate. Its RGB pixels and all visible
components are preserved; only its white background is removed by the shared cutout
utility. No new metal, holes, screws, finish options or installation relationships.
The .blend packs the image so it remains editable without the temporary source.
"""
import bpy, json, sys, math
from pathlib import Path
from mathutils import Vector

cfg = json.loads(Path(sys.argv[sys.argv.index('--')+1]).read_text(encoding='utf8'))
out = Path(cfg['outputDirectory'])
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=96
scene.cycles.use_denoising=True
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='OPTIX'
    prefs.get_devices()
    for device in prefs.devices: device.use=device.type!='CPU'
    scene.cycles.device='GPU'
except Exception: pass
scene.render.resolution_x=1920
scene.render.resolution_y=840
scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Soft studio fill')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(0.7,0.72,0.74,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=0.3
scene.view_settings.view_transform='Standard'

def material(name,color,roughness=.75,grain=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    n=m.node_tree.nodes;p=n.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=roughness
    if grain:
        t=n.new('ShaderNodeTexNoise');t.inputs['Scale'].default_value=grain
        t.inputs['Detail'].default_value=2
        bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.14
        bump.inputs['Distance'].default_value=.0008
        m.node_tree.links.new(t.outputs['Fac'],bump.inputs['Height'])
        m.node_tree.links.new(bump.outputs['Normal'],p.inputs['Normal'])
        ramp=n.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color=(*(c*.92 for c in color),1)
        ramp.color_ramp.elements[1].color=(*(c*1.03 for c in color),1)
        m.node_tree.links.new(t.outputs['Fac'],ramp.inputs[0])
        m.node_tree.links.new(ramp.outputs[0],p.inputs['Base Color'])
    return m

def box(name,size,loc,mat,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    ob=bpy.context.object;ob.name=name;ob.scale=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    ob.data.materials.append(mat)
    if bevel:
        mod=ob.modifiers.new('Soft set-piece edges','BEVEL');mod.width=bevel;mod.segments=3
    return ob

stone=material('Warm honed limestone',(.38,.37,.35),grain=300)
paper=material('Uncoated warm white paper',(.55,.54,.52),grain=600)
dark=material('Charcoal set',(.08,.075,.065),grain=130)
oak=material('Oak staging surface',(.24,.19,.13),grain=180)
# An ordered flat lay, shot perpendicular to the product photograph. All scenery stays
# behind the photograph. No installation connection is drawn or implied.
base=paper if cfg['mood']=='paper' else stone
box('Ground',(5,5,.04),(0,0,-.04),base)
box('Left architectural timber edge',(.10,4,.02),(-1.32,0,0),oak,.001)

# The original product pixels use emission to avoid falsely relighting metal already
# photographed under a different studio rig. The set receives physically traced light.
im=bpy.data.images.load(cfg['texture']);im.pack()
m=bpy.data.materials.new('Original product photograph — no generated geometry');m.use_nodes=True
n=m.node_tree.nodes;n.clear();links=m.node_tree.links
tex=n.new('ShaderNodeTexImage');tex.image=im
em=n.new('ShaderNodeEmission');em.inputs['Strength'].default_value=.9
transparent=n.new('ShaderNodeBsdfTransparent')
mix=n.new('ShaderNodeMixShader');output=n.new('ShaderNodeOutputMaterial')
links.new(tex.outputs['Color'],em.inputs['Color']);links.new(tex.outputs['Alpha'],mix.inputs[0])
links.new(transparent.outputs[0],mix.inputs[1]);links.new(em.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],output.inputs[0])
w=cfg['width'];h=w*cfg['textureHeight']/cfg['textureWidth']
bpy.ops.mesh.primitive_plane_add(size=1,location=(cfg['x'],cfg['y'],.004))
ob=bpy.context.object;ob.name='REAL PHOTO / '+cfg['slug'];ob.scale=(w,h,1);ob.data.materials.append(m)
ob['source_image']=cfg['sourceImage'];ob['source_sha256']=cfg['sourceSha256']
ob['is_product_cad']=False

# Large soft window, offset in a consistent upper-left direction.
bpy.ops.object.light_add(type='AREA',location=(-1.4,2.0,3.8))
light=bpy.context.object;light.name='North window';light.data.energy=220;light.data.shape='RECTANGLE';light.data.size=2;light.data.size_y=2.6
light.rotation_euler=(Vector((.1,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
# Off-frame blocker produces a restrained window shadow without decorating the product.
box('Window mullion outside composition',(.06,3,.1),(-1.40,.3,1.2),dark)
bpy.ops.object.camera_add(location=(0,0,5))
cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=2.9
cam.rotation_euler=(0,0,0);scene.camera=cam
scene['technique']=cfg['technique'];scene['scope']=cfg['scope']
text=bpy.data.texts.new('READ ME — provenance and limits');text.write(json.dumps(cfg,indent=2))
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(out/(cfg['id']+'.png'))
bpy.ops.wm.save_as_mainfile(filepath=str(out/(cfg['id']+'.blend')))
bpy.ops.render.render(write_still=True)
print('EDITORIAL_STILL_OK')
