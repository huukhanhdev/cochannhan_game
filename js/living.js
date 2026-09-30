// Tranh sống: chân dung tĩnh được chia lưới rồi uốn theo thời gian (thở, gió, ngả người),
// cộng thêm "xương" cho từng bộ phận (đầu, tay, hàm, tai, chân, đuôi) theo nguyên lý Live2D.
// Tọa độ trong RIGS là tỉ lệ 0..1 trên tranh gốc 568×760. Tranh chưa có RIGS vẫn thở và lay theo gió.
// Chỉ dùng PIXI bên trong hàm, nên file này nạp được cả khi chưa có PIXI (script tự chơi).

const RIGS={
  p_hero:{kind:'human',hand:[.565,.6],
    bones:[
      {n:'head',pivot:[.49,.268],caps:[[.49,.215,.475,.12,.062,.05]]},
      {n:'hair',parent:'head',pivot:[.43,.21],caps:[[.405,.27,.34,.47,.035,.05],[.44,.2,.41,.27,.02,.03]]},
      {n:'arm',pivot:[.605,.315],caps:[[.61,.33,.605,.47,.042,.04]]},
      {n:'fore',parent:'arm',pivot:[.603,.47],caps:[[.6,.48,.565,.605,.036,.03]]},
    ],
    // mí mắt: [dải da nguồn], [vùng che mắt]
    lids:[[[.462,.2022,.03,.0048],[.462,.2045,.03,.0105]],[[.518,.201,.03,.0048],[.518,.2033,.03,.0105]]],
    eyes:[[.477,.21,0x8fd0ff,.11],[.532,.209,0x8fd0ff,.11],[.53,.388,0xffd98a,.9,'core']]},
  p_wolf:{kind:'beast',mouth:[.225,.53],
    bones:[
      {n:'head',pivot:[.33,.47],caps:[[.22,.47,.22,.38,.095,.06]]},
      {n:'earL',parent:'head',pivot:[.145,.37],caps:[[.14,.36,.11,.31,.022,.02]]},
      {n:'earR',parent:'head',pivot:[.285,.37],caps:[[.29,.36,.315,.31,.022,.02]]},
      {n:'jaw',parent:'head',pivot:[.225,.522],caps:[[.195,.545,.255,.545,.017,.018]]},
      {n:'legFL',pivot:[.27,.575],caps:[[.265,.6,.155,.79,.034,.03]]},
      {n:'legFR',pivot:[.39,.575],caps:[[.375,.6,.255,.84,.034,.03]]},
      {n:'legBL',pivot:[.57,.555],caps:[[.56,.58,.495,.72,.03,.03]]},
      {n:'legBR',pivot:[.77,.575],caps:[[.775,.6,.84,.765,.03,.03]]},
      {n:'tail',pivot:[.82,.5],caps:[[.85,.52,.975,.69,.04,.05]]},
    ],
    lids:[[[.15,.434,.05,.008],[.15,.446,.05,.02]],[[.24,.434,.05,.008],[.24,.446,.05,.02]]],lidTint:0x3a3f46,
    eyes:[[.175,.457,0x7fb4ff,.32,'beast'],[.265,.457,0x7fb4ff,.32,'beast']]},
  // Trùm (lộ trình giai đoạn 4). Không có mí mắt: chỉ đầu, hàm, chi và mắt phát sáng.
  p_wolfking:{kind:'beast',mouth:[.26,.29],
    bones:[
      {n:'head',pivot:[.40,.34],caps:[[.28,.27,.42,.30,.07,.05]]},
      {n:'jaw',parent:'head',pivot:[.30,.30],caps:[[.265,.315,.31,.325,.018,.018]]},
      {n:'legFL',pivot:[.37,.60],caps:[[.36,.63,.33,.82,.035,.03]]},
      {n:'legFR',pivot:[.48,.63],caps:[[.47,.66,.43,.84,.035,.03]]},
      {n:'legBL',pivot:[.76,.66],caps:[[.77,.68,.83,.90,.035,.03]]},
      {n:'tail',pivot:[.88,.62],caps:[[.89,.60,.96,.49,.035,.045]]},
    ],
    eyes:[[.31,.265,0xbfe0ff,.34,'beast']]},
  p_bear:{kind:'beast',mouth:[.35,.16],
    bones:[
      {n:'head',pivot:[.42,.22],caps:[[.33,.12,.45,.16,.075,.05]]},
      {n:'earR',parent:'head',pivot:[.52,.14],caps:[[.53,.13,.54,.11,.02,.02]]},
      {n:'jaw',parent:'head',pivot:[.39,.17],caps:[[.34,.18,.39,.19,.02,.02]]},
      {n:'legFL',pivot:[.32,.34],caps:[[.30,.36,.18,.37,.04,.035]]},
      {n:'legFR',pivot:[.56,.33],caps:[[.55,.34,.47,.38,.04,.035]]},
      {n:'legBL',pivot:[.40,.72],caps:[[.39,.74,.35,.92,.045,.03]]},
      {n:'legBR',pivot:[.71,.72],caps:[[.72,.74,.79,.92,.045,.03]]},
    ],
    eyes:[[.38,.112,0xffb070,.3,'beast']]},
  p_bai:{kind:'human',
    bones:[
      {n:'head',pivot:[.39,.33],caps:[[.37,.24,.40,.12,.075,.05]]},
      {n:'hair',parent:'head',pivot:[.50,.20],caps:[[.55,.35,.80,.55,.05,.06]]},
    ],
    eyes:[[.312,.241,0xbfe8ff,.08],[.375,.237,0xbfe8ff,.08]]},
  p_bai_female:{kind:'human',
    bones:[
      {n:'head',pivot:[.50,.30],caps:[[.50,.24,.50,.12,.075,.05]]},
      {n:'hair',parent:'head',pivot:[.50,.20],caps:[[.50,.35,.75,.55,.05,.06]]},
    ],
    eyes:[[.42,.241,0xbfe8ff,.08],[.58,.237,0xbfe8ff,.08]]},
  p_gialao:{kind:'human',
    bones:[{n:'head',pivot:[.51,.29],caps:[[.51,.21,.51,.06,.09,.05]]}],
    eyes:[[.475,.197,0xffe0a0,.08],[.55,.197,0xffe0a0,.08]]},
  p_madutam:{kind:'human',
    bones:[{n:'head',pivot:[.51,.30],caps:[[.47,.20,.46,.12,.07,.05]]}],
    eyes:[[.444,.19,0xff6a50,.09],[.528,.184,0xff6a50,.09]]},
};
// Tranh chưa gắn xương: chỉ chọn kiểu uốn (người hay thú)
const LIVING_KIND={p_boar:'beast',p_jar:'beast',p_blood:'human'};

