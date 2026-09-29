"""HYDE · ONE TAKE — ten single-take macro films, each built only from published dimensions.

Every product below is a solid model whose dimensions come from the product record
(content/products/<slug>.json) or the factory drawing in its gallery. Anything the record
does not dimension is either omitted (holes, screws, keyways, springs) or a documented
neutral closure (an edge radius so grazing light can read an edge, a plate thickness where
the record gives none). The EVIDENCE dict at the bottom is written next to the frames so a
later session can check every number against its source. No feature is guessed.

Usage (bpy 5.x as a Python module, or `blender -b -P`):
  python3 scripts/blender/one-take.py -- <product> <out_prefix> [frames|all] [res] [samples]
  e.g.  python3 scripts/blender/one-take.py -- 311 tmp/one-take/311/f_ all 1.0 10

Then composite: python3 scripts/blender/one-take-composite.py <frames_dir> <product> <out.mp4>
"""
import bpy, bmesh, math, sys, json, os
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PRODUCT = argv[0]
OUT = argv[1]
FRAMES = argv[2] if len(argv) > 2 else "all"
RES = float(argv[3]) if len(argv) > 3 else 1.0
SAMPLES = int(argv[4]) if len(argv) > 4 else 10

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
mm = 0.001
FPS, SEC = 24, 12

# ---------------------------------------------------------------- materials
def _principled(name, color, metallic, rough):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    return m

def _grain(m, scale, strength, distance=0.0002):
    """Fine procedural surface grain so highlights are not glass-smooth."""
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
    nz = nt.nodes.new("ShaderNodeTexNoise"); bump = nt.nodes.new("ShaderNodeBump")
    mp.inputs["Scale"].default_value = scale
    nz.inputs["Scale"].default_value = 1.0; nz.inputs["Detail"].default_value = 5
    bump.inputs["Strength"].default_value = strength; bump.inputs["Distance"].default_value = distance
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], bump.inputs["Height"]); nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m

def MAT(kind, axis="x"):
    brush = {"x": (40, 4000, 4000), "y": (4000, 40, 4000), "z": (4000, 4000, 40)}[axis]
    if kind == "sss":      return _grain(_principled("satin stainless", (0.62, 0.62, 0.64), 1, 0.27), brush, 0.04)
    if kind == "pss":      return _grain(_principled("polished stainless", (0.70, 0.70, 0.72), 1, 0.06), (1500,) * 3, 0.005)
    if kind == "pb":       return _grain(_principled("polished brass", (0.93, 0.72, 0.36), 1, 0.10), (1500,) * 3, 0.01)
    if kind == "ab":       return _grain(_principled("antique brass", (0.42, 0.30, 0.15), 1, 0.38), (900,) * 3, 0.05)
    if kind == "black":    return _grain(_principled("matt black powder", (0.02, 0.02, 0.02), 0, 0.48), (2500,) * 3, 0.12, 0.0001)
    if kind == "abs":      return _grain(_principled("black ABS", (0.015, 0.015, 0.016), 0, 0.40), (3000,) * 3, 0.06, 0.00005)
    if kind == "alu":      return _grain(_principled("anodised aluminium", (0.66, 0.66, 0.67), 1, 0.34), brush, 0.05)
    if kind == "silver":   return _grain(_principled("silver paint", (0.42, 0.42, 0.43), 0.85, 0.36), (2500,) * 3, 0.08, 0.0001)
    if kind == "rubber":   return _principled("white rubber", (0.85, 0.85, 0.83), 0, 0.7)
    raise KeyError(kind)

# ---------------------------------------------------------------- geometry helpers
def _finish(ob, mat, radius):
    ob.data.materials.append(mat)
    if radius:
        bv = ob.modifiers.new("edge_break", "BEVEL"); bv.width = radius; bv.segments = 4
        bv.limit_method = "ANGLE"; bv.angle_limit = math.radians(30); bv.harden_normals = True
    for p in ob.data.polygons: p.use_smooth = True
    ob.modifiers.new("wn", "WEIGHTED_NORMAL").keep_sharp = True
    return ob

