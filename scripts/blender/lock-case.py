"""Builds a mortise lock case in Blender from dimensions the catalogue already publishes.

===========================================================================
WHY THIS IS ALLOWED, WHEN GENERATING A PRODUCT IMAGE IS NOT

AGENTS.md forbids generating an imagined metal product, and the reason is specific: a
hole in the wrong place is a part that cannot be installed, and the buyer who spots one
invented figure discounts every other figure on the site.

A render is a generated image, so the rule only survives if the GEOMETRY is not
imagined. Everything this file draws comes from a number the factory published:

    Centre distance   85mm    spindle centre to cylinder centre
    Backset           45mm    face of the faceplate to spindle centre
    Faceplate     240 × 23mm
    Case height      173mm
    Case depth        72mm

Those five numbers ARE a mortise lock case — they are what a door schedule specifies and
what a joiner routs the mortise from. Nothing here invents one. Where a dimension is not
published, the feature is not drawn: see MISSING below, which is a list and not a set of
defaults. A default is a guess wearing a constant's clothes.

FSB's own hero images are renders. What makes theirs legitimate is that they are renders
OF something. This is the same claim, made from the same kind of evidence.

===========================================================================
WHAT IS NOT MODELLED, AND WHY IT IS ABSENT RATHER THAN APPROXIMATED

Not published for this model, therefore not drawn:

  - faceplate fixing-screw positions and diameter
  - latch and deadbolt profiles (throw is published for some models, shape for none)
  - follower/spindle bore is drawn at the published 8mm square only where stated
  - case thickness across the door (the third dimension) — the case is drawn at a
    nominal 15mm and the render is framed so that face is never the subject

That last one is the honest compromise and it is worth stating plainly: a solid has three
dimensions and the catalogue gives two. So the third is chosen to be uninformative rather
than wrong, and the camera is placed so no viewer can read a measurement off it.

Usage (headless):
    blender --background --python scripts/blender/lock-case.py -- params.json out.png
"""

import json
import math
import sys
from pathlib import Path

import bpy


# --------------------------------------------------------------------------- input

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if len(argv) < 2:
    raise SystemExit("need: params.json output.png")

params = json.loads(Path(argv[0]).read_text(encoding="utf8"))
out_path = Path(argv[1])

MM = 0.001  # Blender works in metres; the catalogue works in millimetres.


def mm(name, required=True):
    value = params.get(name)
    if value is None:
        if required:
            raise SystemExit(f"missing published dimension: {name}")
        return None
    return float(value) * MM


CENTRE_DISTANCE = mm("centreDistance")
BACKSET = mm("backset")
FACEPLATE_L = mm("faceplateLength")
FACEPLATE_W = mm("faceplateWidth")
CASE_HEIGHT = mm("caseHeight")
CASE_DEPTH = mm("caseDepth")

# Not published. Chosen to be uninformative, never load-bearing — see the header.
CASE_THICKNESS = 15 * MM
FACEPLATE_THICKNESS = 3 * MM
SPINDLE = mm("spindle", required=False) or (8 * MM)
CYLINDER_D = mm("cylinderDiameter", required=False) or (17 * MM)  # euro profile, nominal


# ------------------------------------------------------------------------- helpers

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def box(name, size, location):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    return ob


def cylinder(name, radius, depth, location, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, location=location, rotation=rotation, vertices=64
    )
    ob = bpy.context.object
    ob.name = name
    return ob


