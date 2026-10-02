// Mô phỏng trận sandbox E: bước cố định 1/60 giây, không phụ thuộc hình ảnh (chạy được trong node).
// Thế giới: x ∈ [X0, X1] ngang, z ∈ [0, Z1] chiều sâu (0 = xa, Z1 = gần màn hình).
// Trận LUÔN chạy (không dừng khi chọn chiêu). Mỗi chiêu: startup → active (phát đúng một lần) → recovery.
// Chân nguyên và hồi chiêu trừ lúc PHÁT ĐÒN (release): huỷ khi đang lấy đà thì không mất gì (giả động tác).
// Lượt vật phẩm (uses) trừ lúc nhận lệnh: bị ngắt / tự huỷ vẫn mất. Di chuyển với cmd.cancel huỷ được
// pha lấy đà (trừ chiêu armor) và nửa sau pha thu chiêu.
// Lệnh đến khi đang bận được giữ trong bộ đệm 0,25 giây (BUFFER) rồi tự ra khi rảnh tay.
// Hình ảnh chỉ đọc state + B.events (vòng chính rút ra mỗi khung hình), gọi vào đây qua issue().
// TÍCH HỢP: campaign gọi SBSim.create() với kit sinh từ S.gu / EN; khi B.over gọi win() hoặc die(c.n)
// của engine.js và đồng bộ S.hp ← actor.hp.
(function(root){
  const DT=1/60,X0=110,X1=890,Z1=240,BUFFER=.25,BODY=60,BODYZ=34;

  function create(kits,opt){
    opt=opt||{};
    const B={t:0,events:[],seq:0,over:null,rng:opt.rng||Math.random,actors:{},projs:[],zones:[]};
    B.actors.pn=actor('pn',kits.pn,300,Z1*.55,1);
    B.actors.bnb=actor('bnb',kits.bnb,680,Z1*.45,-1);
    B.actors.bnb.ai=true;
    return B;
  }
  function actor(id,kit,x,z,face){
    const sk={atk:kit.atk},uses={};
    kit.skills.forEach(s=>{sk[s.id]=s;if(s.uses)uses[s.id]=s.uses});
    return {id,kit,sk,uses,x,z,face,hp:kit.hp,maxHp:kit.hp,ess:kit.ess,maxEss:kit.ess,cd:{},
      state:'idle',since:0,act:null,move:null,chase:false,buffer:null,stopAt:-9,flashAt:-9,
      shield:null,slowUntil:0,bleed:null,poiseUntil:0,ai:false};
  }
  const other=(B,a)=>a.id==='pn'?B.actors.bnb:B.actors.pn;
  const free=a=>a.state==='idle'||a.state==='move';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function setState(a,s){a.state=s;a.since=0}
  function emit(B,e){e.t=B.t;B.events.push(e)}
  const totalT=s=>s.startup+s.active+s.recovery;

  // Tầm cận chiến: phía trước theo x, lệch chiều sâu nhỏ. loose: cho phép quay mặt lúc nhận lệnh.
  function inMelee(a,t,s,loose){
    const dx=t.x-a.x,dz=Math.abs(t.z-a.z),dir=loose?Math.sign(dx)||a.face:a.face;
    return dx*dir>=-10&&Math.abs(dx)<=s.range&&dz<=s.depth;
  }

  // Kiểm tra lệnh dùng chiêu; không trừ gì khi không hợp lệ. busy: đang bận (sẽ vào bộ đệm).
  function check(B,a,cmd){
    const s=a.sk[cmd.skill];
    if(B.over)return {ok:false,reason:'Trận đã kết thúc'};
    if(!s)return {ok:false,reason:'Không có chiêu này'};
    if(a.state==='ko')return {ok:false,reason:'Đã gục'};
    if(s.uses&&!(a.uses[s.id]>0))return {ok:false,reason:s.kind==='escape'?'Đã dùng trong trận này':'Hết '+s.n};
    if((a.cd[s.id]||0)>0)return {ok:false,reason:s.n+' đang hồi, còn '+a.cd[s.id].toFixed(1)+'s'};
    if((s.cost||0)>a.ess)return {ok:false,reason:'Thiếu chân nguyên ('+s.cost+')'};
    if(s.kind==='heal'&&a.hp>=a.maxHp)return {ok:false,reason:'Khí huyết đang đầy'};
    if(!free(a))return {ok:false,reason:'Đang ra chiêu',busy:true};
    return {ok:true};
  }

  // Huỷ chiêu đang ra bằng lệnh di chuyển: được khi đang lấy đà (chiêu không armor) hoặc đã qua nửa thu chiêu
  function cancelable(a){
    const A=a.act;if(!A)return false;const s=A.s;
    if(A.phase==='startup')return !s.armor;
    return A.phase==='recovery'&&A.t>=s.startup+s.active+s.recovery*.5;
  }
  function cancelAct(B,a){
    const A=a.act;if(A.zone)B.zones.splice(B.zones.indexOf(A.zone),1);
    emit(B,{type:'cancel',who:a.id,skill:A.s.id,hid:A.hid,phase:A.phase});
    a.act=null;setState(a,'idle');
  }
  // Lệnh: {skill:'move',x,z,cancel?} · {skill:'stop',cancel?} · {skill:'atk'} (đuổi tới tầm rồi đánh) · {skill:id,x,z} (điểm nhắm)
  function issue(B,id,cmd){
    const a=B.actors[id];if(!a||a.state==='ko'||B.over)return {ok:false,reason:'Không ra lệnh được'};
    if((cmd.skill==='move'||cmd.skill==='stop')&&cmd.cancel&&a.state==='act'&&cancelable(a))cancelAct(B,a);
    if(cmd.skill==='move'){
      if(!free(a)){a.buffer={cmd,until:B.t+BUFFER};return {ok:true,queued:true}}
      a.chase=false;a.move={x:clamp(cmd.x,X0,X1),z:clamp(cmd.z,0,Z1)};if(a.state!=='move')setState(a,'move');
      return {ok:true};
    }
    if(cmd.skill==='stop'){a.chase=false;a.buffer=null;if(a.state==='move'){a.move=null;setState(a,'idle')}return {ok:true}}
    const r=check(B,a,cmd);
    if(!r.ok){if(r.busy){a.buffer={cmd,until:B.t+(a.state==='hit'?Math.max(BUFFER,.32-a.since+.05):BUFFER)};return {ok:true,queued:true}}return r}
    const s=a.sk[cmd.skill],t=other(B,a);
    if(s.kind==='melee'&&!inMelee(a,t,s,true)){            // ngoài tầm cận chiến: đánh thường thì đuổi tới
      if(s.id!=='atk')return {ok:false,reason:'Ngoài tầm '+s.n};
      a.chase=true;a.move=null;if(a.state!=='move')setState(a,'move');return {ok:true,chasing:true};
    }
    if(s.kind==='grab'&&(Math.abs(t.x-a.x)>s.range||Math.abs(t.z-a.z)>s.depth))return {ok:false,reason:'Ngoài tầm '+s.n};
    if(s.kind==='aoe'&&Math.hypot(t.x-a.x,t.z-a.z)>s.castRange+s.radius)return {ok:false,reason:'Ngoài tầm '+s.n};
    start(B,a,s,cmd);return {ok:true};
  }
  function start(B,a,s,cmd){
    const t=other(B,a),ax=cmd.x??t.x,az=cmd.z??t.z;
    a.chase=false;a.move=null;a.buffer=null;
    if(s.uses)a.uses[s.id]--;                        // vật phẩm: mất ngay khi bắt đầu dùng
    if(s.kind!=='dash'&&s.kind!=='escape')a.face=Math.sign((s.kind==='proj'?ax:t.x)-a.x)||a.face;
    const A={s,t:0,phase:'startup',fired:false,hid:++B.seq,aim:{x:ax,z:az}};
    if(s.kind==='aoe'){                                     // vùng đặt tại vị trí mục tiêu lúc nhận lệnh
      const d=Math.hypot(t.x-a.x,t.z-a.z),k=d>s.castRange?s.castRange/d:1;
      A.zone={x:a.x+(t.x-a.x)*k,z:a.z+(t.z-a.z)*k,r:s.radius,owner:a.id,fireAt:B.t+s.startup,from:B.t,hid:A.hid,s};
      B.zones.push(A.zone);
    }
    if(s.kind==='dash'){const dx=ax-a.x,dz=az-a.z,d=Math.hypot(dx,dz)||1;A.vec={x:dx/d,z:dz/d}}
    if(s.kind==='escape'){const dir=Math.sign(a.x-t.x)||-a.face;A.vec={x:dir,z:(Z1/2-a.z)/Z1}}
    a.act=A;setState(a,'act');
    emit(B,{type:'act',who:a.id,skill:s.id,kind:s.kind});
  }

  function step(B){
    B.t+=DT;
    // Kết quả đã chốt: chỉ diễn hết clip ra chiêu / gục, không xử lý thêm đòn đánh.
    if(B.over){
      for(const a of Object.values(B.actors)){
        a.since+=DT;
        if(a.state==='act'&&a.act){
          const A=a.act,s=A.s;A.t+=DT;
          A.phase=A.t<s.startup?'startup':A.t<s.startup+s.active?'active':'recovery';
          if(A.t>=totalT(s)){a.act=null;afterFree(B,a)}
        }
      }
      return;
    }
    for(const a of Object.values(B.actors)){
      a.since+=DT;
      for(const k in a.cd)if(a.cd[k]>0)a.cd[k]=Math.max(0,a.cd[k]-DT);
      if(a.state!=='ko'&&!B.over)a.ess=Math.min(a.maxEss,a.ess+a.kit.essRegen*DT);
      if(a.shield&&B.t>=a.shield.until){a.shield=null;emit(B,{type:'shieldEnd',who:a.id})}
      if(a.bleed&&a.state!=='ko'){
        a.bleed.acc+=a.bleed.dps*DT;
        if(a.bleed.acc>=1){const n=Math.floor(a.bleed.acc);a.bleed.acc-=n;hurt(B,a,n,null,0,{dot:true})}
        if(a.bleed&&B.t>=a.bleed.until)a.bleed=null;
      }
      if(B.over)break;
      if(a.state==='move')stepMove(B,a);
      else if(a.state==='act')stepAct(B,a);
      else if(a.state==='hit'&&a.since>=.32){setState(a,'idle');afterFree(B,a)}
      if(a.state==='idle'&&!B.over&&a.since>.05){const t=other(B,a);if(Math.abs(t.x-a.x)>4)a.face=Math.sign(t.x-a.x)}
      if(a.buffer&&B.t>a.buffer.until)a.buffer=null;
      if(B.over)break;
    }
    if(B.over)return;
    stepProjs(B);if(B.over)return;
    stepZones(B);if(B.over)return;
    separate(B);
    if(typeof SBAI!=='undefined')SBAI.tick(B,DT);
  }
  function speedOf(B,a){return a.kit.speed*(a.slowUntil>B.t?a.slowF||.7:1)}
  function stepMove(B,a){
    const t=other(B,a);
    if(a.chase){
      if(t.state==='ko'){a.chase=false;setState(a,'idle');return}
      if(inMelee(a,t,a.sk.atk,true)){start(B,a,a.sk.atk,{});return}
      const side=Math.sign(a.x-t.x)||-a.face;a.move={x:clamp(t.x+side*a.sk.atk.range*.75,X0,X1),z:t.z};
    }
    const m=a.move;if(!m){setState(a,'idle');return}
    const dx=m.x-a.x,dz=m.z-a.z,d=Math.hypot(dx,dz),v=speedOf(B,a)*DT;
    if(Math.abs(dx)>2)a.face=Math.sign(dx);
    if(d<=v){a.x=m.x;a.z=m.z;if(a.chase)return;a.move=null;a.stopAt=B.t;setState(a,'idle');emit(B,{type:'arrive',who:a.id});afterFree(B,a)}
    else{a.x+=dx/d*v;a.z+=dz/d*v}
  }
  function stepAct(B,a){
    const A=a.act,s=A.s;A.t+=DT;
    if(A.phase==='startup'&&A.t>=s.startup){A.phase='active';fire(B,a)}
    if(A.phase==='active'){
      if(A.vec){const sp=s.dist/s.active*DT;a.x=clamp(a.x+A.vec.x*sp,X0,X1);a.z=clamp(a.z+A.vec.z*sp,0,Z1);if(Math.abs(A.vec.x)>.2&&s.kind==='dash')a.face=Math.sign(A.vec.x)}
      if(A.t>=s.startup+s.active)A.phase='recovery';
    }
    if(a.act&&A.t>=totalT(s)){a.act=null;setState(a,'idle');afterFree(B,a)}
  }
  // Phát đòn: đúng một lần mỗi act, mỗi đòn có id riêng (A.hid)
  function fire(B,a){
    const A=a.act,s=A.s,t=other(B,a);if(B.over||A.fired)return;A.fired=true;
    a.ess=Math.max(0,a.ess-(s.cost||0));if(s.cd)a.cd[s.id]=s.cd;     // trả giá lúc phát đòn
    emit(B,{type:'release',who:a.id,skill:s.id,kind:s.kind});
    if(s.kind==='melee'){
      if(t.state!=='ko'&&inMelee(a,t,s,false)){
        hurt(B,t,s.dmg,a,A.hid,{skill:s.id});
        if(s.slow){t.slowUntil=B.t+s.slow.dur;t.slowF=s.slow.f}
        if(s.bleed&&t.state!=='ko')t.bleed={dps:s.bleed.dps,until:B.t+s.bleed.dur,acc:0};
      }else emit(B,{type:'miss',who:a.id,skill:s.id});
    }else if(s.kind==='proj'){
      const dx=A.aim.x-a.x,dz=A.aim.z-a.z,d=Math.hypot(dx,dz)||1;
      B.events[B.events.length-1].origin={x:a.x+a.face*30,z:a.z};   // điểm phát của đạn cho FX/âm
      B.projs.push({owner:a.id,x:a.x+a.face*30,z:a.z,vx:dx/d*s.speed,vz:dz/d*s.speed,left:s.range,s,hid:A.hid,face:Math.sign(dx)||a.face});
    }else if(s.kind==='grab'){
      if(t.state!=='ko'&&Math.abs(t.x-a.x)<=s.range&&Math.abs(t.z-a.z)<=s.depth&&Math.sign(t.x-a.x)===a.face){
        hurt(B,t,s.dmg,a,A.hid,{skill:s.id});
        if(t.state!=='ko'){t.x=clamp(a.x+a.face*Math.max(BODY+6,Math.abs(t.x-a.x)-s.pull),X0,X1);t.z=a.z}
        emit(B,{type:'grab',who:a.id,target:t.id});
      }else emit(B,{type:'miss',who:a.id,skill:s.id});
    }else if(s.kind==='buff'){
      a.shield={id:s.id,red:s.red,until:B.t+s.dur,tint:s.tint};emit(B,{type:'shield',who:a.id,skill:s.id});
    }else if(s.kind==='heal'){
      const n=Math.min(s.amt,a.maxHp-a.hp);a.hp+=n;emit(B,{type:'heal',who:a.id,amount:n});
    }else if(s.kind==='escape'){
      a.bleed=null;a.slowUntil=0;emit(B,{type:'escape',who:a.id});
    }
    // aoe phát trong stepZones đúng lúc fireAt; dash/escape di chuyển trong pha active
  }
  function stepProjs(B){
    for(const p of [...B.projs]){
      const st=Math.hypot(p.vx,p.vz)*DT;p.x+=p.vx*DT;p.z+=p.vz*DT;p.left-=st;
      const t=p.owner==='pn'?B.actors.bnb:B.actors.pn;
      if(t.state!=='ko'&&Math.abs(t.x-p.x)<28&&Math.abs(t.z-p.z)<36){
        hurt(B,t,p.s.dmg,B.actors[p.owner],p.hid,{pierce:p.s.pierce,skill:p.s.id,contact:{x:p.x,z:p.z}});
        if(B.over)return;
        B.projs.splice(B.projs.indexOf(p),1);continue}
      if(p.left<=0||p.x<X0-40||p.x>X1+40){B.projs.splice(B.projs.indexOf(p),1);emit(B,{type:'projEnd',who:p.owner,x:p.x,z:p.z})}
    }
  }
  function stepZones(B){
    for(const z of [...B.zones]){
      const own=B.actors[z.owner];
      if(!own.act||own.act.zone!==z){B.zones.splice(B.zones.indexOf(z),1);emit(B,{type:'zoneCancel',who:z.owner});continue}   // chủ bị ngắt
      if(B.t>=z.fireAt){
        const t=other(B,own);
        if(t.state!=='ko'&&Math.hypot(t.x-z.x,(t.z-z.z)*1.6)<=z.r)hurt(B,t,z.s.dmg,own,z.hid,{skill:z.s.id});
        emit(B,{type:'zoneFire',who:z.owner,x:z.x,z:z.z,r:z.r});
        if(B.over)return;
        B.zones.splice(B.zones.indexOf(z),1);
      }
    }
  }
  function hurt(B,t,dmg,src,hid,o){
    if(B.over||t.state==='ko'||(hid&&t.lastHid===hid))return;
    if(hid)t.lastHid=hid;
    let d=dmg;if(t.shield&&!o.dot)d=Math.round(d*(1-t.shield.red*(1-(o.pierce||0))));
    t.hp=Math.max(0,t.hp-d);t.flashAt=B.t;
    emit(B,{type:'dmg',who:t.id,source:src?.id,skill:o.skill,hid,contact:o.contact||{x:t.x,z:t.z},amount:d,dot:!!o.dot,blocked:t.shield&&!o.dot?dmg-d:0,shield:t.shield&&!o.dot?t.shield.id:null});
    if(t.hp<=0){
      t.act=null;t.move=null;t.chase=false;t.buffer=null;t.bleed=null;setState(t,'ko');
      const w=other(B,t);B.over={winner:w.id,loser:t.id,at:B.t};
      B.projs.length=0;B.zones.length=0;
      w.bleed=null;w.buffer=null;
      if(w.state==='act')w.winPending=true;else{w.move=null;w.chase=false;setState(w,'win')}
      emit(B,{type:'ko',who:t.id});return;
    }
    if(o.dot)return;
    // khựng: ngắt chiêu đang ra; sau đó "vững thế" 0,6 giây không bị khựng tiếp (vẫn mất máu).
    // Đang thoát thân (Sương Yêu) hoặc chiêu có armor (chiêu lớn) thì không bị ngắt.
    if(B.t>=t.poiseUntil&&!(t.act&&(t.act.s.kind==='escape'||t.act.s.armor))){
      if(t.act)emit(B,{type:'interrupt',who:t.id,skill:t.act.s.id});
      t.act=null;t.move=null;t.chase=false;setState(t,'hit');t.poiseUntil=B.t+.32+.6;
    }
  }
  // Va chạm thân: hai người không đứng chồng lên nhau (đẩy ra theo trục x)
  function separate(B){
    const a=B.actors.pn,b=B.actors.bnb,dx=b.x-a.x,dz=Math.abs(b.z-a.z);
    if(a.state==='ko'||b.state==='ko'||dz>=BODYZ||Math.abs(dx)>=BODY)return;
    const dir=Math.sign(dx)||(a.face>0?1:-1),push=(BODY-Math.abs(dx))/2;
    a.x=clamp(a.x-dir*push,X0,X1);b.x=clamp(b.x+dir*push,X0,X1);
  }
  // Rảnh tay: người thắng sang tư thế win; lệnh trong bộ đệm được thực hiện
  function afterFree(B,a){
    if(a.winPending){a.winPending=false;setState(a,'win');a.move=null;return}
    if(a.ai)a.aiT=Math.min(a.aiT??0,.06);
    if(a.buffer&&B.t<=a.buffer.until){const c=a.buffer.cmd;a.buffer=null;issue(B,a.id,c)}
  }

  const SBSim={DT,X0,X1,Z1,BODY,create,issue,check,step,inMelee};
  if(typeof module!=='undefined')module.exports=SBSim;else root.SBSim=SBSim;
})(this);