def _obj(name, bm):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob); return ob

def box(name, size, center, mat, radius=0.5 * mm):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts); bmesh.ops.translate(bm, vec=center, verts=bm.verts)
    return _finish(_obj(name, bm), mat, radius)

def cyl(name, r, start, end, mat, radius=0.5 * mm, segs=128, r2=None):
    bm = bmesh.new(); d = Vector(end) - Vector(start)
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=r2 if r2 else r, depth=d.length)
    rot = Vector((0, 0, 1)).rotation_difference(d.normalized()).to_matrix().to_4x4()
    bmesh.ops.transform(bm, matrix=rot, verts=bm.verts)
    bmesh.ops.translate(bm, vec=(Vector(start) + Vector(end)) / 2, verts=bm.verts)
    return _finish(_obj(name, bm), mat, radius)

def sweep(name, points, r, mat, radius=0, segs=48, bevel_res=12):
    """Round tube along a polyline with rounded corners (a bent bar)."""
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"
    sp = cu.splines.new("POLY"); sp.points.add(len(points) - 1)
    for p, xyz in zip(sp.points, points): p.co = (*xyz, 1)
    cu.bevel_depth = r; cu.bevel_resolution = bevel_res; cu.use_fill_caps = True
    cu.resolution_u = 24; cu.twist_mode = "MINIMUM"
    ob = bpy.data.objects.new(name, cu); sc.collection.objects.link(ob)
    # smooth the corners: convert to mesh after a subdivide-smooth of the poly
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    sp.type = "NURBS"; sp.order_u = 3; sp.use_endpoint_u = True
    bpy.ops.object.convert(target="MESH")
    ob = bpy.context.active_object; ob.data.materials.append(mat)
    for p in ob.data.polygons: p.use_smooth = True
    return ob

