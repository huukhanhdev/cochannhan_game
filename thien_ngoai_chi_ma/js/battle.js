// Đấu trường PixiJS (WebGL) cho Thiên Ngoại Chi Ma - Cổ Giới Dị Hồn
// Bối cảnh nhiều lớp, chân dung nhân vật thủy mặc, hạt hiệu ứng, hit-stop, rung màn hình.
const FX={queue:[],toastMsg:null,busy:false,q(e){this.queue.push(e)}};
const RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);

const ART={
  heorung:{g:'猪',sc:'forest',c:'#d2ab82'},
  dienlang:{g:'狼',sc:'forest',c:'#70a1ff'},
  hachung:{g:'熊',sc:'forest',c:'#b3a695'},
  tanbinh:{g:'魔',sc:'forest',c:'#b890d6'},
  hoctro:{g:'徒',sc:'village',c:'#ddd6c0'},
  macbac:{g:'莫',sc:'village',c:'#ddd6c0'},
  baitrinhsat:{g:'白',sc:'forest',c:'#e3edf1'},
  loiquan:{g:'雷',sc:'tide',c:'#54a0ff'},
  langvuong:{g:'王',sc:'tide',c:'#d7ebff'},
  tuukhoi:{g:'酒',sc:'wine',c:'#e6bf70'},
  huyetkhoi:{g:'血',sc:'blood',c:'#e8664f'},
  phuongnguyen_boss:{g:'源',sc:'village',c:'#c0392b'},
  bai_boss:{g:'冰',sc:'snow',c:'#70a1ff'},
};

const SCENE_NAME={
  forest:'Rừng trúc Thanh Mao',
  village:'Cổ Nguyệt sơn trại',
  tide:'Tường trại · Lang triều',
  wine:'Bí cảnh Hoa Tửu',
  blood:'Huyết động cổ xưa',
  snow:'Tuyết phủ Bạch gia',
  fire:'Thanh Mao Sơn rực lửa'
};

const SKILL_GLYPH={
  strike:'拳',
  kiemquang:'剑',
  kimcham:'针',
  toannhan:'刃',
  kimthieng:'光',
  truluc:'猪',
  hungluc:'熊',
  thietcot:'骨',
  nguuluc:'牛',
  dienlang:'雷',
  tatphong:'风',
  loidinh:'钉',
  hanbang:'冰',
  banggiap:'甲',
  tuutrung:'酒',
  trilieu:'愈',
  ngocbi:'玉',
  flee:'走',
  kiem_bao:'风',
  hung_thiet:'裂',
  loi_cham:'穿',
  bang_phong:'锁'
};

const INTENT_SEAL={atk:'攻',heavy:'猛',guard:'守'};
const BRUSH='"Ma Shan Zheng", "STKaiti", "KaiTi", "Kaiti SC", serif';
const DISPLAY='"Cormorant Garamond", Georgia, serif';

const ART_DIR='assets/art/';
const PORTRAIT={
  heorung:'p_boar',
  dienlang:'p_wolf',
  hachung:'p_bear',
  tanbinh:'p_cultivator',
  hoctro:'p_cultivator',
  macbac:'p_cultivator',
  baitrinhsat:'p_cultivator',
  loiquan:'p_wolf_thunder',
  langvuong:'p_wolfking',
  tuukhoi:'p_jar',
  huyetkhoi:'p_blood',
  phuongnguyen_boss:'p_hero_fy',
  bai_boss:'p_bai_alt'
};

const PTINT={
  phuongnguyen_boss:0xff7675,
  bai_boss:0xc6e8f6,
  loiquan:0xcfe2ff,
  langvuong:0xdde6ee,
  tanbinh:0xd2b4de
};

const BGIMG={
  forest:'bg_forest',
  village:'bg_village',
  tide:'bg_tide',
  wine:'bg_wine',
  blood:'bg_blood',
  snow:'bg_snow',
  fire:'bg_fire'
};

const EV_SCENE={
  tn_khaikhieu:'village',
  tn_phuongnguyen_gate:'village',
  tn_hoatuu_secret:'wine',
  tn_thuongdoi_jks:'forest',
  tn_dieutra:'village',
  tn_bai_encounter:'snow',
  tn_langtrieu_start:'tide',
  tn_lang_king:'tide',
  tn_huyetdong:'blood',
  tn_final_escape:'fire'
};

