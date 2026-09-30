import {inflateSync} from 'node:zlib';

// Narrow, lossless decoder for the client's native 8-bit RGB layers. No new dependency.
// Format: https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/
export function decodePackBitsRow(encoded, width) {
  const row=Buffer.alloc(width);let p=0,x=0;
  while(p<encoded.length){
    const n=encoded.readInt8(p++);if(n===-128)continue;
    const count=n>=0?n+1:1-n;
    if(x+count>width||p+(n>=0?count:1)>encoded.length)throw Error('Invalid PackBits row');
    if(n>=0){encoded.copy(row,x,p,p+count);p+=count;}else row.fill(encoded[p++],x,x+count);
    x+=count;
  }
  if(x!==width)throw Error('Incomplete PackBits row');return row;
}

export function readPsdLayers(b) {
  if(b.length<26||b.toString('ascii',0,4)!=='8BPS'||b.readUInt16BE(4)!==1||b.readUInt16BE(22)!==8||b.readUInt16BE(24)!==3)throw Error('Only PSD v1 8-bit RGB supported');
  let p=26;
  const check=(n)=>{if(n<0||p+n>b.length)throw Error('Truncated PSD');};
  const skipSection=()=>{check(4);const n=b.readUInt32BE(p);p+=4;check(n);p+=n;};
  skipSection();skipSection();check(8);p+=4;const length=b.readUInt32BE(p);p+=4;
  if(!length)throw Error('PSD has no native layers');check(length);
  const sectionEnd=p+length;const count=Math.abs(b.readInt16BE(p));p+=2;
  if(count>1000)throw Error('Too many PSD layers');const layers=[];
  for(let index=0;index<count;index++){
    check(18);const top=b.readInt32BE(p),left=b.readInt32BE(p+4),bottom=b.readInt32BE(p+8),right=b.readInt32BE(p+12);p+=16;
    const channelCount=b.readUInt16BE(p);p+=2;if(channelCount>64)throw Error('Unsupported PSD channels');
    const channels=[];
    for(let c=0;c<channelCount;c++){check(6);channels.push({id:b.readInt16BE(p),length:b.readUInt32BE(p+2)});p+=6;}
    check(16);const blend=b.toString('ascii',p+4,p+8),opacity=b[p+8],flags=b[p+10];p+=12;
    const extra=b.readUInt32BE(p);p+=4;check(extra);const end=p+extra;
    check(4);const maskLength=b.readUInt32BE(p);p+=4+maskLength;
    check(4);const ranges=b.readUInt32BE(p);p+=4+ranges;check(1);
    const nameLength=b[p];check(nameLength+1);let name=b.toString('utf8',p+1,p+1+nameLength);p+=Math.ceil((nameLength+1)/4)*4;
    let vectorMask=false;
    while(p+12<=end){
      const key=b.toString('ascii',p+4,p+8),size=b.readUInt32BE(p+8);p+=12;check(size);
      if(p+size>end)throw Error('Invalid PSD layer metadata');
      if(key==='luni'){const chars=b.readUInt32BE(p);if(chars*2+4>size)throw Error('Invalid PSD name');name='';for(let c=0;c<chars;c++)name+=String.fromCharCode(b.readUInt16BE(p+4+c*2));}
      if(key==='vmsk'||key==='vsms')vectorMask=true;
      p+=size+(size%2);
    }
    p=end;const width=right-left,height=bottom-top;
    if(width<0||height<0||width*height>80_000_000)throw Error('Invalid PSD layer bounds');
    layers.push({index,name,top,left,width,height,channels,blend,opacity,visible:!(flags&2),maskLength,vectorMask});
  }
  for(const layer of layers){
    const planes=new Map();
    for(const c of layer.channels){
      check(c.length);const start=p,end=p+c.length;p=end;
      if(!layer.width||!layer.height||c.id < -1||c.id>2)continue;
      if(c.length<2)throw Error('Missing PSD channel');const compression=b.readUInt16BE(start);let data;
      if(compression===0)data=b.subarray(start+2,end);
      else if(compression===2)data=inflateSync(b.subarray(start+2,end),{maxOutputLength:layer.width*layer.height});
      else if(compression===1){
        data=Buffer.alloc(layer.width*layer.height);let q=start+2+layer.height*2;
        if(q>end)throw Error('Missing PSD row lengths');
        for(let y=0;y<layer.height;y++){
          const size=b.readUInt16BE(start+2+y*2);if(q+size>end)throw Error('Truncated PSD row');
          decodePackBitsRow(b.subarray(q,q+size),layer.width).copy(data,y*layer.width);q+=size;
        }
      }else throw Error(`Unsupported PSD compression ${compression}`);
      if(data.length!==layer.width*layer.height)throw Error('PSD channel size mismatch');planes.set(c.id,data);
    }
    if(!layer.width||!layer.height||![0,1,2].every(c=>planes.has(c)))continue;
    layer.rgba=Buffer.alloc(layer.width*layer.height*4);
    for(let i=0;i<layer.width*layer.height;i++){
      for(let c=0;c<3;c++)layer.rgba[i*4+c]=planes.get(c)[i];
      layer.rgba[i*4+3]=planes.has(-1)?planes.get(-1)[i]:255;
    }
    layer.hasAlpha=planes.has(-1);
  }
  if(p>sectionEnd)throw Error('PSD layers exceed their section');return layers;
}

export function selectNativeProductLayer(buffer,index) {
  const layer=readPsdLayers(buffer)[index];
  if(!layer?.rgba||!layer.hasAlpha||layer.maskLength||layer.vectorMask||layer.blend!=='norm'||layer.opacity!==255||!layer.visible)throw Error('Native layer needs unsupported masking or adjustment; refusing to guess');
  return layer;
}