def rounded_plate(name, w, h, t, mat, corner, center=(0, 0, 0), axis="y"):
    """Plate w×h with corner radius, thickness t along `axis` (its face normal)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(w, t, h) if axis == "y" else (w, h, t), verts=bm.verts)
    # round the four long edges parallel to the thickness axis
    edges = [e for e in bm.edges if abs((e.verts[0].co - e.verts[1].co).normalized()[1 if axis == "y" else 2]) > 0.99]
    bmesh.ops.bevel(bm, geom=edges, offset=corner, segments=16, profile=0.5, affect="EDGES")
    bmesh.ops.translate(bm, vec=center, verts=bm.verts)
    return _finish(_obj(name, bm), mat, 0.4 * mm)

# ---------------------------------------------------------------- products
# Coordinates: door face is the plane y = 0, product projects toward +y. z is up. Units metres.
P = {}

def build_lever(model, lever, section, projection, rose, rose_t, square):
    R = section / 2 * mm
    y = rose_t * mm + projection * mm - R
    n = 1.0 / math.sqrt(2)
    def tube(name, a, b, keep):
        bm = bmesh.new(); d = Vector(b) - Vector(a)
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=160, radius1=R, radius2=R, depth=d.length)
        rot = Vector((0, 0, 1)).rotation_difference(d.normalized()).to_matrix().to_4x4()
        bmesh.ops.transform(bm, matrix=rot, verts=bm.verts); bmesh.ops.translate(bm, vec=(Vector(a) + Vector(b)) / 2, verts=bm.verts)
        res = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=Vector((y / 2, y / 2, 0)),
                                     plane_no=Vector((n, n, 0)), clear_inner=keep > 0, clear_outer=keep < 0)
        bmesh.ops.holes_fill(bm, edges=[e for e in res["geom_cut"] if isinstance(e, bmesh.types.BMEdge)])
        return _finish(_obj(name, bm), MAT("sss", "y" if name == "neck" else "x"), 0.5 * mm)
    tube("neck", (0, rose_t * mm, 0), (0, y + 3 * R, 0), -1)
    tube("lever", (-3 * R, y, 0), (lever * mm - R, y, 0), +1)
    if square:
        box("rose", (rose * mm, rose_t * mm, rose * mm), (0, rose_t * mm / 2, 0), MAT("sss", "z"), 0.8 * mm)
    else:
        cyl("rose", rose / 2 * mm, (0, 0, 0), (0, rose_t * mm, 0), MAT("sss", "z"), 0.8 * mm, segs=192)
    Y = y
    return [
        (0.0, (0.55, 0.80, 0.10), (0.105, Y, 0.0), 0.22, 4.0),
        (3.5, (0.10, 0.95, 0.25), (0.045, Y, 0.0), 0.30, 4.0),
        (6.5, (0.00, 0.85, 0.55), (0.000, Y - 0.005, 0.0), 0.34, 4.5),
        (9.0, (-0.90, 0.35, 0.30), (0.000, 0.030, 0.0), 0.45, 5.0),
        (11.0, (0.45, 0.80, 0.42), (0.055, 0.035, 0.0), 1.25, 11.0),
        (12.0, (0.47, 0.79, 0.43), (0.057, 0.035, 0.0), 1.28, 11.0),
    ]

P["9014"] = dict(build=lambda: build_lever("9014", 135, 19, 60, 53, 9, False),
                 lockup=("9014", "135 · 60 · Ø19 mm", "SSS", "satin stainless steel"))
P["9004S"] = dict(build=lambda: build_lever("9004S", 135, 20, 63, 53, 8, True),
                  lockup=("9004S", "135 · 63 · Ø20 mm · 53 mm square rose", "SSS", "satin stainless steel"))

def build_311():
    """311 panic exit device. Drawing (gallery image 5): housing 229 × 34.5 × 48; cylinder centres
    72 / 92; projection 100. Record: bar length 900. Bar Ø measured from the front elevation photo
    against the 34.5 housing: 20–30 mm (its highlight merges with the white field); 25 used and flagged. Arm section is a neutral 24 × 14 blade; housing top radius as
    drawn (semicircle). Omitted: cylinder hole, screws, dogging, end caps' inner detail."""
    H, W, D = 229 * mm, 34.5 * mm, 48 * mm
    BAR_L, BAR_R = 900 * mm, 12.5 * mm
    PROJ = 100 * mm
    pitch = BAR_L + W  # housing centre-to-centre: bar spans the inside of the two arms
    z_bar = H * 0.32   # bar sits low on the housing, as photographed and drawn
    z_pivot = H * 0.62
    for i, x in enumerate((-pitch / 2, pitch / 2)):
        # housing: box with a semicircular top as drawn
        box(f"housing{i}", (W, D, H - W / 2), (x, D / 2, (H - W / 2) / 2), MAT("abs"), 3 * mm)
        cyl(f"housing_top{i}", W / 2, (x, 0, H - W / 2), (x, D, H - W / 2), MAT("abs"), 1 * mm)
        # arm: from the housing front, curving down and out to the bar
        s = 1 if i == 0 else -1
        pts = [(x, D - 5 * mm, z_pivot), (x, D + 12 * mm, z_pivot - 4 * mm), (x, PROJ - 22 * mm, z_bar + 30 * mm),
               (x, PROJ - 12 * mm, z_bar + 6 * mm), (x + s * 6 * mm, PROJ - 10 * mm, z_bar), (x + s * 40 * mm, PROJ - 10 * mm, z_bar)]
        arm = sweep(f"arm{i}", pts, 7 * mm, MAT("abs"))
        for v in arm.data.vertices: v.co.x = x + (v.co.x - x) * 1.7   # blade: 24 wide across the housing, 14 thick
    cyl("bar", BAR_R, (-BAR_L / 2, PROJ - 10 * mm, z_bar), (BAR_L / 2, PROJ - 10 * mm, z_bar), MAT("alu", "x"), 0.6 * mm, segs=160)
    Y = PROJ - 10 * mm
    return [
        (0.0, (0.80, 0.55, 0.15), (0.10, Y, z_bar), 0.10, 3.5),                 # along the bar, grazing
        (3.5, (0.35, 0.85, 0.30), (-0.25, Y, z_bar), 0.16, 3.5),
        (6.5, (0.30, 0.70, 0.65), (-pitch / 2 + 0.01, Y - 0.03, z_bar + 0.04), 0.20, 4.0),   # over the arm to the housing
        (9.0, (-0.75, 0.45, 0.50), (-pitch / 2, 0.03, H * 0.60), 0.24, 5.0),                    # housing top, edge-on
        (11.0, (0.30, 0.85, 0.42), (0.0, 0.04, H * 0.42), 1.20, 14.0),                          # whole device
        (12.0, (0.32, 0.84, 0.43), (0.0, 0.04, H * 0.42), 1.23, 14.0),
    ]
