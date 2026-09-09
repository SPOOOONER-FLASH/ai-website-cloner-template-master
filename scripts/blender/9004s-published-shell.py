"""9004S exterior shell from catalogue orthographic drawing, gallery view 6.

All geometry dimensions below are published; metres are used in Blender.
No guessed closure dimensions are needed for these two closed exterior solids.
Intentionally OMIT: undimensioned edge radii, inset rose trim, set screw, screw
holes, rose interior, spring cassette, spindle length, cylinder escutcheon.
This is an exterior dimension study, NOT complete manufacturing/installation CAD.
Materials and studio illumination are presentation choices, not finish measurements.
Run: blender --background --python-exit-code 1 --python this-file -- output-dir
"""
import bpy
import bmesh
import json
import sys
import hashlib
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / 'public/images/products/9004s-stainless-steel-handle-6.webp'
MM = .001
P = {'lever_length':135, 'lever_height':20, 'front_bar_depth':10,
     'neck_width':20, 'projection_from_rose_back':63,
     'rose_size':53, 'rose_depth':8}

def check():
    assert P['rose_depth'] < P['projection_from_rose_back'] - P['front_bar_depth']
    assert 0 < P['neck_width'] < P['lever_length']
    assert P['lever_height'] < P['rose_size']
check()