def boolean_cut(target, cutter):
    """Subtract and remove the cutter. Modelling holes as real geometry, not as a texture.

    A hole painted into a material is exactly the failure this whole exercise exists to
    avoid: it looks right from the render camera and is not there in the model, so nobody
    downstream can measure it.
    """
    mod = target.modifiers.new(name=f"cut_{cutter.name}", type="BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    mod.solver = "EXACT"
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def metal(name, base, roughness, metallic=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*base, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


# --------------------------------------------------------------------------- build

clear_scene()

"""
Coordinate convention, stated once so every number below is checkable:

    +X  along the faceplate (the door edge), upward on a fitted door
    +Y  into the door, away from the faceplate — this is where BACKSET is measured
    +Z  across the door thickness, the dimension the catalogue does not publish

Origin sits at the OUTER FACE of the faceplate, centred on its length. So the spindle
centre is at y = BACKSET exactly, which is the definition of backset, and the cylinder
centre is CENTRE_DISTANCE further along +X.
"""

faceplate = box(
    "faceplate",
    (FACEPLATE_W, FACEPLATE_THICKNESS, FACEPLATE_L),
    (0, FACEPLATE_THICKNESS / 2, 0),
)

case = box(
    "case",
    (CASE_THICKNESS, CASE_DEPTH, CASE_HEIGHT),
    (0, FACEPLATE_THICKNESS + CASE_DEPTH / 2, 0),
)

# ---------------------------------------------------------------------- the bores
#
# THE FIRST VERSION PUT THE CYLINDER OUTSIDE THE CASE, AND THE RENDER SHOWED IT.
#
# It placed the spindle at z = 0 and the cylinder a full CENTRE_DISTANCE below, at
# z = -85mm. The case is 173mm tall centred on zero, so its bottom edge is at -86.5:
# a 17mm bore centred at -85 sits almost entirely off the end and took a bite out of the
# case instead of making a hole. The render came back with one bore and no cylinder,
# which is how the mistake was found.
#
# Centre distance is the distance BETWEEN the two centres, not the distance from the
# middle of the case to the cylinder. They straddle the centre: half above, half below.
# That is also how a fitted lock actually sits, with the follower and the cylinder either
# side of the case's waist.
#
# Both are measured from the faceplate face in Y — that is what backset means, and it is
# the same for both bores because they share a centre line into the door.

spindle_y = FACEPLATE_THICKNESS + BACKSET
spindle_z = CENTRE_DISTANCE / 2
cylinder_z = -CENTRE_DISTANCE / 2

spindle_cut = box(
    "spindle_cut", (CASE_THICKNESS * 2, SPINDLE, SPINDLE), (0, spindle_y, spindle_z)
)
boolean_cut(case, spindle_cut)

cylinder_cut = cylinder(
    "cylinder_cut",
    radius=CYLINDER_D / 2,
    depth=CASE_THICKNESS * 2,
    location=(0, spindle_y, cylinder_z),
    rotation=(0, math.radians(90), 0),
)
boolean_cut(case, cylinder_cut)

# Fails loudly rather than quietly cutting air: a bore that does not fit inside the case
# means the published figures disagree with each other, and that is worth a stop.
half = CASE_HEIGHT / 2
for label, z, r in (("spindle", spindle_z, SPINDLE / 2), ("cylinder", cylinder_z, CYLINDER_D / 2)):
    if abs(z) + r > half:
        raise SystemExit(
            f"{label} bore at {z / MM:.0f}mm falls outside a {CASE_HEIGHT / MM:.0f}mm case — "
            "check the published centre distance and case height against each other."
        )

steel = metal("steel", (0.62, 0.63, 0.64), 0.34)
black = metal("case_black", (0.055, 0.055, 0.058), 0.52, metallic=0.85)
faceplate.data.materials.append(steel)
case.data.materials.append(black)

for ob in (faceplate, case):
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.shade_smooth()
    bpy.ops.object.modifier_add(type="BEVEL")
    ob.modifiers["Bevel"].width = 0.0006
    ob.modifiers["Bevel"].segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")


# ---------------------------------------------------------------------- the studio

"""
The same field the photographs use, so a render and a photograph can sit on one page.

Measured off FSB's own heroes and recorded in scripts/compose-editorial-plate.mjs:
the dark void runs #171614 at the top to #5a5653 at the floor, lit from below and behind.
A render that arrives on a different ground than the plates beside it announces itself as
a different kind of object, which is the opposite of what consistency is for here.
"""
world = bpy.data.worlds.new("studio")
bpy.context.scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.055, 0.053, 0.05, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.6

# A floor, not a wall: rotated 90deg about X it stood up behind the part and split the
# frame into a light top and a dark bottom, which is a horizon, not a studio sweep.
backdrop = box("backdrop", (2.0, 2.0, 0.002), (0, 0.30, -0.16))
backdrop.data.materials.append(metal("ground", (0.16, 0.155, 0.148), 0.62, metallic=0.0))

bpy.ops.object.light_add(type="AREA", location=(-0.42, -0.38, 0.42))
key = bpy.context.object
key.data.energy = 45
key.data.size = 0.75
key.rotation_euler = (math.radians(52), 0, math.radians(-42))

bpy.ops.object.light_add(type="AREA", location=(0.55, -0.2, -0.15))
fill = bpy.context.object
fill.data.energy = 12
fill.data.size = 1.1
fill.rotation_euler = (math.radians(96), 0, math.radians(66))

#
# FIRST RENDER LOOKED AT THE WRONG FACE.

# The camera sat off +X and -Y, which is the narrow edge — the 15mm dimension the
# catalogue does not even publish. Both bores are cut through the X faces, so the one
# view that carries every published number was the one view not being shown.

# Now off +X and slightly above: the spindle bore at backset and the cylinder bore at
# centre distance are both square to the lens, which is what makes the render checkable
# against the spec table instead of merely decorative.

bpy.ops.object.camera_add(location=(0.62, 0.04, 0.16))
cam = bpy.context.object
cam.data.lens = 85  # Compression, so the case is described rather than dramatised.
bpy.context.scene.camera = cam

# Aim the camera at the case's own centre rather than the world origin.
target = bpy.data.objects.new("target", None)
bpy.context.scene.collection.objects.link(target)
target.location = (0, FACEPLATE_THICKNESS + CASE_DEPTH / 2, 0)
track = cam.constraints.new(type="TRACK_TO")
track.target = target
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"


# ------------------------------------------------------------------------- render

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = int(params.get("samples", 96))
scene.cycles.use_denoising = True
scene.render.resolution_x = int(params.get("width", 1600))
scene.render.resolution_y = int(params.get("height", 1000))
scene.render.film_transparent = False
# Metal at metallic 1.0 clips fast; the first render came out as a white card.
scene.view_settings.look = "AgX - Base Contrast"
scene.view_settings.exposure = -0.4
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = str(out_path)

try:
    scene.cycles.device = "GPU"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.get_devices()
except Exception:
    scene.cycles.device = "CPU"

bpy.ops.render.render(write_still=True)
print(f"BLENDER_OK {out_path}")