P["311"] = dict(build=build_311, lockup=("311", "900 mm bar · 229 × 34.5 × 48 housing · 72 / 92 centres", "MB", "black ABS · anodised aluminium bar"))

def build_19_130():
    """19-130MM glass door pull. Record: plate 200 × 65 × 1.2; grip centres 148; projection 60; Ø19."""
    rounded_plate("plate", 65 * mm, 200 * mm, 1.2 * mm, MAT("sss", "z"), 32 * mm, center=(0, 0.6 * mm, 0))
    r = 9.5 * mm; y = 60 * mm - r
    pts = [(0, 1.2 * mm, -74 * mm), (0, y, -74 * mm), (0, y, 74 * mm), (0, 1.2 * mm, 74 * mm)]
    sweep("grip", pts, r, MAT("sss"))
    return [
        (0.0, (0.15, 0.90, -0.40), (0.000, y, -0.010), 0.14, 3.5),
        (3.5, (0.40, 0.85, 0.30), (0.000, y, 0.055), 0.20, 3.5),
        (6.5, (0.55, 0.55, 0.65), (0.000, 0.030, 0.075), 0.28, 4.0),
        (9.0, (-0.90, 0.40, 0.15), (0.000, 0.010, 0.000), 0.55, 5.0),
        (11.0, (0.50, 0.80, 0.35), (0.000, 0.020, 0.000), 1.20, 12.0),
        (12.0, (0.52, 0.79, 0.36), (0.000, 0.020, 0.000), 1.23, 12.0),
    ]
P["19-130MM"] = dict(build=build_19_130, lockup=("19-130MM", "200 × 65 plate · 148 centres · 60 projection · Ø19", "SSS", "satin stainless steel"))

def build_70sn():
    """70SN profile cylinder, 70 mm (35/35). Section per DIN 18252 / EN 1303 europrofile: Ø17 round
    part, 10 wide body, 33 overall height; cam gap 10 in the middle (evidence in
    docs/design-references/2026-09-14-dimension-models). Omitted: keyways, pins, fixing thread, cam profile
    (a neutral 10 × 28 disc segment stands in)."""
    def half(name, x0, x1):
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=128, radius1=8.5 * mm, radius2=8.5 * mm, depth=x1 - x0)
        bmesh.ops.transform(bm, matrix=Matrix.Rotation(math.radians(90), 4, "Y"), verts=bm.verts)
        bmesh.ops.translate(bm, vec=((x0 + x1) / 2, 0, 0), verts=bm.verts)
        top = _finish(_obj(name + "_round", bm), MAT("pb"), 0.3 * mm)
        box(name + "_body", (x1 - x0, 10 * mm, 33 * mm - 8.5 * mm), ((x0 + x1) / 2, 0, -(33 * mm - 8.5 * mm) / 2), MAT("pb"), 0.6 * mm)
    half("a", -35 * mm, -5 * mm); half("b", 5 * mm, 35 * mm)
    cyl("cam", 14 * mm, (-5 * mm, 0, -12 * mm), (5 * mm, 0, -12 * mm), MAT("pb"), 0.4 * mm, segs=96)
    return [
        (0.0, (0.90, 0.30, 0.35), (0.020, 0.0, 0.006), 0.35, 2.8),
        (3.5, (0.15, 0.85, 0.50), (-0.010, 0.0, 0.002), 0.45, 3.0),
        (6.5, (-0.50, 0.75, -0.40), (0.000, 0.0, -0.012), 0.50, 3.0),
        (9.0, (-0.85, 0.35, 0.40), (0.000, 0.0, 0.000), 0.70, 4.0),
        (11.0, (0.60, 0.70, 0.40), (0.000, 0.0, -0.004), 1.25, 10.0),
        (12.0, (0.61, 0.69, 0.41), (0.000, 0.0, -0.004), 1.28, 10.0),
    ]