const LIV={
  smooth:x=>x<=0?1:x>=1?0:1-x*x*(3-2*x),
  capW(px,py,c,w,h){const ax=c[0]*w,ay=c[1]*h,bx=c[2]*w,by=c[3]*h,vx=bx-ax,vy=by-ay;
    const t=Math.max(0,Math.min(1,((px-ax)*vx+(py-ay)*vy)/(vx*vx+vy*vy||1)));const d=Math.hypot(px-(ax+vx*t),py-(ay+vy*t));
    const r=c[4]*w,f=c[5]*w;return d<r?1:LIV.smooth((d-r)/f)},
  boneW(b,x,y,w,h){let m=0;for(const c of b.caps)m=Math.max(m,LIV.capW(x,y,c,w,h));return m},
  // Uốn cả tranh: thở, gió, ngả người, co giãn. Kết quả theo tỉ lệ w,h
  human(u,v,k,t,a){
    const tt=t/1000+a.phase;let dx=0,dy=0;const br=Math.sin(tt*2.1)*a.breath;
    dy-=k*.008*br;const chest=Math.max(0,1-Math.abs(v-.4)/.18);dx+=(u-.5)*.018*br*chest;
    dx+=a.wind*.010*Math.sin(tt*1.5+v*4+u*2)*Math.pow(k,1.6);
    const edge=Math.pow(Math.abs(u-.5)*2,2),skirt=Math.max(0,(v-.45)/.55);
    dx+=a.wind*.028*edge*skirt*Math.sin(tt*2.6+v*7+(u>.5?1.2:0));dy+=a.wind*.006*edge*skirt*Math.sin(tt*3.1+u*5);
    dx+=a.lean*k*.20;dy+=Math.abs(a.lean)*k*k*.035;dy-=a.sq*k*.9;dx+=(u-.5)*-a.sq*.5;
    return [dx,dy]},
  beast(u,v,k,t,a){
    const tt=t/1000+a.phase;let dx=0,dy=0;const br=Math.sin(tt*2.8)*a.breath;
    const body=Math.max(0,1-Math.hypot(u-.55,v-.45)/.4);dy-=body*.010*br;dx+=(u-.55)*.012*br*body;
    const fur=Math.pow(k,2)*Math.max(0,1-Math.abs(u-.5)*1.4);
    dx+=.006*Math.sin(tt*9+u*20+v*9)*fur*a.wind;dy+=.005*Math.cos(tt*7+u*14)*fur*a.wind;
    dy+=a.crouch*k*.06;dx+=(u-.5)*a.crouch*.04;dx+=a.lean*k*.22;dy-=a.sq*k*.9;dx+=(u-.5)*-a.sq*.5;
    return [dx,dy]},
  // Cử động tự nhiên lúc chờ, cộng thêm vào tư thế đang diễn
  idle:{
    human:(a,t)=>{const s=t/1000+a.phase;return {head:.025*Math.sin(s*.9),hair:.06*Math.sin(s*1.4+.8)-a.lean*.4,arm:.03*Math.sin(s*1.1)}},
    beast:(a,t)=>{const s=t/1000+a.phase;return {head:.03*Math.sin(s*1.3),tail:.12*Math.sin(s*2.2),earL:a.twL,earR:a.twR}},
  },
};

