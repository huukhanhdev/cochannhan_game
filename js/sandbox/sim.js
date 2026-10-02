// Mô phỏng trận sandbox E: bước cố định 1/60 giây, không phụ thuộc hình ảnh (chạy được trong node).
// Thế giới: x ∈ [X0, X1] ngang, z ∈ [0, Z1] chiều sâu (0 = xa, Z1 = gần màn hình).
// Trận LUÔN chạy (không dừng khi chọn chiêu). Mỗi chiêu: startup → active (phát đúng một lần) → recovery.
// Chân nguyên và hồi chiêu trừ lúc PHÁT ĐÒN (release): huỷ khi đang lấy đà thì không mất gì (giả động tác).
// Lượt vật phẩm (uses) trừ lúc nhận lệnh: bị ngắt / tự huỷ vẫn mất. Di chuyển với cmd.cancel huỷ được
// pha lấy đà (trừ chiêu armor) và nửa sau pha thu chiêu. Tự huỷ sau CANCEL_FREE giây lấy đà mất 25% phí cổ;
// bị địch ngắt thì không mất phí.
// Lệnh đến khi đang bận được giữ trong bộ đệm 0,25 giây (BUFFER) rồi tự ra khi rảnh tay.
// Hình ảnh chỉ đọc state + B.events (vòng chính rút ra mỗi khung hình), gọi vào đây qua issue().
// TÍCH HỢP: campaign gọi SBSim.create() với kit sinh từ S.gu / EN; khi B.over gọi win() hoặc die(c.n)
// của engine.js và đồng bộ S.hp ← actor.hp.
(function(root){
  const DT=1/60,X0=110,X1=890,Z1=240,BUFFER=.25,BUFFER_MAX=.7,BODY=60,BODYZ=34,CANCEL_FREE=.15,CANCEL_FEE=.25;

  function create(kits,opt){
    opt=opt||{};
    const arena=Object.assign({width:1000,X0,X1,Z1},opt.arena||{});
    if(![arena.width,arena.X0,arena.X1,arena.Z1].every(Number.isFinite)||arena.X0<0||arena.X1<=arena.X0||arena.X1>arena.width||arena.Z1<=0)throw new Error('Cấu hình sân không hợp lệ');
    const ids=Object.assign({player:'pn',enemy:'bnb'},opt.ids||{});
    if(ids.player===ids.enemy)throw new Error('Hai actor phải khác id');
    const B={arena,ids,t:0,events:[],seq:0,over:null,rng:opt.rng||Math.random,actors:{},projs:[],zones:[]};
    const mid=(arena.X0+arena.X1)/2;
    B.actors[ids.player]=actor(ids.player,kits[ids.player]||kits.pn,clamp(mid-200,arena.X0,arena.X1),arena.Z1*.55,1);
    B.actors[ids.enemy]=actor(ids.enemy,kits[ids.enemy]||kits.bnb,clamp(mid+180,arena.X0,arena.X1),arena.Z1*.45,-1);
    B.actors[ids.enemy].ai=true;
    B.opponentOf=a=>B.actors[a.id===ids.player?ids.enemy:ids.player];
    return B;
  }
  function actor(id,kit,x,z,face){
    const sk={atk:kit.atk},uses={};
    kit.skills.forEach(s=>{sk[s.id]=s;if(s.uses)uses[s.id]=s.uses});
    return {id,kit,sk,uses,x,z,face,hp:kit.hp,maxHp:kit.hp,ess:kit.ess,maxEss:kit.ess,cd:{},
      state:'idle',since:0,act:null,move:null,chase:false,buffer:null,stopAt:-9,flashAt:-9,
      shield:null,empower:null,slowUntil:0,bleed:null,poiseUntil:0,ai:false};
  }
  const other=(B,a)=>B.opponentOf(a);
  const free=a=>a.state==='idle'||a.state==='move';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function setState(a,s){a.state=s;a.since=0}
  function emit(B,e){e.t=B.t;B.events.push(e)}
  const totalT=s=>s.startup+s.active+s.recovery;
  const GU_LOCK=2;
  // Đánh thường và lướt giữ nhịp riêng; lá hồi máu nằm trong nhóm action dùng cổ/vật phẩm.
  const guAction=s=>s.id!=='atk'&&s.kind!=='dash';

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

  // Thời gian giữ lệnh chờ khi đang bận: tối thiểu BUFFER, kéo tới lúc rảnh tay (+0,05s) nhưng không quá BUFFER_MAX.
  // Trước đây cố định 0,25s nên bấm đánh lần hai trong lúc thu chiêu 0,46s bị mất lệnh (cảm giác đánh tay bị trễ).
  function busyLeft(a){
    const left=a.state==='hit'?.32-a.since:a.act?totalT(a.act.s)-a.act.t:0;
    return Math.min(BUFFER_MAX,Math.max(BUFFER,left+.05));
  }
  // Huỷ chiêu đang ra bằng lệnh di chuyển: được khi đang lấy đà (chiêu không armor) hoặc đã qua nửa thu chiêu
  function cancelable(a){
    const A=a.act;if(!A)return false;const s=A.s;
    if(A.phase==='startup')return !s.armor;
    return A.phase==='recovery'&&A.t>=s.startup+s.active+s.recovery*.5;
  }
  function cancelAct(B,a){
    const A=a.act;if(A.zone){const i=B.zones.indexOf(A.zone);if(i>=0)B.zones.splice(i,1);}
    // Giả động tác: 0,15s đầu miễn phí (bấm nhầm, né phản xạ); sau đó mất 25% phí cổ. Chiêu đã phát thì phí đã trả.
    const fee=A.phase==='startup'&&A.t>CANCEL_FREE&&A.s.cost?Math.min(a.ess,A.s.cost*CANCEL_FEE):0;
    a.ess-=fee;
    emit(B,{type:'cancel',who:a.id,skill:A.s.id,hid:A.hid,phase:A.phase,fee});
    a.act=null;setState(a,'idle');
  }
  // Lệnh: {skill:'move',x,z,cancel?} · {skill:'stop',cancel?} · {skill:'atk'} (đuổi tới tầm rồi đánh) · {skill:id,x,z} (điểm nhắm)
  function issue(B,id,cmd){
    const {X0,X1,Z1}=B.arena;
    const a=B.actors[id];if(!a||a.state==='ko'||B.over)return {ok:false,reason:'Không ra lệnh được'};
    if((cmd.skill==='move'||cmd.skill==='stop')&&cmd.cancel&&a.state==='act'&&cancelable(a))cancelAct(B,a);
    if(cmd.skill==='move'){
      if(!free(a)){a.buffer={cmd,until:B.t+BUFFER};return {ok:true,queued:true}}
      a.chase=false;a.move={x:clamp(cmd.x,X0,X1),z:clamp(cmd.z,0,Z1)};if(a.state!=='move')setState(a,'move');
      return {ok:true};
    }
    if(cmd.skill==='stop'){a.chase=false;a.buffer=null;if(a.state==='move'){a.move=null;setState(a,'idle')}return {ok:true}}
    const r=check(B,a,cmd);
    if(!r.ok){if(r.busy){a.buffer={cmd,until:B.t+busyLeft(a)};return {ok:true,queued:true}}return r}
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
    const {X0,X1,Z1}=B.arena;
    const t=other(B,a),ax=cmd.x??t.x,az=cmd.z??t.z;
    a.chase=false;a.move=null;a.buffer=null;
    if(s.uses)a.uses[s.id]--;                        // vật phẩm: mất ngay khi bắt đầu dùng
    if(s.kind!=='dash'&&s.kind!=='escape')a.face=Math.sign((s.kind==='proj'?ax:t.x)-a.x)||a.face;
    const A={s,t:0,phase:'startup',fired:false,hid:++B.seq,aim:{x:ax,z:az}};
    if(s.kind==='proj'){const dx=ax-a.x,dz=az-a.z,n=Math.hypot(dx,dz)||1;A.telegraph={x:a.x,z:a.z,dx:dx/n,dz:dz/n,range:s.range,visibleAt:B.t}}
    if(s.kind==='aoe'){                                     // vùng đặt tại vị trí mục tiêu lúc nhận lệnh
      const d=Math.hypot(t.x-a.x,t.z-a.z),k=d>s.castRange?s.castRange/d:1;
      A.zone={x:a.x+(t.x-a.x)*k,z:a.z+(t.z-a.z)*k,r:s.radius,owner:a.id,fireAt:B.t+s.startup,from:B.t,hid:A.hid,s};
      B.zones.push(A.zone);
    }
    if(s.kind==='dash'){const dx=ax-a.x,dz=az-a.z,d=Math.hypot(dx,dz)||1;A.vec={x:dx/d,z:dz/d}}
    if(s.kind==='escape'){const dir=Math.sign(a.x-t.x)||-a.face;A.vec={x:dir,z:(Z1/2-a.z)/Z1}}
    a.act=A;setState(a,'act');
    emit(B,{type:'act',who:a.id,skill:s.id,kind:s.kind,hid:A.hid});
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
      if(a.state!=='ko'&&!B.over)stepEss(B,a);
      if(a.bleed&&a.state!=='ko'){
        a.bleed.acc+=a.bleed.dps*DT;
        if(a.bleed.acc>=1){const n=Math.floor(a.bleed.acc);a.bleed.acc-=n;hurt(B,a,n,null,0,{dot:true})}
        if(a.bleed&&B.t>=a.bleed.until)a.bleed=null;
      }
      if(a.empower&&B.t>=a.empower.until)endEmpower(B,a);
      if(B.over)break;
      if(a.state==='shell')stepShell(B,a);
      else if(a.state==='move')stepMove(B,a);
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
  // Phí duy trì theo thời gian thực của simulation: không thu phí lúc đang vận,
  // không thu vượt thời hạn và không hồi chân nguyên trong phần tick giáp còn bật.
  function stepEss(B,a){
    const sh=a.shield;let regenTime=DT;
    if(sh){
      const elapsed=Math.max(0,Math.min(B.t,sh.until)-sh.accountedAt);
      const upkeep=sh.upkeepPerSecond||0;
      const maintained=upkeep>0?Math.min(elapsed,a.ess/upkeep):elapsed;
      if(upkeep>0)a.ess=Math.max(0,a.ess-maintained*upkeep);
      if(sh.pauseEssRegen)regenTime=Math.max(0,DT-maintained);
      sh.accountedAt=Math.min(B.t,sh.until);
      if(B.t>=sh.until-1e-9||(upkeep>0&&a.ess<=1e-9)){
        a.shield=null;emit(B,{type:'shieldEnd',who:a.id,skill:sh.id,hid:sh.hid});
      }
    }
    a.ess=Math.min(a.maxEss,a.ess+a.kit.essRegen*regenTime);
  }
  // Sương Yêu hết hiệu lực: tự hại (khớp đông cứng) bằng làm chậm, ch137.
  function endEmpower(B,a){
    const E=a.empower;a.empower=null;
    if(E.after){a.slowUntil=B.t+E.after.dur;a.slowF=E.after.f}
    emit(B,{type:'empowerEnd',who:a.id,skill:E.id,hid:E.hid});
  }
  // Nổ Sương Yêu + tay phải (ch139): sự kiện truyện, không phải nút. Một lần; cổ mất (ch140).
  function detonate(B,t){
    const S=t.kit.story,o=other(B,t),hid=++B.seq;
    t.detonated=true;t.oneArm=true;delete t.sk.suongyeu;t.empower=null;
    t.act=null;t.move=null;t.chase=false;t.buffer=null;t.bleed=null;t.slowUntil=0;
    setState(t,'shell');t.shellUntil=B.t+S.shellDur;t.shellHeal=S.shellHeal/S.shellDur;
    if(t.shield)emit(B,{type:'shieldEnd',who:t.id,skill:t.shield.id,hid:t.shield.hid,reason:'replaced'});
    t.shield={hid,id:'vobang',n:'Vỏ băng',red:S.shellRed,until:t.shellUntil,tint:0xd8f4ff,accountedAt:B.t,upkeepPerSecond:0,pauseEssRegen:false};
    emit(B,{type:'detonate',who:t.id,hid,x:t.x,z:t.z});
    if(o.state!=='ko'){
      const dir=Math.sign(o.x-t.x)||-t.face;o.x=clamp(o.x+dir*S.knock,B.arena.X0,B.arena.X1);
      o.slowUntil=B.t+S.knockSlow.dur;o.slowF=S.knockSlow.f;
      // Chuyển pha truyện ngắt mọi action, kể cả armor: không giữ act trong state hit.
      if(o.act){emit(B,{type:'interrupt',who:o.id,skill:o.act.s.id,hid:o.act.hid});o.act=null}
      o.move=null;o.chase=false;o.buffer=null;setState(o,'hit');o.poiseUntil=B.t+.32+1.2;
    }
  }
  function stepShell(B,a){
    a.hp=Math.min(a.maxHp,a.hp+a.shellHeal*DT);
    if(B.t>=a.shellUntil){setState(a,'idle');emit(B,{type:'shellEnd',who:a.id});afterFree(B,a)}
  }
  function speedOf(B,a){return a.kit.speed*(a.slowUntil>B.t?a.slowF||.7:1)}
  function stepMove(B,a){
    const {X0,X1,Z1}=B.arena;
    const t=other(B,a);
    if(a.chase){
      if(t.state==='ko'){a.chase=false;setState(a,'idle');return}
      if(inMelee(a,t,a.sk.atk,true)){start(B,a,a.sk.atk,{});return}
      const side=Math.sign(a.x-t.x)||-a.face;a.move={x:clamp(t.x+side*a.sk.atk.range*.75,X0,X1),z:t.z};
    }
    const m=a.move;if(!m){setState(a,'idle');return}
    const dx=m.x-a.x,dz=m.z-a.z,d=Math.hypot(dx,dz),v=speedOf(B,a)*DT;
    if(Math.abs(dx)>2)a.face=Math.sign(dx);
    if(d<=v){a.x=m.x;a.z=m.z;if(a.chase)return;a.move=null;a.stopAt=B.t;setState(a,'idle');emit(B,{type:'arrive',who:a.id});afterFree(B,a,false)}
    else{a.x+=dx/d*v;a.z+=dz/d*v}
  }
  function stepAct(B,a){
    const {X0,X1,Z1}=B.arena;
    const A=a.act,s=A.s;A.t+=DT;
    if(A.phase==='startup'&&A.t>=s.startup){A.phase='active';fire(B,a)}
    if(a.act!==A)return; // thiếu phí tại release: act đã kết thúc, không chạy active
    if(A.phase==='active'){
      if(A.vec){const sp=s.dist/s.active*DT;a.x=clamp(a.x+A.vec.x*sp,X0,X1);a.z=clamp(a.z+A.vec.z*sp,0,Z1);if(Math.abs(A.vec.x)>.2&&s.kind==='dash')a.face=Math.sign(A.vec.x)}
      if(A.t>=s.startup+s.active)A.phase='recovery';
    }
    if(a.act&&A.t>=totalT(s)){a.act=null;setState(a,'idle');afterFree(B,a)}
  }
  // Phát đòn: đúng một lần mỗi act, mỗi đòn có id riêng (A.hid)
  function fire(B,a){
    const {X0,X1,Z1}=B.arena;
    const A=a.act,s=A.s,t=other(B,a);if(B.over||A.fired)return;
    const cost=s.cost||0;
    if(a.ess+1e-9<cost){
      if(A.zone){const i=B.zones.indexOf(A.zone);if(i>=0)B.zones.splice(i,1);
        emit(B,{type:'zoneCancel',who:a.id,skill:s.id,hid:A.hid});}
      emit(B,{type:'fizzle',who:a.id,skill:s.id,hid:A.hid,reason:'Thiếu chân nguyên lúc phát chiêu'});
      a.act=null;setState(a,'idle');afterFree(B,a);return;
    }
    A.fired=true;
    a.ess=Math.max(0,a.ess-cost);if(s.cd)a.cd[s.id]=s.cd;     // trả giá lúc phát đòn
    if(guAction(s))for(const next of Object.values(a.sk)){
      if(next.id===s.id||!guAction(next)||(next.uses&&!(a.uses[next.id]>0)))continue;
      // Chỉ cổ đang sẵn sàng nhận khóa; không kéo dài/rút ngắn cooldown đang chạy.
      if(!(a.cd[next.id]>0))a.cd[next.id]=GU_LOCK;
    }
    emit(B,{type:'release',who:a.id,skill:s.id,kind:s.kind,hid:A.hid});
    if(s.kind==='melee'){
      if(t.state!=='ko'&&inMelee(a,t,s,false)){
        hurt(B,t,s.dmg,a,A.hid,{skill:s.id,light:!!s.light});
        if(s.slow&&t.state!=='shell'){t.slowUntil=B.t+s.slow.dur;t.slowF=s.slow.f}
        if(s.bleed&&t.state!=='ko'&&t.state!=='shell')t.bleed={dps:s.bleed.dps,until:B.t+s.bleed.dur,acc:0};
      }else emit(B,{type:'miss',who:a.id,skill:s.id});
    }else if(s.kind==='proj'){
      const dx=A.telegraph?.dx??(A.aim.x-a.x),dz=A.telegraph?.dz??(A.aim.z-a.z),d=Math.hypot(dx,dz)||1;
      B.events[B.events.length-1].origin={x:a.x+a.face*30,z:a.z};   // điểm phát của đạn cho FX/âm
      B.projs.push({owner:a.id,x:a.x+a.face*30,z:a.z,vx:dx/d*s.speed,vz:dz/d*s.speed,left:s.range,s,hid:A.hid,face:Math.sign(dx)||a.face});
    }else if(s.kind==='grab'){
      if(t.state!=='ko'&&Math.abs(t.x-a.x)<=s.range&&Math.abs(t.z-a.z)<=s.depth&&Math.sign(t.x-a.x)===a.face){
        hurt(B,t,s.dmg,a,A.hid,{skill:s.id});
        // Vỏ băng/chuyển pha giữ vị trí; không kéo ngược lại sau knockback của detonate().
        if(t.state!=='ko'&&t.state!=='shell'){
          t.x=clamp(a.x+a.face*Math.max(BODY+6,Math.abs(t.x-a.x)-s.pull),X0,X1);t.z=a.z;
          emit(B,{type:'grab',who:a.id,target:t.id});
        }
      }else emit(B,{type:'miss',who:a.id,skill:s.id});
    }else if(s.kind==='buff'){
      if(a.shield)emit(B,{type:'shieldEnd',who:a.id,skill:a.shield.id,hid:a.shield.hid,reason:'replaced'});
      a.shield={hid:A.hid,id:s.id,red:s.red,until:B.t+s.dur,tint:s.tint,
        accountedAt:B.t,upkeepPerSecond:s.upkeepPerSecond||0,pauseEssRegen:!!s.pauseEssRegen};
      emit(B,{type:'shield',who:a.id,skill:s.id,hid:A.hid});
    }else if(s.kind==='empower'){
      a.empower={hid:A.hid,id:s.id,until:B.t+s.dur,mul:s.dmgMul||1,pierce:s.pierce||0,after:s.after||null};
      emit(B,{type:'empower',who:a.id,skill:s.id,hid:A.hid});
    }else if(s.kind==='heal'){
      const n=Math.min(s.amt,a.maxHp-a.hp);a.hp+=n;emit(B,{type:'heal',who:a.id,skill:s.id,hid:A.hid,amount:n});
    }else if(s.kind==='escape'){
      a.bleed=null;a.slowUntil=0;emit(B,{type:'escape',who:a.id,skill:s.id,hid:A.hid});
    }
    // aoe phát trong stepZones đúng lúc fireAt; dash/escape di chuyển trong pha active
  }
  function stepProjs(B){
    const {X0,X1,Z1}=B.arena;
    for(const p of [...B.projs]){
      if(p.s.turn){                                   // đạn tự đuổi (Lam Điểu): lượn về mục tiêu với góc quay giới hạn
        const tg=other(B,B.actors[p.owner]),sp=Math.hypot(p.vx,p.vz),cur=Math.atan2(p.vz,p.vx);
        let d=Math.atan2(tg.z-p.z,tg.x-p.x)-cur;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
        const n=cur+Math.max(-p.s.turn*DT,Math.min(p.s.turn*DT,d));p.vx=Math.cos(n)*sp;p.vz=Math.sin(n)*sp;p.face=Math.sign(p.vx)||p.face;
      }
      const st=Math.hypot(p.vx,p.vz)*DT;p.x+=p.vx*DT;p.z+=p.vz*DT;p.left-=st;
      const t=other(B,B.actors[p.owner]);
      if(t.state!=='ko'&&Math.abs(t.x-p.x)<28&&Math.abs(t.z-p.z)<36){
        hurt(B,t,p.s.dmg,B.actors[p.owner],p.hid,{pierce:p.s.pierce,skill:p.s.id,contact:{x:p.x,z:p.z}});
        if(p.s.slow&&t.state!=='ko'&&t.state!=='shell'){t.slowUntil=B.t+p.s.slow.dur;t.slowF=p.s.slow.f}
        if(B.over)return;
        B.projs.splice(B.projs.indexOf(p),1);continue}
      if(p.left<=0||p.x<X0-40||p.x>X1+40){B.projs.splice(B.projs.indexOf(p),1);emit(B,{type:'projEnd',who:p.owner,x:p.x,z:p.z})}
    }
  }
  function stepZones(B){
    for(const z of [...B.zones]){
      const own=B.actors[z.owner];
      if(!own.act||own.act.zone!==z){B.zones.splice(B.zones.indexOf(z),1);emit(B,{type:'zoneCancel',who:z.owner,skill:z.s.id,hid:z.hid});continue}   // chủ bị ngắt
      if(B.t>=z.fireAt){
        const t=other(B,own);
        if(t.state!=='ko'&&Math.hypot(t.x-z.x,(t.z-z.z)*1.6)<=z.r)hurt(B,t,z.s.dmg,own,z.hid,{skill:z.s.id});
        emit(B,{type:'zoneFire',who:z.owner,skill:z.s.id,hid:z.hid,x:z.x,z:z.z,r:z.r});
        if(B.over)return;
        B.zones.splice(B.zones.indexOf(z),1);
      }
    }
  }
  function hurt(B,t,dmg,src,hid,o){
    if(B.over||t.state==='ko'||(hid&&t.lastHid===hid))return;
    if(hid)t.lastHid=hid;
    const E=!o.dot&&src?.empower,pierce=Math.max(o.pierce||0,E?E.pierce:0);
    let d=E?Math.round(dmg*E.mul):dmg;if(t.shield&&!o.dot)d=Math.round(d*(1-t.shield.red*(1-pierce)));
    const S=t.kit.story,blast=S&&!t.detonated&&t.sk.suongyeu&&t.hp-d<=t.maxHp*S.detonateAt;
    t.hp=Math.max(blast?1:0,t.hp-d);t.flashAt=B.t;
    emit(B,{type:'dmg',who:t.id,source:src?.id,skill:o.skill,hid,contact:o.contact||{x:t.x,z:t.z},amount:d,dot:!!o.dot,blocked:t.shield&&!o.dot?dmg-d:0,shield:t.shield&&!o.dot?t.shield.id:null});
    if(blast){detonate(B,t);return}
    if(t.hp<=0){
      t.act=null;t.move=null;t.chase=false;t.buffer=null;t.bleed=null;setState(t,'ko');
      const w=other(B,t);B.over={winner:w.id,loser:t.id,at:B.t,retreat:!!t.kit.story?.retreatOnDefeat};
      B.projs.length=0;B.zones.length=0;
      w.bleed=null;w.buffer=null;
      if(w.state==='act')w.winPending=true;else{w.move=null;w.chase=false;setState(w,'win')}
      emit(B,{type:'ko',who:t.id});return;
    }
    if(o.dot)return;
    // khựng: ngắt chiêu đang ra; sau đó "vững thế" 1,2 giây không bị khựng tiếp (vẫn mất máu).
    // Đang thoát thân (Sương Yêu) hoặc chiêu có armor (chiêu lớn) thì không bị ngắt.
    // Đòn nhẹ (light: đấm tay không) gây sát thương nhưng không làm khựng, tránh khóa cứng bằng spam đấm nhanh.
    if(!o.light&&t.state!=='shell'&&B.t>=t.poiseUntil&&!(t.act&&(t.act.s.kind==='escape'||t.act.s.armor))){
      if(t.act)emit(B,{type:'interrupt',who:t.id,skill:t.act.s.id,hid:t.act.hid});
      t.act=null;t.move=null;t.chase=false;setState(t,'hit');t.poiseUntil=B.t+.32+1.2;
    }
  }
  // Va chạm thân: hai người không đứng chồng lên nhau (đẩy ra theo trục x)
  function separate(B){
    const {X0,X1,Z1}=B.arena;
    const a=B.actors[B.ids.player],b=B.actors[B.ids.enemy],dx=b.x-a.x,dz=Math.abs(b.z-a.z);
    if(a.state==='ko'||b.state==='ko'||dz>=BODYZ||Math.abs(dx)>=BODY)return;
    const dir=Math.sign(dx)||(a.face>0?1:-1),push=(BODY-Math.abs(dx))/2;
    a.x=clamp(a.x-dir*push,X0,X1);b.x=clamp(b.x+dir*push,X0,X1);
  }
  // Rảnh tay: người thắng sang tư thế win; lệnh trong bộ đệm được thực hiện
  function afterFree(B,a,wakeAI=true){
    if(a.winPending){a.winPending=false;setState(a,'win');a.move=null;return}
    if(a.ai&&wakeAI)a.aiT=Math.min(a.aiT??0,.06);
    if(a.buffer&&B.t<=a.buffer.until){const c=a.buffer.cmd;a.buffer=null;issue(B,a.id,c)}
  }

  const ARENAS=Object.freeze({classic:Object.freeze({width:1000,X0:110,X1:890,Z1:240}),wide:Object.freeze({width:1200,X0:110,X1:1090,Z1:260})});
  const SBSim={ARENAS,DT,X0,X1,Z1,BODY,GU_LOCK,CANCEL_FREE,CANCEL_FEE,create,issue,check,step,inMelee};
  if(typeof module!=='undefined')module.exports=SBSim;else root.SBSim=SBSim;
})(this);