function eventArt(id){
  const sc=EV_SCENE[id]||'forest';
  return ART_DIR+(BGIMG[sc]||'bg_forest')+'.jpg';
}

const GU_IMG_MAP={
  tuutrung:'assets/gu/g_tuutrung.jpg',
  trilieu:'assets/gu/g_trilieu.jpg',
  ngocbi:'assets/gu/g_ngocbi.jpg',
  thietcot:'assets/gu/g_thietbi.jpg',
  truluc:'assets/gu/g_bachthi.jpg',
  hungluc:'assets/gu/g_hacthi.jpg',
  hanbang:'assets/gu/g_bachngoc.jpg',
  banggiap:'assets/gu/g_bachngoc.jpg',
  kiemquang:'assets/gu/g_nguyetquang.jpg',
  kimcham:'assets/gu/g_nguyetquang.jpg',
  toannhan:'assets/gu/g_nguyetquang.jpg',
  kimthieng:'assets/gu/g_nguyetquang.jpg',
  dienlang:'assets/gu/g_huyetnguyet.jpg',
  loidinh:'assets/gu/g_huyetnguyet.jpg',
  dihon:'assets/gu/g_xuanthu.jpg'
};

function guImgUrl(k){
  return GU_IMG_MAP[k]||'';
}

function combatId(c){return String(c.id||c.n||c.k||'combat')}

function renderCombat(st){
  const c=S.combat;
  if(!c) return;
  const artKey=c.k||(c.boss?'phuongnguyen_boss':'dienlang');
  const art=Object.assign({k:artKey},ART[artKey]||{g:'敌',sc:'forest',c:'#ddd6c0'});
  
  let arena=$('arena');
  if(!arena||arena.dataset.cid!==combatId(c)){
    st.innerHTML=`
      <div class="arena" id="arena" data-cid="${esc(combatId(c))}" style="--foe:${art.c}">
        <div class="scene-name">${SCENE_NAME[art.sc]||'Thanh Mao Sơn'}</div>
        <div class="seal" id="eIntent"></div>
        ${window.PIXI?'':`<div class="nofx"><span class="gl v">${esc(S.name.slice(0,2))}</span><span class="gl foe">${art.g}</span></div>`}
        <div class="plate p" id="pPlate"></div>
        <div class="plate e" id="ePlate"></div>
      </div>
      <div class="skillbar" id="skillbar"></div>`;
    arena=$('arena');
    Arena.mount(arena,art);
  }
  updateCombat();
  playFX();
}