function makeLiving(tex,name,scale){
  // Tọa độ xương chỉ đúng với tranh mặc định. Ảnh cá nhân (assets/local) thì chỉ thở và lay theo gió.
  const swapped=!!(window.LOCAL_ASSETS&&window.LOCAL_ASSETS['art/'+name+'.jpg']);
  const def=RIGS[name]&&!swapped?RIGS[name]:{kind:(RIGS[name]&&RIGS[name].kind)||LIVING_KIND[name]||'human',bones:[]};
  const w=tex.width,h=tex.height,cols=30,rows=40;
  const c=new PIXI.Container();
  const plane=new PIXI.SimplePlane(tex,cols,rows);plane.x=-w/2;plane.y=-h/2;plane.autoResize=false;
  // Lớp sáng cộng màu dùng chung lưới với tranh, nên lóe sáng khớp đúng hình đang uốn
  const add=new PIXI.Mesh(plane.geometry,new PIXI.MeshMaterial(tex));add.blendMode=PIXI.BLEND_MODES.ADD;add.alpha=0;add.x=plane.x;add.y=plane.y;
  const over=new PIXI.Container();over.x=plane.x;over.y=plane.y;
  c.addChild(plane,add,over);c.scale.set(scale);
  const buf=plane.geometry.getBuffer('aVertexPosition');const base=Float32Array.from(buf.data),nV=base.length/2;
  const bones=def.bones.map(b=>{const wt=new Float32Array(nV);for(let i=0;i<nV;i++)wt[i]=LIV.boneW(b,base[i*2],base[i*2+1],w,h);return Object.assign({},b,{wt,px:b.pivot[0]*w,py:b.pivot[1]*h})});
  const L={c,plane,add,over,def,w,h,kind:def.kind,act:{},ang:{},drop:{},lean:0,sq:0,crouch:0,wind:1,breath:1,phase:Math.random()*6,
    blink:0,nextBlink:1500,blinking:0,twL:0,twR:0,tw:0,twSide:'L',snarl:0,B:null};
  // mí mắt cắt từ chính tranh
  L.lids=(def.lids||[]).map(([src,dst])=>{const t=new PIXI.Texture(tex.baseTexture,new PIXI.Rectangle(src[0]*w,src[1]*h,src[2]*w,src[3]*h));
    const s=new PIXI.Sprite(t);s.anchor.set(.5,0);if(def.lidTint)s.tint=def.lidTint;const lash=new PIXI.Graphics();over.addChild(s,lash);return {s,lash,dst}});
  L.eyes=(def.eyes||[]).map(([u,v,col,sz,kind])=>{const s=new PIXI.Sprite(LIVING_DOT());s.anchor.set(.5);s.tint=col;s.blendMode=PIXI.BLEND_MODES.ADD;s.alpha=0;s.scale.set(sz);over.addChild(s);return {s,u,v,kind}});

  function poseBones(){const B={};for(const b of bones){let px=b.px,py=b.py,rot=0;if(b.parent){const p=B[b.parent];const co=Math.cos(p.rot),si=Math.sin(p.rot),dx=px-p.x,dy=py-p.y;px=p.x+dx*co-dy*si;py=p.y+dx*si+dy*co;rot=p.rot}
    B[b.n]={x:px,y:py,rot:rot+(L.ang[b.n]||0),own:L.ang[b.n]||0,dy:(L.drop[b.n]||0)*h}}return B}
  function applyBones(B,x,y,vi){
    for(const b of bones){const wv=vi>=0?b.wt[vi]:LIV.boneW(b,x,y,w,h);if(wv<=0)continue;const P=B[b.n];
      const an=P.own*wv;if(an){const co=Math.cos(an),si=Math.sin(an),dx=x-P.x,dy=y-P.y;x=P.x+dx*co-dy*si;y=P.y+dx*si+dy*co}
      if(P.dy)y+=P.dy*wv}
    return [x,y]}
  const deform=LIV[def.kind]||LIV.human;
  // Điểm (u,v) trên tranh sau khi uốn, theo tọa độ cục bộ của lưới
  L.point=(u,v,t)=>{const q=applyBones(L.B||poseBones(),u*w,v*h,-1);const o=deform(u,v,1-v,t,L);return [q[0]+o[0]*w,q[1]+o[1]*h]};
  // Điểm (u,v) theo tọa độ của vật chứa cha (để phóng chiêu từ bàn tay, cắn từ mõm)
  L.world=(u,v,t)=>{const p=L.point(u,v,t);return [c.x+(p[0]+plane.x)*c.scale.x,c.y+(p[1]+plane.y)*c.scale.y]};

  L.update=(t,dt)=>{
    // chớp mắt ngẫu nhiên
    if(t>L.nextBlink&&!L.blinking){L.blinking=t;L.nextBlink=t+2200+Math.random()*3200}
    let auto=0;if(L.blinking){const k=(t-L.blinking)/170;auto=k<.5?k*2:k<1?2-k*2:0;if(k>=1)L.blinking=0}
    L.blink=Math.max(auto,L.act.squint||0);
    if(def.kind==='beast'){if(Math.random()<dt/2500){L.twSide=Math.random()<.5?'L':'R';L.tw=1}L.tw=Math.max(0,L.tw-dt/180);
      const tv=Math.sin(L.tw*Math.PI)*.35;L.twL=L.twSide==='L'?-tv:0;L.twR=L.twSide==='R'?tv:0;L.snarl=.5+.5*Math.sin(t/700+L.phase)}
    const I=LIV.idle[def.kind](L,t);
    for(const b of bones)L.ang[b.n]=(I[b.n]||0)+(L.act[b.n]||0);
    if(def.mouth){L.drop.jaw=(L.act.jawOpen||0)*.014+L.snarl*.004;L.ang.jaw=(L.ang.jaw||0)+(L.act.jawOpen||0)*.18}
    const d=buf.data,B=poseBones();L.B=B;
    for(let i=0,vi=0;i<d.length;i+=2,vi++){
      const bx=base[i],by=base[i+1],u=bx/w,v=by/h;
      const q=bones.length?applyBones(B,bx,by,vi):[bx,by];const o=deform(u,v,1-v,t,L);
      d[i]=q[0]+o[0]*w;d[i+1]=q[1]+o[1]*h;
    }
    buf.update();
    for(const l of L.lids){const cx=l.dst[0]+l.dst[2]/2,p=L.point(cx,l.dst[1],t),rot=B.head?B.head.rot:0,hg=l.dst[3]*h*L.blink;
      l.s.visible=L.blink>.05;l.s.position.set(p[0],p[1]);l.s.rotation=rot;l.s.width=l.dst[2]*w;l.s.height=Math.max(.01,hg);
      l.lash.clear();if(L.blink>.05){const hw=l.dst[2]*w/2,co=Math.cos(rot),si=Math.sin(rot);
        const pts=[[-hw,hg*.8],[0,hg+1.5],[hw,hg*.8]].map(([x,y])=>[p[0]+x*co-y*si,p[1]+x*si+y*co]);
        l.lash.lineStyle(1.6,0x0b0b0b,.9);l.lash.moveTo(pts[0][0],pts[0][1]);l.lash.quadraticCurveTo(pts[1][0],pts[1][1],pts[2][0],pts[2][1])}}
    const glow=L.act.eyeGlow||0;
    L.eyes.forEach((e,i)=>{const p=L.point(e.u,e.v,t);e.s.position.set(p[0],p[1]);
      const baseA=e.kind==='beast'?.35+.2*Math.sin(t/260+i):e.kind==='core'?.35+.15*Math.sin(t/400):0;
      e.s.alpha=Math.max(0,(baseA+glow*(e.kind==='core'?.6:1))*(e.kind==='core'?1:1-L.blink))});
  };
  return L;
}
let _livDot=null;
function LIVING_DOT(){if(_livDot)return _livDot;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);return _livDot=PIXI.Texture.from(c)}