# Save a dimensioned orthographic drawing BEFORE constructing beauty geometry.
# Front: x across lever; y vertical. Top: x across lever; z projection from door.
front = '<rect x="-26.5" y="-26.5" width="53" height="53"/><rect x="-10" y="-10" width="135" height="20"/>'
top = '<rect x="-26.5" y="0" width="53" height="8"/><path d="M -10 8 H 10 V 53 H 125 V 63 H -10 Z"/>'
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
<rect width="1200" height="850" fill="#f8f7f3"/>
<g font-family="Arial,sans-serif" fill="#232323"><text x="60" y="55" font-size="28">9004S — published exterior dimensions</text>
<text x="60" y="86" font-size="16">Millimetres. Catalogue gallery view 6. Omitted details are listed in the Blender file.</text>
<text x="60" y="142" font-size="20">FRONT</text><text x="60" y="480" font-size="20">TOP / PROJECTION</text></g>
<g transform="translate(230 280) scale(4)" fill="none" stroke="#222" stroke-width=".45">{front}
<path d="M -10 -15 V -38 M 125 -15 V -38 M -10 -35 H125 M-32 -26.5 H-42 M-32 26.5 H-42 M-38 -26.5 V26.5"/>
<g fill="#222" stroke="none" font-family="Arial" font-size="5"><text x="49" y="-39">135</text><text x="-50" y="2">53</text><text x="130" y="2">20</text></g></g>
<g transform="translate(230 520) scale(4)" fill="none" stroke="#222" stroke-width=".45">{top}
<path d="M -32 0 H-42 M -16 63 H-42 M -38 0 V63"/>
<g fill="#222" stroke="none" font-family="Arial" font-size="5"><text x="-51" y="33">63</text><text x="29" y="6">8</text><text x="-5" y="31">20</text><text x="129" y="60">10</text></g></g>
<text x="60" y="824" font-family="Arial" font-size="15" fill="#555">No inferred fixing holes, internal mechanism, trim dimensions or edge radii.</text></svg>'''
(OUT/'9004s-orthographic.svg').write_text(svg, encoding='utf8')

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'MILLIMETERS'

def material(name, color, metallic, roughness):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color,1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = roughness
    if metallic:
        anisotropy=p.inputs.get('Anisotropic') or p.inputs.get('Anisotropic IOR Level')
        if anisotropy is not None: anisotropy.default_value = 0
    return m
metal = material('Satin stainless presentation',(.55,.57,.59),1,.29)

def box(name, size, loc, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=tuple(v*MM for v in loc))
    ob=bpy.context.object; ob.name=name
    ob.scale=tuple(v*MM for v in size)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(mat)
    return ob
rose=box('Rose — 53 x 53 x 8 mm',(53,53,8),(0,0,4),metal)
# One watertight L-profile extruded through exactly 20mm; no overlapping-box seam.
profile=[(-10,8),(10,8),(10,53),(125,53),(125,63),(-10,63)]
verts=[(x*MM,y*MM,z*MM) for y in [-10,10] for x,z in profile]
n=len(profile)
faces=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]
faces += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
mesh=bpy.data.meshes.new('Published L profile'); mesh.from_pydata(verts,[],faces); mesh.update()
lever=bpy.data.objects.new('Lever — 135 x 20 / 10 mm front bar',mesh)
scene.collection.objects.link(lever); lever.data.materials.append(metal)

evidence={'source':str(SOURCE.relative_to(ROOT)), 'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
          'parameters_mm':P, 'status':'Published exterior shell only; incomplete product CAD',
          'omitted':['edge radii','inset rose trim','set screw','fixing holes','rose interior','spring cassette','spindle of unknown length','escutcheon dimensions']}
for ob in [rose,lever]:
    ob['provenance']=json.dumps(evidence)
    ob['manufacturing_ready']=False

# Verify mesh dimensions independently of the parameter labels.
bpy.context.view_layer.update()
for ob,expected in [(rose,(53,53,8)),(lever,(135,20,55))]:
    actual=[v/MM for v in ob.dimensions]
    assert all(abs(a-b)<1e-4 for a,b in zip(actual,expected)),(ob.name,actual,expected)
    edge_counts={}
    for face in ob.data.polygons:
        vs=list(face.vertices)
        for a,b in zip(vs,vs[1:]+vs[:1]):
            key=tuple(sorted([a,b])); edge_counts[key]=edge_counts.get(key,0)+1
    assert all(v==2 for v in edge_counts.values()),'Non-manifold solid'
    evidence.setdefault('measured_objects',[]).append({'name':ob.name,'dimensions_mm':actual,'closed_mesh':True})

# Recompute outward normals explicitly; works in background without selecting other parts.
for ob in [rose,lever]:
    bm=bmesh.new(); bm.from_mesh(ob.data)
    bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces)); bm.to_mesh(ob.data); bm.free()

# Pale architectural display, with all product geometry and set pieces separately named.
stone=material('Set — warm pale stone',(.65,.63,.59),0,.85)
box('SET / backing',(600,420,10),(45,0,-7),stone)
world=bpy.data.worlds.new('Soft studio'); world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.7,.73,.78,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.15; scene.world=world
target=Vector((.046,0,.022))
def aim(ob): ob.rotation_euler=(target-ob.location).to_track_quat('-Z','Y').to_euler()
for name,loc,power,size in [('Window',(-.18,.24,.38),8,.28),('Fill',(.2,-.1,.28),2,.22)]:
    data=bpy.data.lights.new(name,'AREA'); data.energy=power; data.shape='DISK'; data.size=size
    ob=bpy.data.objects.new(name,data); scene.collection.objects.link(ob); ob.location=loc; aim(ob)
data=bpy.data.cameras.new('Orthographic studio'); cam=bpy.data.objects.new('Camera',data); scene.collection.objects.link(cam)
cam.location=(.046,-.25,.40); aim(cam); data.type='ORTHO'; data.ortho_scale=.23; scene.camera=cam
scene.render.engine='CYCLES'; scene.cycles.samples=160; scene.cycles.use_denoising=True
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type='OPTIX'; prefs.get_devices()
    for device in prefs.devices: device.use=device.type!='CPU'
    scene.cycles.device='GPU'
except Exception: pass
scene.render.resolution_x=1600; scene.render.resolution_y=1200; scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
scene.view_settings.exposure=-.7
scene.render.image_settings.file_format='PNG'; scene.render.filepath=str(OUT/'9004s-preview.png')
note=bpy.data.texts.new('READ ME — scope and dimensions'); note.write(__doc__+'\n'+json.dumps(evidence,indent=2))
image=bpy.data.images.load(str(SOURCE)); image.pack()
(OUT/'9004s-evidence.json').write_text(json.dumps(evidence,indent=2),encoding='utf8')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'9004s-published-shell.blend'))
bpy.ops.render.render(write_still=True)
print('BLENDER_OK 9004S published shell, mesh dimensions and closed solids verified')