P["70SN"] = dict(build=build_70sn, lockup=("70SN", "70 mm · 35 / 35 · europrofile", "PB", "polished brass"))

def build_ssh016():
    """SSH016 hinge, size 7: 4" × 4" × 2.5 mm (101.6 × 101.6 open width × 2.5). Five knuckles as
    photographed; knuckle Ø 13 mm is a neutral closure (not published). Omitted: screw holes (positions
    not published — a hole in the wrong place is a part that cannot be fitted), pin ends."""
    L, T, K = 101.6 * mm, 2.5 * mm, 13 * mm
    leaf_w = (L - K) / 2
    # lying open on the door: leaves in the plane y=0, knuckle axis along z
    box("leaf_a", (leaf_w, T, L), (-(K / 2 + leaf_w / 2), T / 2, 0), MAT("ab"), 0.4 * mm)
    box("leaf_b", (leaf_w, T, L), (+(K / 2 + leaf_w / 2), T / 2, 0), MAT("ab"), 0.4 * mm)
    seg = L / 5
    for i in range(5):
        z0 = -L / 2 + i * seg + 0.3 * mm; z1 = z0 + seg - 0.6 * mm
        cyl(f"knuckle{i}", K / 2, (0, K / 2, z0), (0, K / 2, z1), MAT("ab"), 0.3 * mm, segs=96)
    return [
        (0.0, (0.05, 0.85, -0.55), (0.000, 0.006, -0.030), 0.22, 3.0),
        (3.5, (0.35, 0.90, 0.15), (0.000, 0.006, 0.030), 0.30, 3.0),
        (6.5, (0.65, 0.55, 0.55), (0.000, 0.005, 0.045), 0.38, 3.5),
        (9.0, (-0.92, 0.35, 0.10), (-0.020, 0.002, 0.000), 0.60, 4.0),
        (11.0, (0.45, 0.80, 0.40), (0.000, 0.005, 0.000), 1.25, 11.0),
        (12.0, (0.47, 0.79, 0.41), (0.000, 0.005, 0.000), 1.28, 11.0),
    ]
P["SSH016"] = dict(build=build_ssh016, lockup=("SSH016", "4\" × 4\" × 2.5 mm · five knuckles", "AB", "antique brass"))

def build_bh21():
    """BH21 toilet roll holder. Record: width 152, drop 96, rose Ø45 × 10, stem Ø22, bar Ø6."""
    cyl("rose", 22.5 * mm, (0, 0, 0), (0, 10 * mm, 0), MAT("pss"), 0.8 * mm, segs=160)
    cyl("stem", 11 * mm, (0, 10 * mm, 0), (0, 30 * mm, 0), MAT("pss"), 0.6 * mm)
    r = 3 * mm; y = 30 * mm + 12 * mm
    pts = [(0, 28 * mm, 0), (0, y, 0), (0, y, -(96 - 3) * mm), (152 * mm - 3 * mm, y, -(96 - 3) * mm), (152 * mm - 3 * mm, y, -40 * mm)]
    sweep("arm", pts, r, MAT("pss"))
    return [
        (0.0, (0.60, 0.75, 0.20), (0.110, y, -0.093), 0.20, 2.8),
        (3.5, (0.20, 0.90, 0.35), (0.020, y, -0.093), 0.28, 2.8),
        (6.5, (-0.45, 0.80, 0.35), (0.000, 0.030, -0.010), 0.36, 3.5),
        (9.0, (0.55, 0.60, 0.60), (0.000, 0.012, 0.000), 0.50, 4.0),
        (11.0, (0.45, 0.85, 0.25), (0.072, 0.020, -0.045), 1.25, 11.0),
        (12.0, (0.46, 0.84, 0.26), (0.073, 0.020, -0.045), 1.28, 11.0),
    ]
