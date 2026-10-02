// Hình ảnh sandbox E (PIXI 7). Chỉ đọc state của SBSim; frame chọn theo thời gian TRẬN.
// Hiệu ứng chiêu (nguyệt nhận, băng, hộ thể, vòng báo trước) vẽ bằng code, không nằm trong sprite.
// TÍCH HỢP: thay phần dựng P/E trong Arena.build() của battle.js khi fightMode==='e';
// giữ nền/thời tiết của Arena, dùng pick() + các lớp guide/fx ở đây.
const SBView=(function(){
  let app,B,L={},spr={},kp={},W=960,H=430,fx=[],hover=null,pings=[];
  // Dải mặt đất trên màn hình (z=0 → GY0, z=Z1 → GY1). Map pixel ghi ground_screen_y trong map.json
  // để mỗi ảnh nền khớp sàn của nó; view, input, bóng và telegraph cùng dùng phép chiếu này.
  let GY0=250,GY1=400,syk=(GY1-GY0)/(B?.arena.Z1||240);
  const EDGE_PAD=36;let MARGIN=EDGE_PAD,KX=W/1000,OX=0;
  const sx=x=>OX+x*KX,sy=z=>GY0+(z/(B?.arena.Z1||240))*(GY1-GY0);
  const PICK_TOL=12;                          // click lệch khỏi mép sàn tối đa 12px vẫn nhận (kéo về mép)
  const depthK=z=>.9+.16*(z/(B?.arena.Z1||240));
  const SCALE=1.12;                            // px màn hình / px sprite gốc
  const INTENT={melee:'⚔',near:'»',big:'⚠',guard:'🛡',dodge:'↯',escape:'❄',power:'❄'};

  async function mount(el,battle,bg){
    B=battle;KX=(W-2*MARGIN)/(B.arena.X1-B.arena.X0);OX=MARGIN-B.arena.X0*KX;
    app=new PIXI.Application({width:W,height:H,backgroundColor:0x1b2028,antialias:true,resolution:Math.min(2,window.devicePixelRatio||1),autoDensity:true});
    el.appendChild(app.view);app.view.style.width='100%';app.view.style.height='auto';
    for(const k of ['bg','ground','ghost','fig','fx'])L[k]=new PIXI.Container();
    L.fig.sortableChildren=true;app.stage.addChild(L.bg,L.ground,L.ghost,L.fig,L.fx);
    const map=bg&&typeof bg==='object'?bg:null;
    GY0=250;GY1=400;
    if(map&&Array.isArray(map.ground_screen_y)&&map.ground_screen_y.length===2&&map.ground_screen_y.every(Number.isFinite)&&map.ground_screen_y[0]>=0&&map.ground_screen_y[0]<map.ground_screen_y[1]&&map.ground_screen_y[1]<=H){[GY0,GY1]=map.ground_screen_y;syk=(GY1-GY0)/(B?.arena.Z1||240)}
    syk=(GY1-GY0)/B.arena.Z1;
    if(typeof SBFxAssets!=='undefined')await SBFxAssets.load();
    let pixel=false;
    if(bg){
      let t=await PIXI.Assets.load(map?map.image:bg).catch(()=>null);
      pixel=!!(t&&map?.pixel);
      if(!t&&map?.fallback)t=await PIXI.Assets.load(map.fallback).catch(()=>null);
      if(t){
        if(pixel)t.baseTexture.scaleMode=PIXI.SCALE_MODES.NEAREST;
        const s=new PIXI.Sprite(t),k=Math.max(W/t.width,H/t.height);
        s.scale.set(k);s.x=(W-t.width*k)/2;s.y=(H-t.height*k)*(pixel?(map.cropY??.5):.35);
        s.alpha=pixel?1:.85;L.bg.addChild(s);
      }
    }
    const dim=new PIXI.Graphics();dim.beginFill(0x000000,pixel?(map.dim??0):.35);dim.drawRect(0,0,W,H);dim.endFill();
    if(!pixel){dim.beginFill(0x0c0f12,.55);dim.drawRect(0,GY0-20,W,H-GY0+20);dim.endFill()}L.bg.addChild(dim);
    // Sương nhẹ phủ hậu cảnh phía trên sàn để nhân vật hàng sau tách khỏi rừng tối (map.haze, 0 = tắt)
    if(pixel&&map.haze>0){const h=new PIXI.Graphics(),n=8;for(let i=0;i<n;i++){h.beginFill(map.hazeColor??0xdfe8ec,map.haze*(i+1)/n);h.drawRect(0,(GY0-24)*i/n,W,(GY0-24)/n+1);h.endFill()}
      h.beginFill(map.hazeColor??0xdfe8ec,map.haze);h.drawRect(0,GY0-24,W,24);h.endFill();L.bg.addChild(h)}
    L.guide=new PIXI.Graphics();L.ground.addChild(L.guide);L.proj=new PIXI.Graphics();L.fx.addChild(L.proj);
    L.windup=new PIXI.Graphics();L.fx.addChild(L.windup);
    for(const a of Object.values(B.actors)){
      kp[a.id]=await KPSprite.load(a.kit.sprite);
      const c=new PIXI.Container(),sh=new PIXI.Graphics(),aura=new PIXI.Graphics(),s=new PIXI.Sprite(kp[a.id].clips.idle.tex[0]);
      sh.beginFill(0x000000,.4);sh.drawEllipse(0,0,38,9);sh.endFill();
      const [fw,fh]=kp[a.id].man.frame_size,[px,py]=kp[a.id].man.pivot_px;s.anchor.set(px/fw,py/fh);
      const intent=new PIXI.Text('',{fontSize:22,fill:0xffffff,stroke:0x000000,strokeThickness:3});intent.anchor.set(.5,1);
      const bar=new PIXI.Graphics();
      c.addChild(sh,aura,s,intent,bar);L.fig.addChild(c);
      spr[a.id]={c,s,sh,aura,intent,bar,flash:KPSprite.flash(s),ghostAt:0,hy:140};
      spr[a.id].flash.tint=a.id===B.ids.player?0xff3a20:0xffffff;
    }
    // Lề màn hình theo bề vươn sprite thật (reach_px trong manifest) ở hàng gần nhất, để pose rộng/KO không tràn mép.
    // Người dùng 02/10: “cho đi hết cỡ sân”. Lề chỉ bằng nửa thân (EDGE_PAD) để chân đi sát mép màn hình;
    // pose vươn rộng (đòn, KO) ở sát mép có thể bị cắt một phần — chấp nhận để có trọn sân.
    MARGIN=EDGE_PAD;
    KX=(W-2*MARGIN)/(B.arena.X1-B.arena.X0);OX=MARGIN-B.arena.X0*KX;
    return app;
  }

  // Clip của chiêu: lấy clip đầu tiên có trong sheet theo danh sách ưu tiên của kit
  function clipOf(a,s){const K=kp[a.id].clips;for(const n of [].concat(s.clip||[]))if(K[n])return K[n];return K.idle}
  // (clip, frame) theo trạng thái — nơi duy nhất quyết định hình
  function pick(a){
    const K=kp[a.id].clips,c=n=>K[n]||K.idle;
    switch(a.state){
      case 'move':return [c('move'),0];
      case 'act':{
        const A=a.act,clip=clipOf(a,A.s),n=clip.tex.length,r=Math.min(clip.release??1,n-1);
        if(A.phase==='startup')return [clip,r?Math.min(r-1,Math.floor(A.t/A.s.startup*r)):0];
        if(A.phase==='active')return [clip,r];
        const rest=n-1-r;if(!rest)return [clip,r];
        return [clip,r+1+Math.min(rest-1,Math.floor((A.t-A.s.startup-A.s.active)/A.s.recovery*rest))];
      }
      case 'hit':return [c('hit'),a.since<.14?0:Math.min(1,c('hit').tex.length-1)];
      case 'shell':{const g=c('guard');return [g,g.tex.length-1]}
      case 'ko':{if(B.over?.retreat&&B.over.loser===a.id)return [c('move'),Math.floor((B.t-B.over.at)*5)%Math.max(1,c('move').tex.length)];
        const k=c('ko');return [k,KPSprite.frameAt(Object.assign({},k,{loop:false}),a.since)]}
      case 'win':return [c('win'),0];
      default:
        if(B.t-a.stopAt<.22&&K.move)return [K.move,Math.min(1,K.move.tex.length-1)];
        return [K.idle,KPSprite.frameAt(K.idle,B.t)];
    }
  }

  function render(evs){
    for(const a of Object.values(B.actors)){
      const S=spr[a.id],[clip,i]=pick(a),k=depthK(a.z)*SCALE;
      S.s.texture=clip.tex[i];S.s.scale.set(k*a.face,k);
      // Thua mà kịch bản là rút lui (TR-3): chạy khỏi sân và mờ dần, không nằm gục.
      const fleeing=B.over?.retreat&&B.over.loser===a.id,ft=fleeing?Math.max(0,B.t-B.over.at-.25):0,fdir=fleeing?(Math.sign(a.x-B.actors[B.over.winner].x)||1):0;
      if(fleeing)S.s.scale.set(k*fdir,k);
      S.c.position.set(sx(a.x+fdir*a.kit.speed*ft),sy(a.z));S.c.zIndex=a.z;S.sh.scale.set(depthK(a.z));S.c.alpha=fleeing?Math.max(0,1-ft/1.2):1;
      S.flash.alpha=Math.max(0,1-(B.t-a.flashAt)/.16);
      S.intent.text=a.ai&&!B.over?(INTENT[a.intent]||''):'';S.intent.y=-S.hy*1.02*k;
      // hộ thể: vầng sáng quanh thân
      S.aura.clear();
      if(a.shield){
        const left=a.shield.until-B.t,fade=Math.min(1,Math.max(0,left)),y=-S.hy*.48*k,rx=46*k,ry=S.hy*.6*k;
        const g=S.aura;g.lineStyle(2,a.shield.tint,fade*.85);
        if(a.shield.id==='thuytrao'){
          g.drawEllipse(0,y,rx,ry);g.lineStyle(1,0xdbfaff,fade*.5);
          g.drawEllipse(0,y+Math.sin(B.t*5)*5*k,rx*.9,ry*.9);
        }else if(a.shield.id==='thienbong'){
          g.beginFill(a.shield.tint,.12*fade);g.drawPolygon([-rx*.8,y-ry*.7,0,y-ry,rx*.8,y-ry*.7,rx,y+ry*.5,0,y+ry,-rx,y+ry*.5]);g.endFill();
          g.lineStyle(2,0xfffce8,fade*.7);g.moveTo(-rx*.7,y);g.lineTo(0,y+ry*.45);g.lineTo(rx*.7,y);
        }else{
          g.beginFill(a.shield.tint,.08*fade);g.drawPolygon([0,y-ry,rx,y-ry*.3,rx*.8,y+ry*.6,0,y+ry,-rx*.8,y+ry*.6,-rx,y-ry*.3]);g.endFill();
        }
      }
      // Sương Yêu: viền sương lạnh nhấp nháy quanh thân, tách khỏi hộ thể
      if(a.empower){const y=-S.hy*.5*k,left=a.empower.until-B.t;S.aura.lineStyle(2,0xe8fbff,Math.min(1,left)*(.55+.35*Math.sin(B.t*14)));
        for(let i=0;i<6;i++){const an=i/6*6.283+B.t*2,r=40*k;S.aura.moveTo(Math.cos(an)*r*.6,y+Math.sin(an)*r);S.aura.lineTo(Math.cos(an)*r*.9,y+Math.sin(an)*r*1.25)}}
      // thanh lấy đà dưới chân (chỉ chiêu có lấy đà dài)
      S.bar.clear();
      if(a.act&&a.act.phase==='startup'&&a.act.s.startup>=.35){const p=a.act.t/a.act.s.startup;S.bar.beginFill(0x000000,.6);S.bar.drawRect(-32,12,64,6);S.bar.endFill();S.bar.beginFill(a.act.s.kind==='aoe'?0xff5a44:0xf0c46a);S.bar.drawRect(-32,12,64*p,6);S.bar.endFill()}
      // bóng mờ khi lướt / thoát thân / di chuyển
      const fast=a.act&&(a.act.s.kind==='dash'||a.act.s.kind==='escape')&&a.act.phase==='active';
      if((a.state==='move'||fast)&&B.t-S.ghostAt>(fast?.025:.05)){S.ghostAt=B.t;const g=new PIXI.Sprite(S.s.texture);g.anchor.copyFrom(S.s.anchor);g.scale.copyFrom(S.s.scale);g.position.copyFrom(S.c.position);g.alpha=g.startAlpha=fast?.45:.3;g.born=B.t;if(a.act&&a.act.s.kind==='escape')g.tint=0xbfe8ff;L.ghost.addChild(g)}
    }
    for(const g of [...L.ghost.children]){const age=B.t-g.born;g.alpha=g.startAlpha*Math.max(0,1-age/.3);if(age>.3)g.destroy()}
    drawProj();drawWindup();
    for(const e of evs||[]){
      const a=B.actors[e.who];
      if(e.type==='dmg'){
        floatText(a,(e.dot?'':'−')+e.amount+(e.blocked?` (đỡ ${e.blocked})`:''),e.dot?0xff9a9a:a.id===B.ids.player?0xff7a6a:0xffe3a0,e.dot?.65:1);
        if(!e.dot)impact(e.contact||a,e.blocked?({bachngoc:'jade',thienbong:'gold',thuytrao:'water'}[e.shield]||'jade'):B.actors[e.source]?.sk[e.skill]?.fx==='ice'?'ice':e.skill==='nguyet'?'moon':'punch');
      }
      else if(e.type==='miss')floatText(a,'trượt',0xb8c0cc,.7);
      else if(e.type==='interrupt')floatText(a,'bị ngắt',0xffb070,.7);
      else if(e.type==='fizzle')floatText(a,'thiếu chân nguyên',0xffb070,.7);
      else if(e.type==='heal')floatText(a,'+'+e.amount,0x8fe0b0,1);
      else if(e.type==='escape'){floatText(a,'thoát thân',0xbfe8ff,.75);burst(a.x,a.z,0xd8f4ff,22,140)}
      else if(e.type==='empower'){floatText(a,'Sương Yêu',0xd8f4ff,.85);burst(a.x,a.z,0xe8fbff,14,60)}
      else if(e.type==='empowerEnd')floatText(a,'khớp đông cứng',0xa8c8e0,.7);
      else if(e.type==='detonate'){floatText(a,'Tự nổ tay phải!',0xd8f4ff,1.1);burst(a.x,a.z,0xd8f4ff,40,220);burst(a.x,a.z,0xffffff,18,120)}
      else if(e.type==='shellEnd')floatText(a,'phá vỏ băng',0xbfe8ff,.75);
      else if(e.type==='zoneFire')burst(e.x,e.z,0xbfe8ff,30,e.r);
      else if(e.type==='grab')line(B.actors[e.who],B.actors[e.target],0xc9c2b0);
      else if(e.type==='release'&&e.skill==='cuxi'){if(!assetStrike('fx_cuxi',a,a.sk.cuxi.range))saw(a);}
      else if(e.type==='release'&&e.kind==='grab')assetStrike('fx_cuongthu',a,a.sk[e.skill].range);
      else if(e.type==='release'&&e.skill==='atk')strike(a,a.id===B.ids.enemy);
      else if(e.type==='shield')burst(a.x,a.z,a.shield?a.shield.tint:0xffffff,12,50);
    }
    for(const f of [...fx]){const age=B.t-f.born;if(f.upd(age)){f.o.destroy();fx.splice(fx.indexOf(f),1)}}
    drawGuide();
  }
  // Điểm phát: dùng hand của clip nếu đã có; fallback thủ công, không đo alpha bbox.
  function hand(a){
    const k=depthK(a.z)*SCALE,clip=a.act?clipOf(a,a.act.s):null,h=clip&&clip.hand;
    const [px,py]=kp[a.id].man.pivot_px;
    return {x:sx(a.x)+(h?h[0]-px:38)*k*a.face,y:sy(a.z)+(h?h[1]-py:-78)*k};
  }
  function drawWindup(){
    const g=L.windup;g.clear();
    for(const a of Object.values(B.actors))if(!B.over&&['proj','heal'].includes(a.act?.s.kind)&&a.act.phase==='startup'){
      const h=hand(a),p=a.act.t/a.act.s.startup,n=2+Math.floor(p*4);
      const healing=a.act.s.kind==='heal';g.beginFill(healing?0x85c68a:0x8acbdf,.5);g.drawRect(Math.round(h.x)-n,Math.round(h.y)-n,n*2,n*2);g.endFill();
      g.beginFill(0xf0fcff,.85);g.drawRect(Math.round(h.x)-2,Math.round(h.y)-2,4,4);g.endFill();
    }
  }
  function strike(a,ice){
    const g=new PIXI.Graphics();L.fx.addChild(g);const h=hand(a),f=a.face,k=depthK(a.z)*SCALE;
    fx.push({o:g,born:B.t,upd:age=>{
      const p=age/.16;g.clear();if(p>=1)return true;
      const len=(ice?68:30)*k;
      g.beginFill(ice?0x71abc9:0xc5bba3,(1-p)*.7);
      g.drawPolygon([h.x-f*8,h.y-10,h.x+f*len,h.y-3,h.x+f*(len+6),h.y+3,h.x,h.y+10]);g.endFill();
      g.beginFill(ice?0xf1fbff:0xfff1cb,1-p);
      g.drawPolygon([h.x,h.y-3,h.x+f*len,h.y,h.x+f*10,h.y+4]);g.endFill();return false;
    }});
  }
  function assetStrike(id,a,range){
    const c=typeof SBFxAssets!=='undefined'&&SBFxAssets.create(id);if(!c)return false;
    const h=hand(a),face=a.face,k=depthK(a.z)*SCALE;c.sprite.scale.set(k*face,k);L.fx.addChild(c.sprite);
    fx.push({o:c.sprite,born:B.t,upd:age=>{if(age>=c.duration)return true;c.frame(age);const p=age/c.duration;
      c.sprite.position.set(h.x+face*range*KX*Math.sin(p*Math.PI),h.y);return false}});return true;
  }
  function impact(at,material){
    const asset=material==='ice'&&typeof SBFxAssets!=='undefined'&&SBFxAssets.create('fx_ice_impact');
    if(asset){const k=depthK(at.z)*SCALE;asset.sprite.scale.set(k);asset.sprite.position.set(sx(at.x),sy(at.z)-78*k);L.fx.addChild(asset.sprite);
      fx.push({o:asset.sprite,born:B.t,upd:age=>{if(age>=asset.duration)return true;asset.frame(age);return false}});return}
    const g=new PIXI.Graphics();L.fx.addChild(g);
    const x=sx(at.x),y=sy(at.z)-78*depthK(at.z)*SCALE,colors={ice:[0x80bddd,0xf4fcff],moon:[0x8bcbe0,0xffffff],jade:[0xacc7ca,0xfff7dc],gold:[0xcfb266,0xfffce0],water:[0x619ec8,0xe1f8ff],punch:[0xbba07e,0xffecd0]}[material];
    const parts=Array.from({length:material==='ice'?8:6},(_,i)=>({a:i*6.28/8,v:20+Math.random()*18}));
    fx.push({o:g,born:B.t,upd:age=>{
      const p=age/.22;g.clear();if(p>=1)return true;
      if(p<.35){g.beginFill(colors[1],1-p);g.drawPolygon([x-12,y,x-3,y-3,x,y-12,x+3,y-3,x+12,y,x+3,y+3,x,y+12,x-3,y+3]);g.endFill()}
      for(const q of parts){const xx=Math.round(x+Math.cos(q.a)*q.v*p),yy=Math.round(y+Math.sin(q.a)*q.v*p);g.beginFill(colors[0],1-p);g.drawRect(xx,yy,material==='ice'?4:3,3);g.endFill()}return false;
    }});
  }
  function floatText(a,txt,col,sc){
    const k=depthK(a.z)*SCALE,t=new PIXI.Text(txt,{fontFamily:'system-ui,sans-serif',fontWeight:'800',fontSize:24*(sc||1),fill:col,stroke:0x000000,strokeThickness:4});
    t.anchor.set(.5);t.position.set(sx(a.x)+(Math.random()-.5)*20,sy(a.z)-spr[a.id].hy*.75*k);L.fx.addChild(t);
    const y0=t.y;fx.push({o:t,born:B.t,upd:age=>{t.y=y0-age*60;t.alpha=1-age/.9;return age>.9}});
  }
  function burst(x,z,col,n,r){
    const g=new PIXI.Graphics();L.fx.addChild(g);const parts=Array.from({length:n},()=>({a:Math.random()*6.28,v:.4+Math.random()*.6}));
    fx.push({o:g,born:B.t,upd:age=>{g.clear();const p=age/.45;for(const q of parts){g.beginFill(col,1-p);g.drawCircle(sx(x)+Math.cos(q.a)*r*q.v*p,sy(z)-40+Math.sin(q.a)*r*q.v*p*.5,3);g.endFill()}return p>=1}});
  }
  function saw(a){
    const g=new PIXI.Graphics();L.fx.addChild(g);const k=depthK(a.z)*SCALE;
    fx.push({o:g,born:B.t,upd:age=>{g.clear();const p=age/.3,x0=sx(a.x)+a.face*20,len=a.sk.cuxi.range*KX*Math.min(1,p*2);
      g.lineStyle(10*(1-p*.6),0xe8b84a,1-p);g.moveTo(x0,sy(a.z)-60*k);
      for(let i=1;i<=8;i++)g.lineTo(x0+a.face*len*i/8,sy(a.z)-60*k+Math.sin(i*1.7+age*30)*10);return p>=1}});
  }
  function line(a,b,col){
    const g=new PIXI.Graphics();L.fx.addChild(g);
    fx.push({o:g,born:B.t,upd:age=>{g.clear();const p=age/.35;g.lineStyle(8,col,1-p);g.moveTo(sx(a.x)+a.face*30,sy(a.z)-80);g.lineTo(sx(b.x),sy(b.z)-80);g.beginFill(col,1-p);g.drawCircle(sx(b.x),sy(b.z)-80,14);g.endFill();return p>=1}});
  }
  // Đạn nguyệt nhận: hình trăng khuyết sáng + vệt
  function drawProj(){
    const g=L.proj;g.clear();
    for(const p of B.projs){const x=sx(p.x),y=sy(p.z)-78*depthK(p.z)*SCALE,f=p.face;
      if(p.s.fx==='bird'){                       // chim băng xanh (ch136): thân + cánh vỗ, vệt sương
        const fl=Math.sin(B.t*22)*6;for(let i=3;i>0;i--){g.beginFill(0x9fd6ee,.25/i);g.drawCircle(Math.round(x-f*i*10),Math.round(y),5);g.endFill()}
        g.beginFill(0x4f9fd0,1);g.drawEllipse(x,y,11,7);g.endFill();g.beginFill(0x8fd8ff,1);g.drawPolygon([x-f*4,y-2,x+f*2,y-14-fl,x+f*6,y-2]);g.endFill();
        g.beginFill(0xe8fbff,1);g.drawPolygon([x+f*10,y-3,x+f*16,y,x+f*10,y+2]);g.endFill();continue}
      for(let i=3;i>0;i--){g.beginFill(0x71adc9,.32/i);g.drawRect(Math.round(x-f*i*12)-4,Math.round(y)-3,8,6);g.endFill()}
      const poly=[-10,-18,0,-16,8,-10,12,-4,12,4,8,10,0,16,-10,18,-2,8,2,2,2,-2,-2,-8];
      g.beginFill(0x639fbe,1);g.drawPolygon(poly.map((v,i)=>i%2?Math.round(y+v):Math.round(x+v*f)));g.endFill();
      g.beginFill(0xeffcff,1);g.drawPolygon(poly.map((v,i)=>i%2?Math.round(y+v*.8):Math.round(x+v*f*.8)));g.endFill()}
  }
  // Đường dẫn: điểm đến, vòng báo trước của địch, tầm chiêu khi rê chuột lên ô kỹ năng
  function drawGuide(){
    const g=L.guide;g.clear();const p=B.actors[B.ids.player];
    if(p.move&&!p.chase){g.lineStyle(2,0x8fd0ff,.8);g.drawEllipse(sx(p.move.x),sy(p.move.z),16,5)}
    for(const q of [...pings]){const age=B.t-q.t;if(age>.35){pings.splice(pings.indexOf(q),1);continue}g.lineStyle(2,0x8fd0ff,1-age/.35);g.drawEllipse(sx(q.x),sy(q.z),10+age*40,3+age*12)}
    // Hướng đã khóa của projectile được công khai từ lúc bắt đầu vận; AI đọc cùng dữ liệu này.
    for(const a of Object.values(B.actors)){
      const A=a.act,q=A?.telegraph;if(B.over||A?.phase!=='startup'||!q)continue;
      g.lineStyle(2,a.ai?0xff5a44:0xf0c46a,.8);
      g.moveTo(sx(q.x),sy(q.z));g.lineTo(sx(q.x+q.dx*q.range),sy(q.z+q.dz*q.range));
      const h=hand(a);g.lineStyle(2,a.ai?0xff5a44:0xf0c46a,.65);g.moveTo(h.x,h.y);
      g.lineTo(h.x+q.dx*q.range*KX,h.y+q.dz*q.range*syk);
    }
    // Ô báo đòn cận chiến / chộp đang lấy đà: vùng đánh khóa theo hướng lúc ra đòn → bước ra khỏi ô là né được
    for(const a of Object.values(B.actors)){
      const A=a.act;if(B.over||!A||A.phase!=='startup'||(A.s.kind!=='melee'&&A.s.kind!=='grab'))continue;
      const s=A.s,foe=a.ai,col=foe?0xff5a44:0xf0c46a,pr=Math.min(1,A.t/s.startup);
      const x0=sx(a.x),x1=sx(a.x+a.face*s.range),y0=sy(Math.max(0,a.z-s.depth)),y1=sy(Math.min((B?.arena.Z1||240),a.z+s.depth));
      const l=Math.min(x0,x1),w=Math.abs(x1-x0);
      g.lineStyle(2,col,foe?.85:.45);g.beginFill(col,foe?.10:.05);g.drawRect(l,y0,w,y1-y0);g.endFill();
      g.lineStyle(0);g.beginFill(col,foe?.25:.12);g.drawRect(a.face>0?l:l+w*(1-pr),y0,w*pr,y1-y0);g.endFill();
    }
    for(const z of B.zones){
      const pr=Math.min(1,(B.t-z.from)/(z.fireAt-z.from)),rx=z.r*KX,ry=z.r*syk/1.6;
      g.lineStyle(3,0xff5a44,.9);g.beginFill(0xff5a44,.10);g.drawEllipse(sx(z.x),sy(z.z),rx,ry);g.endFill();
      g.lineStyle(0);g.beginFill(0xff5a44,.28);g.drawEllipse(sx(z.x),sy(z.z),rx*pr,ry*pr);g.endFill();
    }
    if(hover&&!B.over){
      const r=hover.kind==='proj'?hover.range:hover.kind==='aoe'?hover.castRange:hover.kind==='dash'?hover.dist:hover.range;
      if(r){g.lineStyle(2,0xf0c46a,.7);g.drawEllipse(sx(p.x),sy(p.z),r*KX,Math.min(r,(hover.depth||r))*syk)}
    }
  }
  function toWorld(cx,cy){const r=app.view.getBoundingClientRect(),x=(cx-r.left)/r.width*W,y=(cy-r.top)/r.height*H;
    const wx=(x-OX)/KX,z=(y-GY0)/syk;
    const ok=wx>=B.arena.X0-PICK_TOL&&wx<=B.arena.X1+PICK_TOL&&y>=GY0-PICK_TOL&&y<=GY1+PICK_TOL;
    return {x:Math.max(B.arena.X0,Math.min(B.arena.X1,wx)),z:Math.max(0,Math.min((B?.arena.Z1||240),z)),inGround:ok}}
  function hitActor(cx,cy){
    const r=app.view.getBoundingClientRect(),x=(cx-r.left)/r.width*W,y=(cy-r.top)/r.height*H;
    for(const a of Object.values(B.actors)){const k=depthK(a.z)*SCALE;if(Math.abs(x-sx(a.x))<40*k&&y<sy(a.z)+12&&y>sy(a.z)-spr[a.id].hy*k)return a.id}
    return null;
  }
  return {mount,render,toWorld,hitActor,setHover:s=>hover=s,pingGround:w=>pings.push({x:w.x,z:w.z,t:B.t}),get app(){return app}};
})();
