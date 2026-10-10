"""Calibrated empty architecture for compositing an unchanged product photograph."""
import argparse
import json
import math
from pathlib import Path

import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view


parser = argparse.ArgumentParser()
pack = Path(__file__).resolve().parents[1] / 'docs/design-references/home-hero-b-perspective-2026-10-10'
parser.add_argument('--out', default=str(pack))
parser.add_argument('--texture', default=str(pack / 'stone-texture.png'))
parser.add_argument('--background', default=str(pack / 'distant-landscape.png'))
args = parser.parse_args(__import__('sys').argv[__import__('sys').argv.index('--') + 1:])
out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
assert Path(args.texture).is_file(), args.texture
assert Path(args.background).is_file(), args.background

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 64
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.render.resolution_x = 1800
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = 0
scene.view_settings.gamma = 1

anchor = bpy.data.objects.new('World stone texture anchor', None)
scene.collection.objects.link(anchor)
texture = bpy.data.images.load(args.texture, check_existing=True)
texture.pack()


def stone(name, shade, contrast, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    n, l = mat.node_tree.nodes, mat.node_tree.links
    n.clear()
    shader = n.new('ShaderNodeBsdfPrincipled')
    output = n.new('ShaderNodeOutputMaterial')
    l.new(shader.outputs[0], output.inputs['Surface'])
    shader.inputs['Roughness'].default_value = roughness
    co = n.new('ShaderNodeTexCoord')
    co.object = anchor
    scale = n.new('ShaderNodeVectorMath')
    scale.operation = 'SCALE'
    scale.inputs[3].default_value = 0.7
    l.new(co.outputs['Object'], scale.inputs[0])
    tex = n.new('ShaderNodeTexImage')
    tex.image = texture
    tex.projection = 'BOX'
    tex.projection_blend = 0.25
    l.new(scale.outputs[0], tex.inputs['Vector'])
    gray = n.new('ShaderNodeRGBToBW')
    l.new(tex.outputs['Color'], gray.inputs[0])
    ramp = n.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (shade - contrast, shade - contrast, shade - contrast, 1)
    ramp.color_ramp.elements[1].color = (shade + contrast, shade + contrast, shade + contrast, 1)
    l.new(gray.outputs[0], ramp.inputs[0])
    l.new(ramp.outputs['Color'], shader.inputs['Base Color'])
    bump = n.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.11
    bump.inputs['Distance'].default_value = 0.003
    l.new(gray.outputs[0], bump.inputs['Height'])
    l.new(bump.outputs[0], shader.inputs['Normal'])
    return mat


wall_mat = stone('Cool pale limestone, quiet continuous field', 0.53, 0.20, 0.83)
floor_mat = stone('Honed pale gray ground, same continuous level', 0.26, 0.11, 0.72)
seam_mat = bpy.data.materials.new('Fine gray paving joints')
seam_mat.diffuse_color = (0.36, 0.37, 0.38, 1)
seam_mat.use_nodes = True
seam_mat.node_tree.nodes.clear()
seam_shader = seam_mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
seam_output = seam_mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
seam_mat.node_tree.links.new(seam_shader.outputs[0], seam_output.inputs['Surface'])
seam_shader.inputs['Base Color'].default_value = (0.10, 0.105, 0.11, 1)
seam_shader.inputs['Roughness'].default_value = 0.9


def box(name, bounds, material):
    x0, x1, y0, y1, z0, z1 = bounds
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0+x1)/2, (y0+y1)/2, (z0+z1)/2))
    ob = bpy.context.object
    ob.name = name
    ob.dimensions = (x1-x0, y1-y0, z1-z0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(material)
    return ob


half_width = 1.0386
opening_height = 2.3
# These are scene calibration dimensions, never product or installation specifications.
box('Front wall left, frame recessed in real wall thickness', (-5, -half_width, -0.32, 0.32, 0, 4.2), wall_mat)
box('Front wall right, frame recessed in real wall thickness', (half_width, 5, -0.32, 0.32, 0, 4.2), wall_mat)
box('Stone lintel above clear opening', (-half_width, half_width, -0.32, 0.32, opening_height, 4.2), wall_mat)
box('Continuous level ground inside and outside', (-16, 16, -8, 30, -0.16, 0), floor_mat)
box('Interior left return', (-3.15, -3.0, -8, 0, 0, 4.2), wall_mat)
box('Interior right return', (3.1, 3.25, -8, 0, 0, 4.2), wall_mat)
box('Courtyard left boundary', (-4.3, -4.1, 0.32, 5.5, 0, 0.9), wall_mat)
box('Courtyard right boundary', (4.1, 4.3, 0.32, 5.5, 0, 0.9), wall_mat)

# A distant background carries only overcast sky/trees; ground and all perspective are 3D.
back_image = bpy.data.images.load(args.background, check_existing=True)
back_image.pack()
back_aspect = back_image.size[0] / back_image.size[1]
back_width = 28
back_height = back_width / back_aspect
mesh = bpy.data.meshes.new('Distant background billboard geometry')
mesh.from_pydata([(-14,25,-3),(14,25,-3),(14,25,back_height-3),(-14,25,back_height-3)], [], [(0,1,2,3)])
mesh.update()
uv = mesh.uv_layers.new(name='Background UV')
for polygon in mesh.polygons:
    for loop in polygon.loop_indices:
        uv.data[loop].uv = [(0,0),(1,0),(1,1),(0,1)][mesh.loops[loop].vertex_index]
back = bpy.data.objects.new('Distant overcast tree skyline, behind courtyard', mesh)
scene.collection.objects.link(back)
back_mat = bpy.data.materials.new('Soft distant sky/tree image only')
back_mat.use_nodes = True
back_mat.node_tree.nodes.clear()
back_tex = back_mat.node_tree.nodes.new('ShaderNodeTexImage')
back_tex.image = back_image
back_shader = back_mat.node_tree.nodes.new('ShaderNodeEmission')
back_shader.inputs['Strength'].default_value = 0.8
back_output = back_mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
back_mat.node_tree.links.new(back_tex.outputs['Color'], back_shader.inputs['Color'])
back_mat.node_tree.links.new(back_shader.outputs[0], back_output.inputs['Surface'])
back.data.materials.append(back_mat)

# Fine real-world paving joints are projective depth cues, not a wall-grid graphic.
for ix in range(-5, 6):
    x = ix * 1.05 + 0.45
    box('Longitudinal ground joint %s' % ix, (x-0.003, x+0.003, -8, 30, 0.0001, 0.0003), seam_mat)
for iy in range(-6, 20):
    y = iy * 1.35
    box('Transverse ground joint %s' % iy, (-16, 16, y-0.003, y+0.003, 0.0001, 0.0003), seam_mat)

cam_data = bpy.data.cameras.new('Perspective photo calibration')
cam = bpy.data.objects.new('Perspective photo calibration', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam.location = (28 / (660/2.3), -5.0, 299 / (660/2.3))
cam.rotation_euler = (math.pi/2, 0, 0)
cam_data.type = 'PERSP'
cam_data.sensor_fit = 'HORIZONTAL'
cam_data.sensor_width = 36
cam_data.lens = 28.695652173913
cam_data.clip_end = 100


def px(point):
    p = world_to_camera_view(scene, cam, Vector(point))
    return [p.x*1800, (1-p.y)*900]


# Calibrate film shift after perspective lens/location, preserving a level vertical axis.
scene.view_layers[0].update()
initial_center = px((0, 0, opening_height/2))
cam_data.shift_x += (initial_center[0] - 843.0) / 1800
cam_data.shift_y += (455.0 - initial_center[1]) / 1800
scene.view_layers[0].update()
corners = {name: px(point) for name, point in {
    'top_left': (-half_width, 0, opening_height),
    'top_right': (half_width, 0, opening_height),
    'bottom_left': (-half_width, 0, 0),
    'bottom_right': (half_width, 0, 0),
}.items()}
expected = {'top_left': [545,125], 'top_right': [1141,125], 'bottom_left': [545,785], 'bottom_right': [1141,785]}
error = max(abs(corners[key][j] - expected[key][j]) for key in corners for j in (0,1))
assert error <= 2, (corners, error)
assert abs(corners['top_left'][0] - corners['bottom_left'][0]) < 0.01
assert abs(corners['top_right'][0] - corners['bottom_right'][0]) < 0.01
assert cam_data.type == 'PERSP'

world = bpy.data.worlds.new('Neutral diffuse overcast daylight')
scene.world = world
world.use_nodes = True
world.node_tree.nodes.clear()
background = world.node_tree.nodes.new('ShaderNodeBackground')
world_output = world.node_tree.nodes.new('ShaderNodeOutputWorld')
world.node_tree.links.new(background.outputs[0], world_output.inputs['Surface'])
background.inputs['Color'].default_value = (0.83, 0.86, 0.91, 1)
background.inputs['Strength'].default_value = 0.28


def area(name, location, target, power, size):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = power
    data.shape = 'DISK'
    data.size = size
    data.color = (0.93, 0.96, 1)
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


area('Large cool interior bounce', (-1.8,-3.5,5.0), (0,0,1.2), 500, 5)
area('Broad overhead courtyard daylight', (0.5,3.0,6.0), (0,3,0), 700, 6)

vp = px((cam.location.x, 100000, cam.location.z))
assert max(abs(vp[0]-871), abs(vp[1]-486)) <= 0.05, vp
ground_guides = {str(x): [px((x, y, 0)) for y in [-4,-2,0,1,2,3,4,5.5]] for x in [-2,-1.0386,0,1.0386,2]}
receipt = {
    'purpose': 'Empty architecture only. No product, door leaf, hardware, metal frame or installation specification is generated.',
    'canvas': [1800,900],
    'target_bounds': {'left':545,'top':125,'width':596,'height':660},
    'projected_opening_corners': corners,
    'maximum_corner_error_px': error,
    'camera': {'projection':'PERSP','location':list(cam.location),'lens_mm':cam_data.lens,'sensor_width_mm':36,'shift_x':cam_data.shift_x,'shift_y':cam_data.shift_y,'level':True,'forward_world':'+Y','vertical_world':'+Z'},
    'depth_vanishing_point_px': vp,
    'ground_guides_px': ground_guides,
    'opening_plane_y':0,
    'ground_plane_z':0,
    'texture_source': args.texture,
    'distant_background_source': args.background,
    'distant_background_pixel_size':list(back_image.size),
    'courtyard_low_wall_height':0.9,
    'render_engine':'Cycles CPU','samples':64,'denoised':True,
}
(out/'calibration.json').write_text(json.dumps(receipt, indent=2), encoding='utf-8')
scene.render.filepath = str(out/'empty-architecture.png')
bpy.ops.wm.save_as_mainfile(filepath=str(out/'scene.blend'))
print('CALIBRATED_OPENING', json.dumps(corners))
print('DEPTH_VANISHING_POINT', vp)
bpy.ops.render.render(write_still=True)
print('EMPTY_PLATE_READY', scene.render.filepath)