P["BH21"] = dict(build=build_bh21, lockup=("BH21", "152 · 96 drop · Ø45 rose · Ø6 bar", "PSS", "polished stainless steel"))

def build_lc07():
    """LC07 85×45 lock case. Record: faceplate 240 × 23; case 173 high × 72 deep; latch throw 26;
    bolt projection 18.5; centre distance 85; backset 45. Case thickness 15 is the neutral closure
    used by the 2026-09-14 studies. Latch (a 24 × 12 wedge) and bolt (a 22 × 12 block) are neutral
    stand-ins at the throws published; their true profiles and heights are not. Omitted: follower and
    cylinder holes, fixing holes, forend screws."""
    T = 15 * mm
    box("case", (72 * mm, T, 173 * mm), (-36 * mm - 3 * mm, 0, 0), MAT("black"), 0.8 * mm)
    box("faceplate", (3 * mm, 23 * mm, 240 * mm), (-1.5 * mm, 0, 0), MAT("sss", "z"), 0.4 * mm)
    z_latch, z_bolt = 173 * mm / 2 - 40 * mm, -173 * mm / 2 + 40 * mm   # positions not published: neutral, symmetric
    box("latch", (26 * mm, 12 * mm, 24 * mm), (13 * mm, 0, z_latch), MAT("pb"), 1.2 * mm)
    box("bolt", (18.5 * mm, 12 * mm, 22 * mm), (18.5 * mm / 2, 0, z_bolt), MAT("sss", "x"), 0.6 * mm)
    return [
        (0.0, (0.35, 0.55, -0.75), (0.000, 0.0, -0.100), 0.20, 3.0),      # up the faceplate edge
        (3.5, (0.70, 0.65, -0.25), (0.010, 0.0, z_bolt), 0.24, 3.0),
        (6.5, (0.60, -0.55, 0.55), (0.012, 0.0, z_latch), 0.30, 3.5),
        (9.0, (-0.75, -0.55, 0.35), (-0.040, 0.0, 0.020), 0.55, 4.0),
        (11.0, (0.40, -0.80, 0.45), (-0.030, 0.0, 0.000), 1.25, 12.0),
        (12.0, (0.42, -0.79, 0.46), (-0.030, 0.0, 0.000), 1.28, 12.0),
    ]
P["LC07"] = dict(build=build_lc07, lockup=("LC07", "85 × 45 · 240 × 23 faceplate · 173 × 72 case", "", "powder-coated case · stainless forend"))

def build_ds01():
    """DS01 door stopper. Record: height 96, base Ø34, body Ø24, stem Ø10, footprint 46. The hero
    photograph shows polished brass with a white rubber buffer; the record names no finish and its
    summary says stainless (the -2 photo) — this film follows the hero photograph. Base rim 6 mm and
    buffer height 24 mm are neutral closures. Omitted: base screw holes."""
    cyl("base", 23 * mm, (0, 0, 0), (0, 3 * mm, 0), MAT("pb"), 0.6 * mm, segs=160, r2=17 * mm)   # 46 footprint tapering to Ø34
    cyl("base_top", 17 * mm, (0, 3 * mm, 0), (0, 8 * mm, 0), MAT("pb"), 1.0 * mm, segs=160)
    cyl("stem", 5 * mm, (0, 8 * mm, 0), (0, 72 * mm, 0), MAT("pb"), 0.3 * mm)
    cyl("buffer", 12 * mm, (0, 72 * mm, 0), (0, 96 * mm, 0), MAT("rubber"), 1.5 * mm, segs=128)
    return [
        (0.0, (0.90, 0.15, 0.40), (0.000, 0.004, 0.000), 0.40, 2.8),
        (3.5, (0.70, 0.55, 0.45), (0.000, 0.040, 0.000), 0.40, 2.8),
        (6.5, (0.40, 0.80, 0.45), (0.000, 0.084, 0.000), 0.45, 3.0),
        (9.0, (-0.80, 0.45, 0.40), (0.000, 0.050, 0.000), 0.80, 4.0),
        (11.0, (0.65, 0.35, 0.65), (0.000, 0.048, 0.000), 1.25, 10.0),
        (12.0, (0.66, 0.34, 0.66), (0.000, 0.048, 0.000), 1.28, 10.0),
    ]
