"""Finalize measured, editable exterior studies. No website image output.

9004S: published exterior shell, optional undocumented details omitted.
LC04: case envelope only, 96 mm overall depth less the published 3 mm plate;
173 mm height. 15 mm cross-door closure is NEUTRAL, NOT published geometry.
The 300 x 25 drawing is the strike, NOT the lock faceplate; do not transplant it.
70SN: two upper cylindrical housing envelopes only, diameter17, lengths30/30,
10 mm central gap. No invented lower profile, cam, thumbturn, bore or keys.
These are partial exterior studies, never manufacturing-ready product models.
"""
import bpy, bmesh, json, hashlib, math, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
OUT=Path(sys.argv[sys.argv.index('--')+1]).resolve()
OUT.mkdir(parents=True,exist_ok=True)
MM=.001
reports=[]

def source(name):
    file=ROOT/'public/images/products'/name
    return {'path':str(file.relative_to(ROOT)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}

def new():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system='METRIC'
    bpy.context.scene.unit_settings.length_unit='MILLIMETERS'

def box(name,dimensions,location):
    bpy.ops.mesh.primitive_cube_add(size=1,location=tuple(v*MM for v in location))
    ob=bpy.context.object;ob.name=name;ob.scale=tuple(v*MM for v in dimensions)
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return ob

def save(slug,evidence,expected):
    scene=bpy.context.scene
    scene.unit_settings.system='METRIC';scene.unit_settings.length_unit='MILLIMETERS'
    meshes=[ob for ob in scene.objects if ob.type=='MESH']
    assert len(meshes)==len(expected)
    checks=[]
    bpy.context.view_layer.update()
    for ob,dimensions in zip(meshes,expected):
        actual=[v/MM for v in ob.dimensions]
        assert all(abs(a-b)<.0001 for a,b in zip(actual,dimensions)),(ob.name,actual,dimensions)
        bm=bmesh.new();bm.from_mesh(ob.data)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
        assert all(e.is_manifold for e in bm.edges),ob.name
        assert bm.calc_volume(signed=True)>0,ob.name
        bm.to_mesh(ob.data);bm.free()
        ob['manufacturing_ready']=False
        ob['scope']=evidence['scope']
        checks.append({'object':ob.name,'dimensions_mm':actual,'closedMesh':True,'positiveVolume':True})
    evidence['meshChecks']=checks
    evidence['manufacturingReady']=False
    for s in evidence['sources']:
        im=bpy.data.images.load(str(ROOT/s['path']),check_existing=True);im.pack()
    bpy.data.texts.new('READ ME - SCOPE AND EVIDENCE').write(json.dumps(evidence,ensure_ascii=False,indent=2))
    # An editable, neutral viewport. No invented edge rounding or fitted assembly.
    for ob in meshes: ob.select_set(True)
    bpy.context.view_layer.objects.active=meshes[0]
    corners=[ob.matrix_world@Vector(c) for ob in meshes for c in ob.bound_box]
    centre=sum(corners,Vector())/len(corners)
    extent=max(max(v[i] for v in corners)-min(v[i] for v in corners) for i in range(3))
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type=='VIEW_3D':
                area.spaces.active.region_3d.view_location=centre
                area.spaces.active.region_3d.view_distance=extent*2.5
                area.spaces.active.region_3d.view_perspective='ORTHO'
                if evidence.get('neutralClosure_mm'):
                    area.spaces.active.region_3d.view_rotation=Vector((0,-1,0)).to_track_quat('Z','Y')
    # Orthographic projections are generated from the actual vertices, not labels.
    views=[]
    for axisA,axisB,label in [(0,1,'XY'),(0,2,'XZ'),(1,2,'YZ')]:
        # A neutral closure dimension must never appear as a published dimension
        # on a drawing or be featured in the opening viewport.
        if evidence.get('neutralClosure_mm') and (axisA,axisB)!=(0,2):
            continue
        pts=[(v[axisA]/MM,v[axisB]/MM) for v in corners]
        lo=[min(p[i] for p in pts) for i in range(2)];hi=[max(p[i] for p in pts) for i in range(2)]
        scale=min(330/max(1,hi[0]-lo[0]),280/max(1,hi[1]-lo[1]))
        lines=[]
        for ob in meshes:
            for e in ob.data.edges:
                v,w=[ob.matrix_world@ob.data.vertices[i].co for i in e.vertices]
                x1=40+(v[axisA]/MM-lo[0])*scale;y1=340-(v[axisB]/MM-lo[1])*scale
                x2=40+(w[axisA]/MM-lo[0])*scale;y2=340-(w[axisB]/MM-lo[1])*scale
                lines.append(f'<path d="M{x1:.3f},{y1:.3f}L{x2:.3f},{y2:.3f}"/>')
        views.append(f'<g transform="translate({len(views)*400},70)"><text x="40" y="20">{label} / {hi[0]-lo[0]:g} x {hi[1]-lo[1]:g} mm</text><g fill="none" stroke="#333" stroke-width="1">'+''.join(lines)+'</g></g>')
    (OUT/(slug+'-orthographic.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480"><rect width="1200" height="480" fill="white"/><g font-family="Arial" font-size="15" fill="#222"><text x="40" y="32">'+slug+' / PARTIAL EXTERIOR STUDY - NOT MANUFACTURING CAD</text>'+''.join(views)+'</g></svg>',encoding='utf8')
    (OUT/(slug+'-evidence.json')).write_text(json.dumps(evidence,ensure_ascii=False,indent=2),encoding='utf8')
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/(slug+'.blend')))
    bpy.ops.export_scene.gltf(filepath=str(OUT/(slug+'.glb')),export_format='GLB',use_selection=True)
    # Reopen the deliverable and verify that saved geometry and reference data survive.
    bpy.ops.wm.open_mainfile(filepath=str(OUT/(slug+'.blend')))
    assert all(im.packed_file for im in bpy.data.images if im.type=='IMAGE')
    assert len([o for o in bpy.context.scene.objects if o.type=='MESH'])==len(expected)
    reports.append({'slug':slug,'status':evidence['scope'],'reopened':True,'meshChecks':checks})

