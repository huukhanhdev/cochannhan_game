// Hình ảnh sandbox E (PIXI 7). Chỉ đọc state của SBSim; frame chọn theo thời gian TRẬN.
// Hiệu ứng chiêu (nguyệt nhận, băng, hộ thể, vòng báo trước) vẽ bằng code, không nằm trong sprite.
// TÍCH HỢP: thay phần dựng P/E trong Arena.build() của battle.js khi fightMode==='e';
// giữ nền/thời tiết của Arena, dùng pick() + các lớp guide/fx ở đây.
const SBView=(function(){
  let app,B,L={},spr={},kp={},W=960,H=430,fx=[],hover=null,pings=[];
  const GY0=250,GY1=400;                     // dải mặt đất trên màn hình
  const sx=x=>x*(W/1000),sy=z=>GY0+(z/SBSim.Z1)*(GY1-GY0),syk=(GY1-GY0)/SBSim.Z1;
  const depthK=z=>.9+.16*(z/SBSim.Z1);
  const SCALE=1.12;                            // px màn hình / px sprite gốc
  const INTENT={melee:'⚔',near:'»',big:'⚠',guard:'🛡',dodge:'↯',escape:'❄'};

  async function mount(el,battle,bg){
    B=battle;
    app=new PIXI.Application({width:W,height:H,backgroundColor:0x1b2028,antialias:true,resolution:Math.min(2,window.devicePixelRatio||1),autoDensity:true});
    el.appendChild(app.view);app.view.style.width='100%';app.view.style.height='auto';
    for(const k of ['bg','ground','ghost','fig','fx'])L[k]=new PIXI.Container();
    L.fig.sortableChildren=true;app.stage.addChild(L.bg,L.ground,L.ghost,L.fig,L.fx);
    if(bg){const t=await PIXI.Assets.load(bg).catch(()=>null);if(t){const s=new PIXI.Sprite(t);const k=Math.max(W/t.width,H/t.height);s.scale.set(k);s.x=(W-t.width*k)/2;s.y=(H-t.height*k)*.35;s.alpha=.85;L.bg.addChild(s)}}
    const dim=new PIXI.Graphics();dim.beginFill(0x000000,.35);dim.drawRect(0,0,W,H);dim.endFill();
    dim.beginFill(0x0c0f12,.55);dim.drawRect(0,GY0-20,W,H-GY0+20);dim.endFill();L.bg.addChild(dim);
    L.guide=new PIXI.Graphics();L.ground.addChild(L.guide);L.proj=new PIXI.Graphics();L.fx.addChild(L.proj);
    for(const a of Object.values(B.actors)){
      kp[a.id]=await KPSprite.load(a.kit.sprite);
      const c=new PIXI.Container(),sh=new PIXI.Graphics(),aura=new PIXI.Graphics(),s=new PIXI.Sprite(kp[a.id].clips.idle.tex[0]);
      sh.beginFill(0x000000,.4);sh.drawEllipse(0,0,38,9);sh.endFill();
      const [fw,fh]=kp[a.id].man.frame_size,[px,py]=kp[a.id].man.pivot_px;s.anchor.set(px/fw,py/fh);
      const intent=new PIXI.Text('',{fontSize:22,fill:0xffffff,stroke:0x000000,strokeThickness:3});intent.anchor.set(.5,1);
      const bar=new PIXI.Graphics();
      c.addChild(sh,aura,s,intent,bar);L.fig.addChild(c);
      spr[a.id]={c,s,sh,aura,intent,bar,flash:KPSprite.flash(s),ghostAt:0,hy:140};
      spr[a.id].flash.tint=a.id==='pn'?0xff3a20:0xffffff;
    }
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
      case 'ko':{const k=c('ko');return [k,KPSprite.frameAt(Object.assign({},k,{loop:false}),a.since)]}
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
      S.c.position.set(sx(a.x),sy(a.z));S.c.zIndex=a.z;S.sh.scale.set(depthK(a.z));
      S.flash.alpha=Math.max(0,1-(B.t-a.flashAt)/.16);
      S.intent.text=a.ai&&!B.over?(INTENT[a.intent]||''):'';S.intent.y=-S.hy*1.02*k;
      // hộ thể: vầng sáng quanh thân
      S.aura.clear();
      if(a.shield){const left=a.shield.until-B.t,al=.25+.12*Math.sin(B.t*9);S.aura.lineStyle(3,a.shield.tint,Math.min(1,left)*.9);S.aura.beginFill(a.shield.tint,al*Math.min(1,left));S.aura.drawEllipse(0,-S.hy*.48*k,46*k,S.hy*.6*k);S.aura.endFill()}
      // thanh lấy đà dưới chân (chỉ chiêu có lấy đà dài)
      S.bar.clear();
      if(a.act&&a.act.phase==='startup'&&a.act.s.startup>=.35){const p=a.act.t/a.act.s.startup;S.bar.beginFill(0x000000,.6);S.bar.drawRect(-32,12,64,6);S.bar.endFill();S.bar.beginFill(a.act.s.kind==='aoe'?0xff5a44:0xf0c46a);S.bar.drawRect(-32,12,64*p,6);S.bar.endFill()}
      // bóng mờ khi lướt / thoát thân / di chuyển
      const fast=a.act&&(a.act.s.kind==='dash'||a.act.s.kind==='escape')&&a.act.phase==='active';
      if((a.state==='move'||fast)&&B.t-S.ghostAt>(fast?.025:.05)){S.ghostAt=B.t;const g=new PIXI.Sprite(S.s.texture);g.anchor.copyFrom(S.s.anchor);g.scale.copyFrom(S.s.scale);g.position.copyFrom(S.c.position);g.alpha=g.startAlpha=fast?.45:.3;g.born=B.t;if(a.act&&a.act.s.kind==='escape')g.tint=0xbfe8ff;L.ghost.addChild(g)}
    }
    for(const g of [...L.ghost.children]){const age=B.t-g.born;g.alpha=g.startAlpha*Math.max(0,1-age/.3);if(age>.3)g.destroy()}
    drawProj();
    for(const e of evs||[]){
      const a=B.actors[e.who];
      if(e.type==='dmg')floatText(a,(e.dot?'':'−')+e.amount+(e.blocked?` (đỡ ${e.blocked})`:''),e.dot?0xff9a9a:a.id==='pn'?0xff7a6a:0xffe3a0,e.dot?.65:1);
      else if(e.type==='miss')floatText(a,'trượt',0xb8c0cc,.7);
      else if(e.type==='interrupt')floatText(a,'bị ngắt',0xffb070,.7);
      else if(e.type==='heal')floatText(a,'+'+e.amount,0x8fe0b0,1);
      else if(e.type==='escape'){floatText(a,'Sương Yêu tự bạo',0xbfe8ff,.75);burst(a.x,a.z,0xd8f4ff,22,140)}
      else if(e.type==='zoneFire')burst(e.x,e.z,0xbfe8ff,30,e.r);
      else if(e.type==='grab')line(B.actors[e.who],B.actors[e.target],0xc9c2b0);
      else if(e.type==='release'&&e.skill==='cuxi')saw(a);
      else if(e.type==='release'&&e.skill==='atk'&&a.id==='bnb')slash(a,0xcfefff);
      else if(e.type==='shield')burst(a.x,a.z,a.shield?a.shield.tint:0xffffff,12,50);
    }
    for(const f of [...fx]){const age=B.t-f.born;if(f.upd(age)){f.o.destroy();fx.splice(fx.indexOf(f),1)}}
    drawGuide();
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
  function slash(a,col){
    const g=new PIXI.Graphics();L.fx.addChild(g);const k=depthK(a.z)*SCALE,cx=sx(a.x)+a.face*55*k,cy=sy(a.z)-70*k;
    fx.push({o:g,born:B.t,upd:age=>{g.clear();const p=age/.22;g.lineStyle(6*(1-p),col,1-p);g.arc(cx,cy,55*k,a.face>0?-1.2:Math.PI-.6,a.face>0?.6:Math.PI+1.2);return p>=1}});
  }
  function saw(a){
    const g=new PIXI.Graphics();L.fx.addChild(g);const k=depthK(a.z)*SCALE;
    fx.push({o:g,born:B.t,upd:age=>{g.clear();const p=age/.3,x0=sx(a.x)+a.face*20,len=a.sk.cuxi.range*(W/1000)*Math.min(1,p*2);
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
    for(const p of B.projs){const x=sx(p.x),y=sy(p.z)-78,f=p.face;
      g.beginFill(0x9fe8ff,.25);g.drawEllipse(x-f*22,y,30,10);g.endFill();
      g.beginFill(0xe8fbff,1);g.arc(x,y,20,-1.3*f+(f<0?Math.PI:0),1.3*f+(f<0?Math.PI:0),f<0);g.arc(x-f*9,y,17,1.15*f+(f<0?Math.PI:0),-1.15*f+(f<0?Math.PI:0),f>0);g.endFill()}
  }
  // Đường dẫn: điểm đến, vòng báo trước của địch, tầm chiêu khi rê chuột lên ô kỹ năng
  function drawGuide(){
    const g=L.guide;g.clear();const p=B.actors.pn;
    if(p.move&&!p.chase){g.lineStyle(2,0x8fd0ff,.8);g.drawEllipse(sx(p.move.x),sy(p.move.z),16,5)}
    for(const q of [...pings]){const age=B.t-q.t;if(age>.35){pings.splice(pings.indexOf(q),1);continue}g.lineStyle(2,0x8fd0ff,1-age/.35);g.drawEllipse(sx(q.x),sy(q.z),10+age*40,3+age*12)}
    for(const z of B.zones){
      const pr=Math.min(1,(B.t-z.from)/(z.fireAt-z.from)),rx=z.r*(W/1000),ry=z.r*syk/1.6;
      g.lineStyle(3,0xff5a44,.9);g.beginFill(0xff5a44,.10);g.drawEllipse(sx(z.x),sy(z.z),rx,ry);g.endFill();
      g.lineStyle(0);g.beginFill(0xff5a44,.28);g.drawEllipse(sx(z.x),sy(z.z),rx*pr,ry*pr);g.endFill();
    }
    if(hover&&!B.over){
      const r=hover.kind==='proj'?hover.range:hover.kind==='aoe'?hover.castRange:hover.kind==='dash'?hover.dist:hover.range;
      if(r){g.lineStyle(2,0xf0c46a,.7);g.drawEllipse(sx(p.x),sy(p.z),r*(W/1000),Math.min(r,(hover.depth||r))*syk)}
    }
  }
  function toWorld(cx,cy){const r=app.view.getBoundingClientRect(),x=(cx-r.left)/r.width*W,y=(cy-r.top)/r.height*H;
    return {x:x*1000/W,z:(y-GY0)/syk,inGround:y>=GY0-30}}
  function hitActor(cx,cy){
    const r=app.view.getBoundingClientRect(),x=(cx-r.left)/r.width*W,y=(cy-r.top)/r.height*H;
    for(const a of Object.values(B.actors)){const k=depthK(a.z)*SCALE;if(Math.abs(x-sx(a.x))<40*k&&y<sy(a.z)+12&&y>sy(a.z)-spr[a.id].hy*k)return a.id}
    return null;
  }
  return {mount,render,toWorld,hitActor,setHover:s=>hover=s,pingGround:w=>pings.push({x:w.x,z:w.z,t:B.t}),get app(){return app}};
})();