P["DS01"] = dict(build=build_ds01, lockup=("DS01", "96 high · Ø34 base · Ø24 buffer · Ø10 stem", "PB", "polished brass · white rubber"))

def build_027():
    """027 panic exit trim. Record: plate 75 wide × 77.5 high; fixing centres 52.5; lever length 122;
    lever drop 58; spindle 60. Plate thickness 8 and the lever's 22 × 12 blade section are neutral
    closures. Omitted: cylinder hole, fixing holes, spindle."""
    rounded_plate("plate", 75 * mm, 77.5 * mm, 8 * mm, MAT("silver"), 8 * mm, center=(0, 4 * mm, 0))
    cyl("boss", 14 * mm, (0, 8 * mm, 0), (0, 22 * mm, 0), MAT("silver"), 1 * mm)
    # blade lever: out 122 from the boss centre, dropping 58 at the tip (record: lever drop)
    bm = bmesh.new()
    prof = [(0, 0, -6 * mm), (0, 0, 6 * mm)]
    pts = [(0, 22 * mm, 0), (0, 40 * mm, 0), (40 * mm, 46 * mm, -8 * mm), (95 * mm, 46 * mm, -35 * mm), (122 * mm, 42 * mm, -58 * mm)]
    sweep("lever", pts, 8 * mm, MAT("silver"))
    return [
        (0.0, (0.60, 0.75, -0.25), (0.110, 0.045, -0.050), 0.25, 3.0),
        (3.5, (0.30, 0.90, 0.30), (0.045, 0.046, -0.010), 0.32, 3.0),
        (6.5, (-0.20, 0.85, 0.50), (0.000, 0.030, 0.010), 0.40, 3.5),
        (9.0, (-0.90, 0.40, 0.20), (0.000, 0.010, 0.000), 0.60, 4.0),
        (11.0, (0.50, 0.80, 0.35), (0.046, 0.020, -0.020), 1.25, 11.0),
        (12.0, (0.52, 0.79, 0.36), (0.047, 0.020, -0.020), 1.28, 11.0),
    ]
P["027"] = dict(build=build_027, lockup=("027", "75 × 77.5 plate · 122 lever · 52.5 centres", "", "silver spray-painted aluminium"))

# ---------------------------------------------------------------- scene
keys = P[PRODUCT]["build"]()

def strip(name, loc, rot, size, energy):
    bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
    L = bpy.context.active_object; L.name = name
    L.data.shape = "RECTANGLE"; L.data.size, L.data.size_y = size; L.data.energy = energy
    return L