function updateCombat(){
  const c=S.combat,e=ESS[S.chuyen]||{n:'thanh đồng',c:'#5fae8a'};
  const pc=[];
  if(c.shield>0) pc.push(`<span class="chip shield">Giáp hộ thể (${c.shield} lượt)</span>`);
  if(c.reflect>0) pc.push(`<span class="chip shield">Phản đòn ${Math.round(c.reflect*100)}%</span>`);

  $('pPlate').innerHTML=`<b>${esc(S.name)}</b><span class="rk">${rankName()}</span>
    <div class="mbar hp"><i style="width:${clamp(S.hp/maxHp()*100,0,100)}%"></i><em>${Math.max(0,S.hp)} / ${maxHp()}</em></div>
    <div class="mbar es" style="--c:${e.c}"><i style="width:${clamp(S.ess/maxEss()*100,0,100)}%"></i><em>${Math.floor(S.ess)} / ${maxEss()} chân nguyên</em></div>
    ${pc.length?`<div class="chips">${pc.join('')}</div>`:''}`;

  const st=[];
  if(c.stun>0) st.push(`<span class="chip stun">Choáng (${c.stun})</span>`);
  if(c.shield>0) st.push(`<span class="chip shield">Hộ giáp</span>`);

  $('ePlate').innerHTML=`<b>${esc(c.n)}</b><span class="rk">Đòn ${c.atk[0]}–${c.atk[1]}</span>
    <div class="mbar en"><i style="width:${clamp(c.hp/c.max*100,0,100)}%"></i><em>${Math.max(0,c.hp)} / ${c.max}</em></div>
    ${st.length?`<div class="chips">${st.join('')}</div>`:''}`;

  const stun=c.stun>0,it=stun?'guard':(c.intent||'atk');
  $('eIntent').className=`seal ${it==='heavy'?'heavy':it}`;
  $('eIntent').innerHTML=`<span>${stun?'晕':it==='heavy'?'猛':INTENT_SEAL[it]||'攻'}</span><small>${stun?'Đang choáng, không ra đòn':it==='heavy'?'Sát chiêu hung mãnh':it==='guard'?'Thủ thế phòng ngự':'Tấn công thường'}</small>`;
  
  Arena.sync({ess:e.c,shield:c.shield>0,intent:stun?'stun':it});

  // Kỹ năng
  const sk=[{attr:'data-f="strike"',g:SKILL_GLYPH.strike,n:'Thể Phách Quyền',s:`${baseAtk()} sát thương cận chiến`,cls:''}];
  
  (S.gu||[]).forEach((g,i)=>{
    const d=GU[g.k];
    if(!['attack','guard','heal'].includes(d.t)) return;
    const cost=d.cost||0;
    const img=guImgUrl(g.k);
    const dis=S.ess<cost;
    const desc=d.t==='attack'?`${Math.round(d.dmg*(1+.3*(S.chuyen-1))+passAtk())} sát thương${d.pierce?' · xuyên giáp':''}`
              :d.t==='guard'?'Giảm 60% sát thương 2 lượt'
              :`Hồi ${30+15*S.chuyen} khí huyết`;
    sk.push({
      attr:`data-f="gu" data-k="${i}"`,
      g:SKILL_GLYPH[g.k]||'蛊',
      img,
      n:d.n,
      cost,
      dis,
      s:desc,
      cls:d.t==='attack'?'atk':d.t==='guard'?'grd':'heal'
    });
  });

  COMBOS.forEach(cb=>{
    const hasAll=cb.req.every(k=>hasGu(k));
    if(!hasAll) return;
    const cost=cb.cost||16;
    sk.push({
      attr:`data-combo="${cb.id}"`,
      g:SKILL_GLYPH[cb.id]||'招',
      n:cb.n,
      cost,
      dis:S.ess<cost,
      s:cb.d,
      cls:'combo'
    });
  });

  sk.push({attr:'data-f="absorb"',g:'石',n:'Hấp Thu Nguyên Thạch',s:`5 thạch → +20 chân nguyên (còn ${S.stones})`,dis:S.stones<5||S.ess>=maxEss(),cls:''});
  sk.push({attr:'data-f="flee"',g:SKILL_GLYPH.flee,n:'Tẩu Thoát',s:'Thân nhẹ như gió lẩn tránh',cls:'run'});

  $('skillbar').innerHTML=sk.map((x,n)=>`<button class="skill ${x.cls}" ${x.attr} ${x.dis||FX.busy?'disabled':''}>
    <span class="sg${x.img?' has-img':''}"${x.img?` style="background-image:url('${x.img}')"`:''}>${x.img?'':x.g}</span>
    <span class="st"><b>${esc(x.n)}</b><small>${esc(x.s)}</small></span>
    ${x.cost?`<span class="sc">${x.cost}</span>`:''}
    ${n<9?`<kbd>${n+1}</kbd>`:''}</button>`).join('');
}

function setBusy(b){
  FX.busy=b;
  document.querySelectorAll('#skillbar .skill').forEach(el=>{
    if(b){el.dataset.lock=el.disabled?'1':'0';el.disabled=true;}
    else if(el.dataset.lock==='0') el.disabled=false;
  });
}

function playFX(){
  const q=FX.queue.splice(0);
  if(!q.length) return;
  let t=0;
  q.forEach(e=>{
    setTimeout(()=>Arena.play(e),t);
    t+=RM?60:({patk:420,combo:600,eatk:420,ko:0,pdie:0}[e.type]??200);
  });
  if(q.some(e=>e.type==='ko'||e.type==='pdie')) return;
  setBusy(true);
  setTimeout(()=>setBusy(false),t+120);
}

/* ================= PixiJS Arena Canvas ================= */
const SC={
  forest:{bg:['#0a1512','#17291f'],ink:0x040907,far:0x13241d,near:0x0a1511,part:'firefly',pc:0xc6ec8c,moon:1},
  village:{bg:['#12101a','#261c16'],ink:0x060509,far:0x1d1820,near:0x0e0b0e,part:'ember',pc:0xf2ac5c,moon:1},
  tide:{bg:['#090e14','#18222e'],ink:0x030507,far:0x141c26,near:0x080b10,part:'rain',pc:0xaac8e6},
  wine:{bg:['#15110a','#2a2010'],ink:0x070503,far:0x221a0e,near:0x100c06,part:'mote',pc:0xf2c86e},
  blood:{bg:['#190808','#321010'],ink:0x070101,far:0x2a0c0c,near:0x120404,part:'ember',pc:0xee543e},
  snow:{bg:['#0d141a','#1f2e3b'],ink:0x04070a,far:0x1a2733,near:0x0c131a,part:'snow',pc:0xf0f7ff,moon:1},
  fire:{bg:['#160a06','#381709'],ink:0x050201,far:0x2a1209,near:0x120603,part:'ember',pc:0xff8a3a},
};

