"""HYDE 9014 macro film, geometry from the factory drawing on the 9014 product page.

Published (public/images/products-hyde/9014-stainless-steel-handle.webp):
  lever length 135 (outer), projection 60 (rose face to lever outer edge),
  tube section 19, rose 53 x 9, spindle 8.
Mitred L corner as drawn and as photographed (9014-sset-...webp).
Omitted (undocumented): grub screw, rose edge profile, weld seam, spindle.
Neutral: 0.5 mm edge break on every edge so highlights can read; no other feature.
"""
import bpy, bmesh, math, sys
from mathutils import Vector

# python3 -c "import sys; sys.argv=['x','--','<out>/f_','all','1.0','12']; exec(open('scripts/blender/hyde-9014-film.py').read())"
# (pip install bpy, Blender 5.0 as a Python module) or: blender -b -P scripts/blender/hyde-9014-film.py -- <out>/f_ all 1.0 12
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "/tmp/f_"
FRAMES = argv[1] if len(argv) > 1 else "all"   # "all" or comma list
RES = float(argv[2]) if len(argv) > 2 else 1.0
SAMPLES = int(argv[3]) if len(argv) > 3 else 48

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
mm = 0.001
R = 9.5 * mm           # tube radius
ROSE_R, ROSE_T = 26.5 * mm, 9 * mm
LEVER, PROJ = 135 * mm, 60 * mm
yc = ROSE_T + PROJ - R  # lever centreline distance from door face