old=ROOT/'docs/design-references/2026-09-07-home-stills/models-9004s/9004s-published-shell.blend'
bpy.ops.wm.open_mainfile(filepath=str(old))
for ob in list(bpy.data.objects):
    if ob.type!='MESH' or ob.name.startswith('SET /'):
        bpy.data.objects.remove(ob,do_unlink=True)
# Sort explicit objects into the scene's iteration order for independent dimension checks.
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
expected=[(53,53,8) if o.name.startswith('Rose') else (135,20,55) for o in meshes]
save('9004s-exterior',{'scope':'9004S published exterior shell only','sources':[source('9004s-stainless-steel-handle-6.webp')],
 'published_mm':{'leverLength':135,'leverHeight':20,'frontBarDepth':10,'neckWidth':20,'totalProjection':63,'rose':[53,53,8]},
 'omitted':['edge radii','rose trim and internal parts','set screw and mounting holes','spindle length','escutcheon']},expected)

new();box('LC04 CASE ENVELOPE - neutral thickness 15 mm',(93,15,173),(49.5,0,-86.5))
save('lc04-case-envelope',{'scope':'LC04 case bounding envelope only; NOT the finished lock body','sources':[source('lc04-85-60-lock-case-3.webp')],
 'published_mm':{'totalDepthFromPlateFront':96,'plateThickness':3,'caseHeight':173},'derived_mm':{'caseDepth':93},
 'neutralClosure_mm':{'caseThickness':15},
 'omitted':['lock faceplate (strike dimensions do not establish its size)','bolt and latch geometry','bores and fixing holes','edge chamfers','internal mechanism'],
 'datum':'X=0 is the published plate front; case starts at X=3. No faceplate assembly is modeled.'},[(93,15,173)])

new()
for label,z in [('A',15),('B',55)]:
    bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=8.5*MM,depth=30*MM,location=(0,0,z*MM))
    bpy.context.object.name='70SN UPPER HOUSING ENVELOPE '+label
save('70sn-upper-housing-envelopes',{'scope':'70SN upper cylindrical envelope segments only; NOT the complete cylinder','sources':[source('70sn-lock-cylinder-2.webp')],
 'published_mm':{'upperDiameter':17,'segments':[30,10,30],'overallLength':70},
 'omitted':['lower euro profile (no fully dimensioned contour)','cam','thumbturn','plug and keyway','fixing thread and bores','keys']},[(17,17,30),(17,17,30)])
(OUT/'verification.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'README.txt').write_text('3份有尺寸来源的局部实体研究；不是3份完整产品CAD。\n9004S：外形壳体。LC04：锁体尺寸包络，厚度15mm为中性闭合值。70SN：上部圆柱壳体包络，不含下部欧规轮廓、凸轮和旋钮。\n每份包含可编辑.blend、通用.glb、从真实网格导出的三视图、来源和尺寸检查。\n所有孔位、曲线与机构缺少完整尺寸的部分均未猜测。未上架网站。\n',encoding='utf8')
print('DIMENSION_MODELS_VERIFIED',len(reports))
