import test from 'node:test';
import assert from 'node:assert/strict';
import {decodePackBitsRow, readPsdLayers,selectNativeProductLayer} from './kanee-psd-layer.mjs';
test('PackBits preserves literal and repeated samples exactly',()=>{
  assert.deepEqual([...decodePackBitsRow(Buffer.from([2,17,24,31,254,90,128]),6)],[17,24,31,90,90,90]);
});

function rawFixture(blend='norm') {
  const header=Buffer.alloc(26);header.write('8BPS');header.writeUInt16BE(1,4);header.writeUInt16BE(3,12);header.writeUInt32BE(2,14);header.writeUInt32BE(2,18);header.writeUInt16BE(8,22);header.writeUInt16BE(3,24);
  const record=Buffer.alloc(70);record.writeInt32BE(2,8);record.writeInt32BE(2,12);record.writeUInt16BE(4,16);
  [-1,0,1,2].forEach((id,i)=>{record.writeInt16BE(id,18+i*6);record.writeUInt32BE(6,20+i*6);});
  record.write('8BIM',42);record.write(blend,46);record[50]=255;record.writeUInt32BE(12,54);record[66]=1;record.write('p',67);
  const count=Buffer.from([0,1]);
  const channels=Buffer.concat([[255,0,255,255],[11,12,13,14],[21,22,23,24],[31,32,33,34]].map(a=>Buffer.from([0,0,...a])));
  const info=Buffer.concat([count,record,channels]);const infoLength=Buffer.alloc(4);infoLength.writeUInt32BE(info.length);
  const section=Buffer.concat([infoLength,info,Buffer.alloc(4)]);const sectionLength=Buffer.alloc(4);sectionLength.writeUInt32BE(section.length);
  return Buffer.concat([header,Buffer.alloc(8),sectionLength,section]);
}
test('extracts raw native layer RGB and original alpha without repainting',()=>{
  const layer=selectNativeProductLayer(rawFixture(),0);
  assert.deepEqual([...layer.rgba],[11,21,31,255,12,22,32,0,13,23,33,255,14,24,34,255]);
  assert.equal(layer.width,2);assert.equal(layer.height,2);
});
test('rejects layers whose blend cannot be independently reproduced',()=>{
  assert.throws(()=>selectNativeProductLayer(rawFixture('mul '),0),/refusing/);
});
test('PackBits refuses truncated, oversized and undersized rows',()=>{
  assert.throws(()=>decodePackBitsRow(Buffer.from([3,10]),4),/row/);
  assert.throws(()=>decodePackBitsRow(Buffer.from([254,10]),2),/row/);
  assert.throws(()=>decodePackBitsRow(Buffer.from([0,10]),2),/row/);
});
test('rejects unsupported or missing PSD header instead of guessing',()=>{
  assert.throws(()=>readPsdLayers(Buffer.alloc(26)),/PSD/);
  const b=Buffer.alloc(26);b.write('8BPS');b.writeUInt16BE(2,4);
  assert.throws(()=>readPsdLayers(b),/PSD/);
});