def tube(name, start, end, cut_keep_side):
    """Cylinder from start to end, cut by mitre plane x + y = yc; keep side sign."""
    bm = bmesh.new()
    d = Vector(end) - Vector(start)
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=160,
                          radius1=R, radius2=R, depth=d.length)
    rot = Vector((0, 0, 1)).rotation_difference(d.normalized()).to_matrix().to_4x4()
    bmesh.ops.transform(bm, matrix=rot, verts=bm.verts)
    bmesh.ops.translate(bm, vec=(Vector(start) + Vector(end)) / 2, verts=bm.verts)
    n = Vector((1, 1, 0)).normalized()
    co = Vector((yc / 2, yc / 2, 0))
    res = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
                                 plane_co=co, plane_no=n,
                                 clear_inner=(cut_keep_side > 0), clear_outer=(cut_keep_side < 0))
    edges = [e for e in res["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
    bmesh.ops.holes_fill(bm, edges=edges)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
    return ob

# neck along +Y from rose face, lever along +X
neck = tube("neck", (0, ROSE_T, 0), (0, yc + 3 * R, 0), -1)
lever = tube("lever", (-3 * R, yc, 0), (LEVER - R, yc, 0), +1)
bpy.ops.mesh.primitive_cylinder_add(vertices=192, radius=ROSE_R, depth=ROSE_T,
                                    location=(0, ROSE_T / 2, 0), rotation=(math.radians(90), 0, 0))
rose = bpy.context.active_object; rose.name = "rose"

steel = bpy.data.materials.new("satin_stainless_US32D"); steel.use_nodes = True
b = steel.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (0.62, 0.62, 0.64, 1)
b.inputs["Metallic"].default_value = 1.0
b.inputs["Roughness"].default_value = 0.26
# brushed grain: fine noise stretched along the tube axis
nt = steel.node_tree
tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
nz = nt.nodes.new("ShaderNodeTexNoise"); bump = nt.nodes.new("ShaderNodeBump")
mp.inputs["Scale"].default_value = (40, 4000, 4000)
nz.inputs["Scale"].default_value = 1.0; nz.inputs["Detail"].default_value = 4
bump.inputs["Strength"].default_value = 0.04; bump.inputs["Distance"].default_value = 0.0002
nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
nt.links.new(nz.outputs["Fac"], bump.inputs["Height"]); nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
steel_y = steel.copy()  # neck: grain along Y
steel_y.node_tree.nodes["Mapping"].inputs["Scale"].default_value = (4000, 40, 4000)
rose_m = steel.copy()   # rose: turned finish, circular grain approximated by fine noise
rose_m.node_tree.nodes["Mapping"].inputs["Scale"].default_value = (1500, 1500, 1500)
rose_m.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.3

for ob, m in ((lever, steel), (neck, steel_y), (rose, rose_m)):
    ob.data.materials.append(m)
    bv = ob.modifiers.new("edge_break", "BEVEL"); bv.width = 0.5 * mm; bv.segments = 4
    bv.limit_method = "ANGLE"; bv.angle_limit = math.radians(30); bv.harden_normals = True
    for p in ob.data.polygons: p.use_smooth = True
    ob.modifiers.new("wn", "WEIGHTED_NORMAL").keep_sharp = True

# light: big soft strips, reflected by the metal (the FSB look is almost all reflection)
def strip(name, loc, rot, size, energy):
    bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
    L = bpy.context.active_object; L.name = name
    L.data.shape = "RECTANGLE"; L.data.size, L.data.size_y = size; L.data.energy = energy
    return L
strip("top", (0.06, 0.08, 0.40), (0, 0, 0), (1.4, 0.30), 30)
strip("rim", (0.06, 0.60, -0.10), (math.radians(-100), 0, 0), (1.2, 0.08), 10)
strip("fill", (-0.3, 0.3, 0.05), (math.radians(-80), math.radians(-45), 0), (0.3, 0.3), 6)
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.07, 0.07, 0.072, 1)

# camera: one continuous macro move, keyed through a target empty
cam_d = bpy.data.cameras.new("cam"); cam = bpy.data.objects.new("cam", cam_d); sc.collection.objects.link(cam)
sc.camera = cam; cam_d.lens = 90; cam_d.sensor_width = 36
tgt = bpy.data.objects.new("tgt", None); sc.collection.objects.link(tgt)
tr = cam.constraints.new("TRACK_TO"); tr.target = tgt; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
cam_d.dof.use_dof = True; cam_d.dof.focus_object = tgt; cam_d.dof.aperture_fstop = 4.0

FPS, SEC = 24, 18
sc.render.fps = FPS; sc.frame_start = 1; sc.frame_end = FPS * SEC
Y = yc
keys = [  # (second, camera xyz, target xyz, fstop)
    (0.0,  (0.150, Y + 0.200, 0.015), (0.105, Y, 0.0), 4.0),   # low, front: the lever tip, grain side-lit
    (4.5,  (0.060, Y + 0.190, 0.040), (0.040, Y, 0.0), 4.0),   # track along the tube
    (8.5,  (0.000, Y + 0.170, 0.075), (0.000, Y - 0.005, 0.0), 4.5),   # rise over the mitre
    (12.5, (-0.170, 0.110, 0.060), (0.000, 0.035, 0.0), 5.0),  # swing round to the neck and rose
    (15.5, (0.230, 0.400, 0.200), (0.055, 0.035, 0.0), 11.0),  # pull back: whole lever on its rose
    (18.0, (0.250, 0.430, 0.210), (0.058, 0.035, 0.0), 11.0),
]
for s, c, t, f in keys:
    fr = 1 + round(s * FPS)
    cam.location = c; cam.keyframe_insert("location", frame=fr)
    tgt.location = t; tgt.keyframe_insert("location", frame=fr)
    cam_d.dof.aperture_fstop = f; cam_d.dof.keyframe_insert("aperture_fstop", frame=fr)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves if hasattr(ob.animation_data.action, "fcurves") else []:
        for k in fc.keyframe_points: k.interpolation = "BEZIER"; k.easing = "EASE_IN_OUT"

sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6
sc.render.resolution_x = int(1280 * RES); sc.render.resolution_y = int(720 * RES)
sc.render.film_transparent = True
sc.render.use_persistent_data = True
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
frames = range(sc.frame_start, sc.frame_end + 1) if FRAMES == "all" else [int(x) for x in FRAMES.split(",")]
import os
for fr in frames:
    path = f"{OUT}{fr:04d}.png"
    if os.path.exists(path): continue
    sc.frame_set(fr); sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
print("DONE", len(frames))
