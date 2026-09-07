"""Extract reference frames with Blender's installed movie decoder; never publish footage."""
import bpy
import sys
from pathlib import Path
args = sys.argv[sys.argv.index('--') + 1:]
source, destination = args
out = Path(destination)
out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
clip = bpy.data.movieclips.load(source)
print('FILM_METADATA', clip.size[:], clip.frame_duration, clip.fps, flush=True)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 640
scene.render.resolution_y = 360
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'Standard'
bpy.ops.mesh.primitive_plane_add(size=2)
plane = bpy.context.object
plane.scale.x = 16 / 9
mat = bpy.data.materials.new('Reference only')
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes.clear()
output = nodes.new('ShaderNodeOutputMaterial')
emission = nodes.new('ShaderNodeEmission')
texture = nodes.new('ShaderNodeTexImage')
texture.image = bpy.data.images.load(source)
texture.image_user.frame_duration = clip.frame_duration
texture.image_user.use_auto_refresh = True
mat.node_tree.links.new(texture.outputs['Color'], emission.inputs['Color'])
mat.node_tree.links.new(emission.outputs[0], output.inputs[0])
plane.data.materials.append(mat)
bpy.ops.object.camera_add(location=(0, 0, 5))
scene.camera = bpy.context.object
scene.camera.data.type = 'ORTHO'
scene.camera.data.ortho_scale = 32 / 9
for index in range(12):
    frame = 1 + round((clip.frame_duration - 1) * index / 11)
    scene.frame_set(frame)
    scene.render.filepath = str(out / f'{index:02d}-frame-{frame}.png')
    bpy.ops.render.render(write_still=True)
print('REFERENCE_FRAMES_OK', flush=True)