# the same three lights for all ten films, scaled to the product's extent
_pts = [o.matrix_world @ Vector(c) for o in sc.collection.objects if o.type == "MESH" for c in o.bound_box]
_lo = Vector((min(p.x for p in _pts), min(p.y for p in _pts), min(p.z for p in _pts)))
_hi = Vector((max(p.x for p in _pts), max(p.y for p in _pts), max(p.z for p in _pts)))
ext = max(_hi - _lo)   # longest extent of the whole assembly, not of one part
s = max(ext / 0.2, 1.0)
strip("top", (0.06 * s, 0.08 * s, 0.40 * s), (0, 0, 0), (1.4 * s, 0.30 * s), 12 * s * s)
strip("rim", (0.06 * s, 0.60 * s, -0.10 * s), (math.radians(-100), 0, 0), (1.2 * s, 0.08 * s), 7 * s * s)
strip("fill", (-0.3 * s, 0.3 * s, 0.05 * s), (math.radians(-80), math.radians(-45), 0), (0.5 * s, 0.5 * s), 5 * s * s)
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
wn = w.node_tree; bg = wn.nodes["Background"]; bg.inputs["Strength"].default_value = 1.0
tc = wn.nodes.new("ShaderNodeTexCoord"); mp = wn.nodes.new("ShaderNodeMapping"); gr = wn.nodes.new("ShaderNodeTexGradient")
ramp = wn.nodes.new("ShaderNodeValToRGB"); gr.gradient_type = "LINEAR"
mp.inputs["Rotation"].default_value = (0, math.radians(-90), 0)   # gradient along world z
mp.inputs["Location"].default_value = (0.5, 0, 0); mp.inputs["Scale"].default_value = (0.5, 1, 1)
ramp.color_ramp.elements[0].position = 0.0; ramp.color_ramp.elements[0].color = (0.05, 0.05, 0.052, 1)
ramp.color_ramp.elements[1].position = 1.0; ramp.color_ramp.elements[1].color = (0.75, 0.75, 0.76, 1)
e = ramp.color_ramp.elements.new(0.5); e.color = (0.22, 0.22, 0.225, 1)
wn.links.new(tc.outputs["Generated"], mp.inputs["Vector"]); wn.links.new(mp.outputs["Vector"], gr.inputs["Vector"])
wn.links.new(gr.outputs["Fac"], ramp.inputs["Fac"]); wn.links.new(ramp.outputs["Color"], bg.inputs["Color"])

cam_d = bpy.data.cameras.new("cam"); cam = bpy.data.objects.new("cam", cam_d); sc.collection.objects.link(cam)
sc.camera = cam; cam_d.sensor_width = 36; cam_d.clip_start = 0.002
tgt = bpy.data.objects.new("tgt", None); sc.collection.objects.link(tgt)
tr = cam.constraints.new("TRACK_TO"); tr.target = tgt; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
cam_d.dof.use_dof = True; cam_d.dof.focus_object = tgt

sc.render.fps = FPS; sc.frame_start = 1; sc.frame_end = FPS * SEC
# Keys are (second, direction from target to camera, target, framing, f-stop). Framing is the
# fraction of the product's longest extent that spans the frame width, so the same six beats read
# the same on a 70 mm cylinder and a 900 mm push bar; distance follows from the 90 mm lens.
cam_d.lens = 90 if ext >= 0.30 else (60 if ext >= 0.15 else 40)
MIN_DIST = 1.4 * cam_d.lens * mm
HALF_TAN = (cam_d.sensor_width / 2) / cam_d.lens
for t, d, g, frac, f in keys:
    fr = 1 + round(t * FPS)
    dv = Vector(d).normalized(); dist = max(ext * frac / (2 * HALF_TAN), MIN_DIST)
    cam.location = Vector(g) + dv * dist; cam.keyframe_insert("location", frame=fr)
    tgt.location = g; tgt.keyframe_insert("location", frame=fr)
    cam_d.dof.aperture_fstop = f * max(1.0, 0.2 / ext); cam_d.dof.keyframe_insert("aperture_fstop", frame=fr)
sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6
sc.render.use_persistent_data = True
sc.render.resolution_x = int(1280 * RES); sc.render.resolution_y = int(720 * RES)
sc.render.film_transparent = True
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Base Contrast"
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"

os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)
with open(os.path.join(os.path.dirname(OUT) or ".", "lockup.json"), "w") as fh:
    json.dump({"model": PRODUCT, "lockup": P[PRODUCT]["lockup"], "doc": P[PRODUCT]["build"].__doc__ if PRODUCT not in ("9014", "9004S") else build_lever.__doc__}, fh, ensure_ascii=False, indent=2)
frames = range(sc.frame_start, sc.frame_end + 1) if FRAMES == "all" else [int(x) for x in FRAMES.split(",")]
for fr in frames:
    path = f"{OUT}{fr:04d}.png"
    if os.path.exists(path): continue
    sc.frame_set(fr); sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
print("DONE", PRODUCT, len(frames))