const Arena=(function(){
  let TX={},app=null,host=null,root,L={},W=0,H=0,tw=[],parts=[],wx=[],sc,art,P=null,E=null,T=0,shake=0,stop_=0,pend=[],state={},ready=false,nextBolt=0,tex={};
  const col=h=>parseInt(String(h).replace('#',''),16);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const ease={out:p=>1-Math.pow(1-p,3),in:p=>p*p*p,back:p=>{const c=1.7;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2)},lin:p=>p};
  function tween(dur,upd,done,e){tw.push({t:0,dur:RM?Math.min(dur,120):dur,upd,done,e:e||ease.out})}
  function seeded(s){return ()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

  function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return PIXI.Texture.from(c)}
  function makeTextures(){
    if(tex.soft) return;
    tex.soft=canvasTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
    tex.dot=canvasTex(16,16,x=>{x.fillStyle='#fff';x.beginPath();x.arc(8,8,7,0,7);x.fill()});
    tex.vig=canvasTex(256,256,x=>{const g=x.createRadialGradient(128,128,60,128,128,182);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.75)');x.fillStyle=g;x.fillRect(0,0,256,256)});
    tex.streak=canvasTex(4,32,x=>{const g=x.createLinearGradient(0,0,0,32);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.9)');x.fillStyle=g;x.fillRect(1,0,2,32)});
    tex.beam=canvasTex(256,24,x=>{const g=x.createLinearGradient(0,0,0,24);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,256,24)});
    tex.crescent=canvasTex(96,96,x=>{x.fillStyle='#fff';x.shadowColor='#fff';x.shadowBlur=10;x.beginPath();x.arc(40,48,34,-1.3,1.3);x.arc(28,48,30,1.15,-1.15,true);x.closePath();x.fill()});
    tex.claw=canvasTex(160,12,x=>{const g=x.createLinearGradient(0,0,160,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.3,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,6);x.quadraticCurveTo(80,-2,160,6);x.quadraticCurveTo(80,8,0,6);x.fill()});
  }

  const IMG={};
  function loadTex(name,mask){
    const key=name+(mask?'@m':'');
    if(IMG[key]) return IMG[key];
    return IMG[key]=new Promise(res=>{
      const im=new Image();
      im.onload=()=>{
        if(!mask){res(PIXI.Texture.from(im));return}
        const c=document.createElement('canvas'),w=im.naturalWidth,h=im.naturalHeight;c.width=w;c.height=h;
        const x=c.getContext('2d');x.drawImage(im,0,0);
        x.globalCompositeOperation='destination-in';
        x.save();x.translate(w/2,h*.47);x.scale(1,h/w*.92);
        const g=x.createRadialGradient(0,0,w*.18,0,0,w*.52);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.7,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,0)');
        x.fillStyle=g;x.fillRect(-w,-h,w*2,h*2);x.restore();
        res(PIXI.Texture.from(c));
      };
      im.onerror=()=>res(null);
      im.src=ART_DIR+name+'.jpg';
    });
  }

  function gradSprite(c0,c1){return new PIXI.Sprite(canvasTex(4,256,(x)=>{const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.fillRect(0,0,4,256)}))}

  async function mount(el,a){
    host=el;art=a;sc=SC[a.sc]||SC.forest;ready=false;pend=[];
    if(!window.PIXI) return;
    if(!app){
      app=new PIXI.Application({backgroundAlpha:0,antialias:true,resolution:Math.min(2,window.devicePixelRatio||1),autoDensity:true,resizeTo:el});
      app.ticker.add(tick);
    }else app.resizeTo=el;
    app.view.className='pixi';
    el.prepend(app.view);
    app.start();
    makeTextures();
    const want=[loadTex('p_alien',true),loadTex(PORTRAIT[art.k]||'p_cultivator',true),loadTex(BGIMG[art.sc]||'bg_forest',false)];
    const [hero,foe,bg]=await Promise.race([Promise.all(want),new Promise(r=>setTimeout(()=>r([null,null,null]),5000))]);
    TX={hero,foe,bg};
    if(host!==el||!el.isConnected) return;
    build();ready=true;
    pend.splice(0).forEach(play);
  }

  function build(){
    app.stage.removeChildren().forEach(c=>c.destroy({children:true}));
    tw=[];parts=[];wx=[];L={};
    W=app.screen.width;H=app.screen.height;
    root=new PIXI.Container();app.stage.addChild(root);
    const bg=gradSprite(sc.bg[0],sc.bg[1]);bg.x=bg.y=-30;bg.width=W+60;bg.height=H+60;root.addChild(bg);
    L.sky=new PIXI.Container();L.far=new PIXI.Container();L.near=new PIXI.Container();L.wx=new PIXI.Container();
    L.fig=new PIXI.Container();L.fx=new PIXI.Container();L.ui=new PIXI.Container();L.top=new PIXI.Container();
    root.addChild(L.sky,L.far,L.near,L.wx,L.fig,L.fx,L.ui);app.stage.addChild(L.top);

    if(TX.bg){
      const b=new PIXI.Sprite(TX.bg);b.anchor.set(.5);const k=Math.max(W/TX.bg.width,H/TX.bg.height)*1.08;
      b.scale.set(k);b.position.set(W/2,H/2);L.sky.addChild(b);L.bgimg=b;L.bgk=k;
      const dim=new PIXI.Graphics();dim.beginFill(0x000000,.28);dim.drawRect(0,0,W,H);dim.endFill();L.sky.addChild(dim);
    }

    const ground=new PIXI.Graphics();ground.beginFill(0x000000,.35);ground.drawEllipse(W*.26,H*.66,W*.1,H*.035);ground.drawEllipse(W*.74,H*.66,W*.11,H*.04);ground.endFill();L.near.addChild(ground);

    // Người chơi (Thiên Ngoại Chi Ma)
    const pr=Math.min(H*.24,96);
    P={c:new PIXI.Container(),bx:W*.26,by:H*.46};
    P.c.position.set(P.bx,P.by);
    P.as=pr*.045;P.aura=sprite('soft',col(state.ess||'#a29bfe'),true,.55,P.as);
    P.ring=new PIXI.Graphics();P.ring.lineStyle(3,0x9b59b6,.85);P.ring.drawCircle(0,0,pr*.95);P.ring.lineStyle(10,0x9b59b6,.18);P.ring.drawCircle(0,0,pr*.95);P.ring.visible=false;
    
    if(TX.hero){
      const hk=(H*.88)/TX.hero.height;
      P.t=new PIXI.Sprite(TX.hero);P.t.anchor.set(.5);P.t.scale.set(hk);
      P.flash=new PIXI.Sprite(TX.hero);P.flash.anchor.set(.5);P.flash.scale.set(hk);P.flash.blendMode=PIXI.BLEND_MODES.ADD;P.flash.alpha=0;
    }else{
      const pGlyph = (S && S.name ? S.name.slice(0,2) : '魔');
      P.t=new PIXI.Text(pGlyph,{fontFamily:BRUSH,fontSize:pr*.62,fill:0x00cec9,dropShadow:true,dropShadowColor:'#9b59b6',dropShadowBlur:16});
      P.t.anchor.set(.5);
      P.flash=new PIXI.Text(pGlyph,{fontFamily:BRUSH,fontSize:pr*.62,fill:0xffffff});
      P.flash.anchor.set(.5);P.flash.alpha=0;
    }
    P.c.addChild(P.aura,P.ring,P.t,P.flash);L.fig.addChild(P.c);

    // Kẻ địch
    const er=Math.min(H*.27,100),fc=col(art.c);
    E={c:new PIXI.Container(),bx:W*.74,by:H*.4,r:er,col:fc};
    E.c.position.set(E.bx,E.by);
    E.glow=sprite('soft',fc,true,.22,er*.045);
    
    if(TX.foe){
      const k=(H*.92)/TX.foe.height*(art.k==='langvuong'||art.k==='hachung'?1.08:1);
      E.t=new PIXI.Sprite(TX.foe);E.t.anchor.set(.5);E.t.scale.set(k);E.t.tint=PTINT[art.k]||0xffffff;
      E.flash=new PIXI.Sprite(TX.foe);E.flash.anchor.set(.5);E.flash.scale.set(k);E.flash.blendMode=PIXI.BLEND_MODES.ADD;E.flash.alpha=0;
      E.by=H*.5;E.c.y=E.by;E.r=Math.min(H*.3,110);
    }else{
      E.t=new PIXI.Text(art.g,{fontFamily:BRUSH,fontSize:er*1.15,fill:fc,dropShadow:true,dropShadowColor:'#000',dropShadowBlur:10});
      E.t.anchor.set(.5);
      E.flash=new PIXI.Text(art.g,{fontFamily:BRUSH,fontSize:er*1.15,fill:0xffffff});
      E.flash.anchor.set(.5);E.flash.alpha=0;
    }
    E.c.addChild(E.glow,E.t,E.flash);L.fig.addChild(E.c);

    // Hạt thời tiết
    const n={firefly:26,ember:40,rain:90,mote:30,snow:70}[sc.part]||30;
    for(let i=0;i<n;i++) wx.push(newWx(true));

    const vig=new PIXI.Sprite(tex.vig);vig.width=W;vig.height=H;L.top.addChild(vig);
    L.flash=new PIXI.Graphics();L.flash.beginFill(0xffffff);L.flash.drawRect(0,0,W,H);L.flash.endFill();L.flash.alpha=0;L.top.addChild(L.flash);
    applyState();
  }

  function sprite(t,tint,blend,alpha,scale){
    const s=new PIXI.Sprite(tex[t]);s.anchor.set(.5);s.tint=tint;
    if(blend) s.blendMode=PIXI.BLEND_MODES.ADD;
    s.alpha=alpha??1;if(scale)s.scale.set(scale);return s;
  }

  function newWx(init){
    const k=sc.part,o={k};
    const t=k==='rain'?'streak':'soft';
    o.s=new PIXI.Sprite(tex[t]);o.s.anchor.set(.5);o.s.tint=sc.pc;
    if(k!=='snow'&&k!=='rain') o.s.blendMode=PIXI.BLEND_MODES.ADD;
    o.ph=rnd(0,6);
    const x=rnd(0,W),y=init?rnd(0,H):(k==='snow'||k==='rain'?-20:H+20);
    o.s.position.set(x,y);
    switch(k){
      case 'firefly':o.vx=rnd(-.25,.25);o.vy=rnd(-.2,.2);o.s.scale.set(rnd(.12,.25));break;
      case 'ember':o.vx=rnd(-.3,.3);o.vy=-rnd(.4,1.3);o.s.scale.set(rnd(.08,.16));break;
      case 'mote':o.vx=rnd(-.15,.15);o.vy=-rnd(.1,.3);o.s.scale.set(rnd(.08,.15));break;
      case 'snow':o.vx=rnd(-.5,-.1);o.vy=rnd(.5,1.2);o.s.scale.set(rnd(.07,.14));o.s.alpha=.85;break;
      case 'rain':o.vx=-1.4;o.vy=rnd(10,14);o.s.rotation=.1;o.s.scale.set(1,rnd(.6,1.1));o.s.alpha=.35;break;
    }
    L.wx.addChild(o.s);return o;
  }

  function sync(s){state=Object.assign(state,s);if(ready)applyState()}
  function applyState(){
    if(!P)return;
    P.aura.tint=col(state.ess||'#5fae8a');
    P.ring.visible=!!state.shield;
  }

  function particle(o){
    const s=new PIXI.Sprite(tex[o.tex||'soft']);s.anchor.set(.5);s.tint=o.tint??0xffffff;
    if(o.add!==false)s.blendMode=PIXI.BLEND_MODES.ADD;
    s.position.set(o.x,o.y);s.scale.set(o.sc||.2);s.alpha=o.a??1;s.rotation=o.rot||0;
    (o.layer||L.fx).addChild(s);
    parts.push({s,vx:o.vx||0,vy:o.vy||0,g:o.g||0,life:o.life||600,max:o.life||600,a0:s.alpha,grow:o.grow||0,drag:o.drag??.98});
  }
  function sparks(x,y,tint,n,spd){for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),v=rnd(spd*.4,spd);particle({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,tint,sc:rnd(.06,.14),life:rnd(250,550),drag:.9})}}
  function ring(x,y,tint,r0,r1,w,dur){
    const g=new PIXI.Graphics();g.position.set(x,y);g.blendMode=PIXI.BLEND_MODES.ADD;L.fx.addChild(g);
    tween(dur,p=>{g.clear();g.lineStyle(w*(1-p)+1,tint,1-p);g.drawCircle(0,0,r0+(r1-r0)*p)},()=>g.destroy());
  }
  function num(side,text,style){
    const F=side==='p'?P:E;if(!F)return;
    const big=style==='crit',small=style==='dot'||style==='txt';
    const fill={gu:0x00cec9,crit:0xfeca57,taken:0xff7675,heal:0x2ecc71,dot:0xff7675,reflect:0x00cec9,txt:0xf0ecd8}[style]||0xf0ecd8;
    const t=new PIXI.Text(text,{fontFamily:DISPLAY,fontWeight:'700',fontSize:big?48:small?(style==='txt'?15:22):32,fill,
      stroke:'#000000',strokeThickness:big?6:4,dropShadow:true,dropShadowColor:'#000',dropShadowBlur:8});
    t.anchor.set(.5);const x=F.c.x+rnd(-24,24),y=F.c.y-60;t.position.set(x,y);L.ui.addChild(t);
    t.scale.set(.4);
    tween(big?1100:900,p=>{t.y=y-p*55;t.scale.set(p<.18?.4+ease.back(p/.18)*.8:1.2-(p-.18)*.25);t.alpha=p<.7?1:1-(p-.7)/.3},()=>t.destroy(),ease.lin);
  }
  function flashScreen(tint,a,dur){if(!L.flash)return;L.flash.tint=tint;tween(dur,p=>{L.flash.alpha=a*(1-p)},null,ease.lin)}
  function hit(F,strength){
    if(!RM){stop_=Math.max(stop_,strength>1?110:60);shake=Math.max(shake,6*strength)}
    F.flash.alpha=1;tween(220,p=>{F.flash.alpha=1-p});
    const dir=F===E?1:-1;tween(240,p=>{F.c.x=F.bx+dir*14*strength*Math.sin(p*Math.PI)});
  }

  function projectile(kind,land){
    const a={x:P.c.x+30,y:P.c.y},b={x:E.c.x,y:E.c.y};
    if(RM){land();return}
    
    // Tia sét
    if(kind==='dienlang'||kind==='loidinh'){
      const bm=new PIXI.Sprite(tex.beam);bm.anchor.set(0,.5);bm.position.set(a.x,a.y);
      const ang=Math.atan2(b.y-a.y,b.x-a.x),dist=Math.hypot(b.x-a.x,b.y-a.y);
      bm.rotation=ang;bm.tint=0x54a0ff;bm.blendMode=PIXI.BLEND_MODES.ADD;L.fx.addChild(bm);
      tween(350,p=>{bm.scale.set(dist/256*p,2*(1-p));bm.alpha=1-p},()=>{bm.destroy();land()});
      return;
    }

    // Kiếm quang / Kim châm / Băng tiễn
    const tint=kind==='hanbang'?0x70a1ff:kind==='kimcham'?0xfeca57:0x00cec9;
    const cr=new PIXI.Sprite(tex.crescent);cr.anchor.set(.5);cr.tint=tint;cr.blendMode=PIXI.BLEND_MODES.ADD;cr.position.set(a.x,a.y);L.fx.addChild(cr);
    tween(300,p=>{
      cr.x=a.x+(b.x-a.x)*p;cr.y=a.y+(b.y-a.y)*p-Math.sin(p*Math.PI)*20;cr.rotation=p*Math.PI*3;
    },()=>{cr.destroy();land()},ease.in);
  }

  const PLAY={
    patk(e){
      const color=e.kind==='hanbang'?0x70a1ff:e.kind==='kimcham'?0xfeca57:0x00cec9;
      const land=()=>{hit(E,1.2);ring(E.c.x,E.c.y,color,20,90,8,400);sparks(E.c.x,E.c.y,color,14,6);num('e','−'+e.dmg,e.kind==='fist'?'':'gu')};
      if(e.kind==='fist'){tween(220,p=>{P.c.x=P.bx+50*Math.sin(p*Math.PI)});setTimeout(land,RM?0:110)}
      else{tween(160,p=>{P.aura.scale.set(P.as*(1+.5*Math.sin(p*Math.PI)))});projectile(e.kind,land)}
    },
    combo(e){
      const g=new PIXI.Text(SKILL_GLYPH[e.id]||'招',{fontFamily:BRUSH,fontSize:Math.min(H*.5,160),fill:0xfeca57,dropShadow:true,dropShadowColor:'#000',dropShadowBlur:24});
      g.anchor.set(.5);g.position.set(E.c.x,E.c.y);g.alpha=0;L.ui.addChild(g);
      tween(200,p=>{g.scale.set(2.4-1.4*p);g.alpha=p},()=>{
        hit(E,2);ring(E.c.x,E.c.y,0xfeca57,30,130,10,500);sparks(E.c.x,E.c.y,0xfeca57,25,9);
        num('e','−'+e.dmg,'crit');flashScreen(0xfeca57,.25,350);
        tween(500,p=>{g.scale.set(1+p*.2);g.alpha=1-p},()=>g.destroy(),ease.in);
      },ease.back);
    },
    eatk(e){
      const heavy=e.heavy;
      tween(260,p=>{E.c.x=E.bx-50*Math.sin(p*Math.PI)});
      setTimeout(()=>{
        for(let i=0;i<3;i++){
          const s=new PIXI.Sprite(tex.claw);s.anchor.set(.5);s.tint=heavy?0xff4757:0xff7675;s.blendMode=PIXI.BLEND_MODES.ADD;
          s.position.set(P.c.x+(i-1)*14,P.c.y+(i-1)*6);s.rotation=-.6;L.fx.addChild(s);
          tween(340,p=>{s.scale.set(1.4*p,1.2);s.alpha=1-p},()=>s.destroy());
        }
        hit(P,heavy?1.8:1);
        num('p','−'+e.dmg,heavy?'crit':'taken');
      },RM?0:130);
    },
    heal(e){
      num('p','+'+e.amt,'heal');
      for(let i=0;i<14;i++) particle({x:P.c.x+rnd(-35,35),y:P.c.y+rnd(0,40),vy:-rnd(.8,2),tint:0x2ecc71,sc:rnd(.1,.2),life:rnd(500,900),drag:1});
    },
    shield(){ring(P.c.x,P.c.y,0x7fd1a8,20,80,8,450);sparks(P.c.x,P.c.y,0x7fd1a8,10,4);P.ring.visible=true},
    text(e){num(e.on,e.t,'txt')},
    ko(){
      if(!RM){stop_=150;shake=16}
      flashScreen(0xffffff,.3,300);sparks(E.c.x,E.c.y,E.col,30,8);
      ring(E.c.x,E.c.y,E.col,20,140,10,600);
      tween(800,p=>{E.t.alpha=1-p;E.glow.alpha=1-p;E.c.y=E.by+p*12},null,ease.in);
    },
    pdie(){
      if(!RM){stop_=150;shake=14}
      flashScreen(0xa01008,.45,800);
      tween(900,p=>{P.t.alpha=1-p;P.aura.alpha=1-p;P.c.y=P.by+p*16},null,ease.in);
    }
  };

  function play(e){
    if(!ready){pend.push(e);return}
    if(PLAY[e.type]) PLAY[e.type](e);
  }

  function tick(delta){
    T+=delta*16.6;
    if(stop_>0){stop_-=delta*16.6;return}
    if(shake>0){
      root.x=(Math.random()-.5)*shake;root.y=(Math.random()-.5)*shake;
      shake=Math.max(0,shake-delta*.8);
    }else root.x=root.y=0;

    for(let i=tw.length-1;i>=0;i--){
      const o=tw[i];o.t+=delta*16.6;const p=Math.min(1,o.t/o.dur);
      o.upd(o.e(p));
      if(p>=1){if(o.done)o.done();tw.splice(i,1)}
    }

    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i];p.life-=delta*16.6;
      if(p.life<=0){p.s.destroy();parts.splice(i,1);continue}
      p.vx*=p.drag;p.vy=(p.vy+p.g)*p.drag;p.s.x+=p.vx;p.s.y+=p.vy;
      p.s.alpha=p.a0*(p.life/p.max);
    }

    wx.forEach(o=>{
      o.s.x+=o.vx||0;o.s.y+=o.vy||0;
      if(o.s.y>H+20||o.s.y<-30||o.s.x>W+20||o.s.x<-20){o.s.position.set(rnd(0,W),o.k==='snow'||o.k==='rain'?-15:H+15)}
    });
  }

  return {mount,play,sync};
})();
