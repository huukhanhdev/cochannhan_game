// Máy điều khiển Bạch Ngưng Băng: kiêu ngạo, thích áp sát (ch 133–135). Nghĩ mỗi ~0,4 giây, không
// phản xạ từng khung hình. a.intent dùng để hiện biểu tượng ý đồ trên đầu.
// Thứ tự: né Nguyệt Mang đang lấy đà → bật Sương Yêu (tăng công) khi sắp vào tầm → Lốc băng nhận →
// Thủy Tráo khi bị dồn → băng nhận khi trong tầm → áp sát.
// TÍCH HỢP: giữ nguyên file; campaign chọn mức khó qua SBAI.level.
(function(root){
  const LEVEL={
    de:{think:.6,jitter:.25,dodge:.15,dmgK:.85,gap:.15},
    // Thường/Khó/Cao thủ dùng bộ não đánh có chủ đích (smart), khác nhau ở phản xạ, nhịp nghĩ và độ né.
    thuong:{think:.3,jitter:.1,dodge:.45,dmgK:1,gap:.35,react:.35,smart:true},
    kho:{think:.2,jitter:.06,dodge:.7,dmgK:1.2,gap:.5,react:.28,smart:true},
    // Cao thủ: KHÔNG tăng máu/sát thương/tốc độ (dmgK 1 như Thường). Chỉ đánh khôn hơn, xem smart().
    cao:{think:.16,jitter:.05,dodge:.85,dmgK:1,gap:.6,react:.25,smart:true}};
  // Bộ não BNB "đánh có chủ đích" (Thường/Khó/Cao thủ, khác nhau ở react/think). Chỉ đọc thứ người chơi cũng thấy:
  // động tác đã hiện ≥ react giây, vệt đạn công khai, vị trí/vận tốc quan sát được. Không đọc con trỏ/đích đi/lệnh chưa phát.
  //  · PN đứng yên → tiến vào đánh. PN trong tầm → đánh thường. PN đi lại ngoài tầm → giữ chỗ (chỉ chỉnh khi lệch nhiều),
  //    phun Lam Điểu, cắt đường khi bị thả diều. Không bám theo từng bước.
  //  · Chỉ tiếp cận khi có lý do: PN tự bước vào tầm Băng nhận; PN kẹt trong vận/thu chiêu đủ lâu; PN bị chậm/khựng;
  //    PN bị dồn sát biên; hoặc quá IMPATIENT giây không ai trúng đòn (kiêu ngạo, ch134).
  //  · Đánh xong (trúng hay trượt) thì lùi về thế đứng, không đánh liên hoàn.
  //  · Đang lấy đà mà PN đã ra khỏi ô báo → huỷ (giả động tác, phí 0). Lúc nóng vội, mỗi đòn có COMMIT xác suất vung thật.
  //  · Lốc chỉ khi PN không kịp chạy khỏi vòng (kẹt/chậm), hoặc lúc nóng vội. Né đòn đã lộ; không kịp thì Thủy Tráo.
  const ENV=typeof process!=='undefined'&&process.env||{},IMPATIENT=+(ENV.SB_IMP||6),COMMIT=+(ENV.SB_COMMIT||.4),STANDOFF=50,BACKOFF=.9;
  function smart(B,a,t,L,Sim,vx,vz){
    const {X0,X1,Z1}=B.arena,ok=id=>a.sk[id]&&Sim.check(B,a,{skill:id}).ok,clampX=x=>Math.max(X0,Math.min(X1,x)),clampZ=z=>Math.max(0,Math.min(Z1,z));
    const dist=Math.hypot(t.x-a.x,t.z-a.z),side=Math.sign(t.x-a.x)||a.face,atk=a.sk.atk,stand=a.kit.ai?.stand??atk.range+STANDOFF;
    const ta=t.act,seen=!!ta&&ta.t>=L.react;
    const left=ta?ta.s.startup+ta.s.active+ta.s.recovery-ta.t:0;
    const locked=seen&&ta.s.kind!=='dash'&&left>=.35;
    const slowed=t.slowUntil>B.t+.35,tSpeed=t.kit.speed*(slowed?(t.slowF||.7):1);
    if(a.hpSeen!==a.hp||t.hpSeen!==t.hp||a.calmFrom==null){a.hpSeen=a.hp;t.hpSeen=t.hp;a.calmFrom=B.t}
    const impatient=B.t-a.calmFrom>IMPATIENT;
    if(a.state==='act'){
      const A=a.act;if(A.s.id!=='atk')return;
      if(A.phase!=='startup'){a.backoffUntil=B.t+BACKOFF;return}
      if(impatient&&a.coinHid!==A.hid){a.coinHid=A.hid;a.commit=B.rng()<COMMIT}
      const commit=impatient&&a.coinHid===A.hid&&a.commit;
      if(!commit&&A.t>=L.react&&!Sim.inMelee(a,t,A.s,false)){
        a.intent='near';a.backoffUntil=B.t+BACKOFF*.5;Sim.issue(B,a.id,{skill:'move',x:clampX(t.x-side*stand),z:t.z,cancel:true});
      }
      return;
    }
    if(a.state!=='idle'&&a.state!=='move')return;
    // Né
    if(seen&&ta.phase==='startup'&&(ta.s.kind==='melee'||ta.s.kind==='grab')&&Sim.inMelee(t,a,ta.s,false)){
      if(ta.s.startup-ta.t<.22&&ok('thuytrao')&&!a.shield){a.intent='guard';Sim.issue(B,a.id,{skill:'thuytrao'});return}
      if(a.evadeHid!==ta.hid){a.evadeHid=ta.hid;a.evadeZ=clampZ(t.z+(a.z>Z1/2?-1:1)*(ta.s.depth+30))}
      a.intent='dodge';Sim.issue(B,a.id,{skill:'move',x:clampX(a.x-side*30),z:a.evadeZ});return;
    }
    const q=ta?.telegraph;
    if(q&&ta.phase==='startup'&&B.t-q.visibleAt>=L.react){
      const dx=a.x-q.x,dz=a.z-q.z;
      if(dx*q.dx+dz*q.dz>=0&&Math.abs(dx*q.dz-dz*q.dx)<55){
        const nz=clampZ(a.z+(a.z>Z1/2?-1:1)*110);a.intent='dodge';
        if(ok('dash')&&B.rng()<L.dodge)Sim.issue(B,a.id,{skill:'dash',x:a.x+side*40,z:nz});else Sim.issue(B,a.id,{skill:'move',x:a.x,z:nz});
        return;
      }
    }
    // Phong cách theo nhân vật (kit.ai.style). BNB không khai báo nên đi đường cũ (trace baseline giữ nguyên).
    if(a.kit.ai?.style&&!(typeof process!=='undefined'&&process.env&&process.env.SB_NOSTYLE)&&styleAct(B,a,t,L,Sim,ok,dist,stand))return;
    // Lốc khi PN không kịp thoát vòng (hoặc nóng vội)
    const lc=a.sk.locbangnhan;
    if(lc&&ok('locbangnhan')&&dist<=lc.castRange){
      const escape=(locked?left:0)+.3+lc.radius/tSpeed;
      if((escape>=lc.startup&&(locked||slowed))||(impatient&&B.rng()<.35)){a.lastBig=B.t;a.intent='big';Sim.issue(B,a.id,{skill:'locbangnhan'});return}
    }
    const sy=a.sk.suongyeu;
    if(sy&&ok('suongyeu')&&!a.empower&&!locked&&dist<stand+60&&a.ess>=sy.cost+(lc?.cost||0)&&(impatient||B.rng()<.25)){
      a.intent='power';Sim.issue(B,a.id,{skill:'suongyeu'});return}
    if(tagged(B,a,t,Sim,ok,dist,stand))return;
    const inRange=Sim.inMelee(a,t,atk,true)&&Math.abs(t.z-a.z)<atk.depth*.8;
    // Vững thế (không bị ngắt) còn đủ cho cả pha lấy đà: đổi đòn có lợi (24 so với 13).
    const poised=a.poiseUntil>B.t+atk.startup;
    // Phạt: PN kẹt đủ lâu để Băng nhận phát trước khi PN rảnh tay; hoặc PN đang chậm/khựng.
    // PN lộ ra đang vận hồi máu / bật hộ thể: lướt vào ép, buộc chọn chỗ an toàn mới dùng.
    // Đang hấp thu nguyên thạch cũng là sơ hở công khai (thấy được bằng mắt, như vận hồi máu): áp sát để làm đứt.
    const exposed=seen&&ta.phase==='startup'&&(ta.s.kind==='heal'||ta.s.kind==='buff')||(t.absorb&&B.t-(t.absorb.until-t.kit.skills.find(x=>x.id===t.absorb.id).dur)>=L.react);
    const punish=(locked&&left>=atk.startup+.05)||slowed||t.state==='hit'||exposed;
    if(punish){
      if(inRange){a.intent='melee';Sim.issue(B,a.id,{skill:'atk'});return}
      const gx=clampX(t.x-side*atk.range*.7);
      if(a.sk.dash&&dist<a.sk.dash.dist+atk.range&&ok('dash')){a.intent='near';Sim.issue(B,a.id,{skill:'dash',x:gx,z:t.z});return}
      a.intent='near';Sim.issue(B,a.id,{skill:'move',x:gx,z:t.z});return;
    }
    const sp=Math.hypot(vx,vz),away=sp>40&&(vx*(t.x-a.x)+vz*(t.z-a.z))/Math.max(1,dist)>40;
    const toward=sp>40&&(vx*(a.x-t.x)+vz*(a.z-t.z))/Math.max(1,dist)>40;
    if(inRange&&poised){a.intent='melee';Sim.issue(B,a.id,{skill:'atk'});return}
    // Trong tầm Băng nhận thì đánh thường (trừ lúc vừa đánh xong). Không lùi trước PN đứng yên hay đi tới:
    // đòn PN đã lộ thì phần Né ở trên xử lý; nếu PN né được đòn của mình thì bước 0 huỷ.
    if(inRange&&B.t>=(a.backoffUntil||0)){a.intent='melee';Sim.issue(B,a.id,{skill:'atk'});return}
    const idle=sp<40&&!ta;                                   // PN đứng yên, không ra chiêu
    const edge=t.x<X0+140?-1:t.x>X1-140?1:0;
    // PN đứng yên, bị dồn biên hoặc mình đã nóng vội: tiến vào đánh, không đứng nhìn.
    if((idle||impatient||edge)&&B.t>=(a.backoffUntil||0)){
      const gx=clampX(t.x-side*atk.range*.75);
      if(dist>stand+40&&ok('dash')&&B.rng()<L.gap){a.intent='near';Sim.issue(B,a.id,{skill:'dash',x:gx,z:t.z});return}
      a.intent='near';Sim.issue(B,a.id,{skill:'move',x:gx,z:t.z});return;
    }
    // PN đang đi lại ngoài tầm: Lam Điểu gây áp lực, giữ chân nguyên cho một Lốc.
    const ld=a.sk.lamdieu;
    if(ld&&ok('lamdieu')&&dist>=stand&&dist<ld.range*.8&&a.ess>=ld.cost+(lc?.cost||0)&&B.rng()<.45){
      a.intent='big';Sim.issue(B,a.id,{skill:'lamdieu',x:t.x,z:t.z});return}
    // PN thả diều xa: cắt đường, không bám sát từng bước.
    if(away&&dist>stand+150&&ok('dash')&&B.rng()<L.gap*.5){
      a.intent='near';Sim.issue(B,a.id,{skill:'dash',x:clampX(t.x+vx*.4-side*stand),z:clampZ(t.z+vz*.4)});return}
    // Còn lại: giữ chỗ. Chỉ chỉnh vị trí khi lệch nhiều (không bám theo mỗi bước của PN).
    const gx=clampX(t.x-side*stand),gz=clampZ(t.z);
    a.intent='near';
    if(Math.abs(a.x-gx)<=70&&Math.abs(a.z-gz)<=60){if(a.state==='move')Sim.issue(B,a.id,{skill:'stop'});return}
    Sim.issue(B,a.id,{skill:'move',x:gx,z:gz});
  }
  // ── Phong cách AI ──
  // charge (thú lao húc, vd Heo rừng VN ch.70–71): canh thẳng hàng → lao theo đợt → lùi lấy đà; đổi hướng kém nên không
  //   bám đuổi từng bước. Trọng thương (<30%) thì hung dữ hơn: bỏ pha lùi (ch.71 "càng điên cuồng").
  // midrange (Phương Chính ch.83: áp sát còn sáu thước rồi mới bắn): giữ tầm trung, bật hộ thể trước khi vận chiêu
  //   nếu đối thủ đã sát người, lộn người né đạn (nhánh Né chung đã lo phần đạn).
  function styleAct(B,a,t,L,Sim,ok,dist,stand){
    const {X0,X1,Z1}=B.arena,side=Math.sign(t.x-a.x)||a.face,clampX=x=>Math.max(X0,Math.min(X1,x)),clampZ=z=>Math.max(0,Math.min(Z1,z));
    const st=a.style||(a.style={phase:'line',until:0}),style=a.kit.ai.style,dz=Math.abs(t.z-a.z);
    const go=(x,z,intent)=>{a.intent=intent||'near';Sim.issue(B,a.id,{skill:'move',x:clampX(x),z:clampZ(z)});return true};
    if(style==='charge'){
      const R=Object.values(a.sk).find(s=>s.kind==='rush'),wounded=a.hp<a.maxHp*.3;
      if(st.phase==='back'&&B.t<st.until&&!wounded){if(dist<240)return go(a.x-side*90,a.z);return false}
      st.phase='line';
      if(R&&ok(R.id)){
        if(dist>=150&&dist<=R.dist*.9&&dz<R.depth*.6){a.intent='big';Sim.issue(B,a.id,{skill:R.id,x:t.x,z:t.z});
          st.phase='back';st.until=B.t+R.startup+R.active+R.recovery+.9;return true}
        if(dist<150)return go(a.x-side*120,t.z);                       // quá gần để lấy đà: lùi ra
        return go(t.x-side*Math.min(R.dist*.7,Math.max(200,dist)),t.z);  // canh thẳng hàng theo chiều sâu
      }
      return false;                                                     // lao đang hồi: để nhánh chung đánh thường/giữ tầm
    }
    if(style==='tester'){                                     // hình nộm thử trạng thái: lần lượt bắn mọi chiêu có applies
      const S=Object.values(a.sk).find(s=>s.applies&&ok(s.id));
      if(S){a.intent='big';Sim.issue(B,a.id,{skill:S.id,x:t.x,z:t.z});return true}
      return false;
    }
    if(style==='midrange'){
      const P=Object.values(a.sk).filter(s=>s.tags?.includes('poke')),G=Object.values(a.sk).find(s=>s.tags?.includes('guard'));
      const readyP=P.find(s=>ok(s.id));
      if(readyP&&dist<130&&G&&ok(G.id)&&!a.shield){a.intent='guard';Sim.issue(B,a.id,{skill:G.id});return true}
      if(readyP&&dist>=120&&dist<=Math.min(340,readyP.range*.7)){a.intent='big';Sim.issue(B,a.id,{skill:readyP.id,x:t.x,z:t.z});return true}
      if(dist>340)return go(t.x-side*stand,t.z);
      if(dist<100&&!Sim.inMelee(a,t,a.sk.atk,true))return go(a.x-side*80,a.z);
      return false;
    }
    return false;
  }
  // Chiêu của roster mới khai báo tags (vai trò); BNB cũ không có tags nên không đi qua đây (giữ nguyên trace).
  // Mỗi tag một điều kiện dùng đơn giản; thứ tự theo thứ tự chiêu trong kit. Không đọc con trỏ/đích đi của đối thủ.
  function tagged(B,a,t,Sim,ok,dist,stand){
    const list=a.tagSkills||(a.tagSkills=Object.values(a.sk).filter(s=>s.tags&&s.tags.length));
    if(!list.length)return false;
    const dz=Math.abs(t.z-a.z),low=a.hp<a.maxHp*.65;
    for(const s of list){
      if(!ok(s.id))continue;
      const has=k=>s.tags.includes(k);let go=false;
      if(s.kind==='absorb')go=!a.absorb&&a.ess<a.maxEss*.35&&dist>220;
      else if(has('heal'))go=a.hp<a.maxHp*.45&&dist>150;
      else if(has('guard'))go=low&&!a.shield&&dist<220&&B.rng()<.5;
      else if(has('power'))go=!a.empower&&!a.transform&&dist<stand+60&&B.rng()<.3;
      else if(s.kind==='transform')go=!a.transform&&dist<stand+120&&B.rng()<.4;
      else if(s.kind==='rush')go=dist>=a.sk.atk.range+30&&dist<=s.dist*.95&&dz<s.depth+20&&B.rng()<.5;
      else if(s.kind==='proj')go=dist>=stand&&dist<s.range*.8&&B.rng()<.45;
      else if(s.kind==='melee'||s.kind==='grab')go=Sim.inMelee(a,t,s,true)&&dz<(s.depth||40)*.8&&B.rng()<.5;
      else if(s.kind==='aoe')go=dist<=s.castRange&&B.rng()<.35;
      if(!go)continue;
      a.intent=has('guard')?'guard':has('heal')?'guard':s.kind==='rush'?'near':'big';
      if(Sim.issue(B,a.id,{skill:s.id,x:t.x,z:t.z}).ok)return true;
    }
    return false;
  }
  const SBAI={level:'thuong',LEVEL,
    tick(B,dt){
      const Sim=root.SBSim;
      for(const a of Object.values(B.actors)){
        if(!a.ai||a.state==='ko'||B.over)continue;
        a.aiT=(a.aiT??.6)-dt;if(a.aiT>0)continue;
        const L=LEVEL[SBAI.level]||LEVEL.thuong;
        const pressure=B.aiMode!=='legacy';
        a.aiT=(pressure&&SBAI.level==='thuong'?.28:L.think)+B.rng()*(pressure&&SBAI.level==='thuong'?.1:L.jitter);
        const t=B.opponentOf(a),{X0,X1,Z1}=B.arena;
        if(t.state==='ko'||a.state==='shell')continue;
        const dist=Math.hypot(t.x-a.x,t.z-a.z),ok=id=>a.sk[id]&&Sim.check(B,a,{skill:id}).ok;
        // né: đối thủ đang lấy đà đạn nhắm về phía mình
        const ta=t.act,prev=a.observation;
        const elapsed=prev?B.t-prev.t:0;
        let vx=elapsed>0?(t.x-prev.x)/elapsed:0,vz=elapsed>0?(t.z-prev.z)/elapsed:0;
        const speed=Math.hypot(vx,vz);if(speed>t.kit.speed){vx*=t.kit.speed/speed;vz*=t.kit.speed/speed}
        a.observation={x:t.x,z:t.z,t:B.t};
        if(L.smart){smart(B,a,t,L,Sim,vx,vz);continue}
        const advanced=B.aiMode!=='legacy';
        // Boss Khó đọc động tác đã diễn ra, không tự né trước khi có cảnh báo.
        // Lách khỏi đòn rết/chộp rồi trở lại đánh; giữ một đích né cho mỗi hid, tránh zigzag.
        if((SBAI.level==='kho'||(advanced&&SBAI.level==='thuong'&&B.rng()<L.dodge))&&(a.state==='idle'||a.state==='move')&&ta&&ta.phase==='startup'&&ta.t>=.2&&
          (ta.s.kind==='melee'||ta.s.kind==='grab')&&Sim.inMelee(t,a,ta.s,false)){
          if(a.evadeHid!==ta.hid){a.evadeHid=ta.hid;a.evadeZ=Math.max(0,Math.min(Z1,t.z+(a.z>Z1/2?-1:1)*(ta.s.depth+30)))}
          a.intent='dodge';Sim.issue(B,a.id,{skill:'move',x:a.x,z:a.evadeZ});continue;
        }
        const q=ta?.telegraph,dx=q?a.x-q.x:0,dz=q?a.z-q.z:0;
        if(ta&&ta.phase==='startup'&&q&&B.t-q.visibleAt>=.15&&dx*q.dx+dz*q.dz>=0&&Math.abs(dx*q.dz-dz*q.dx)<50&&ok('dash')&&B.rng()<L.dodge){
          const dz=a.z>Z1/2?-1:1;a.intent='dodge';Sim.issue(B,a.id,{skill:'dash',x:a.x-Math.sign(t.x-a.x)*30,z:a.z+dz*160});continue}
        if(a.state!=='idle'&&a.state!=='move')continue;
        // Ép người chơi chọn vị trí hồi máu/phóng đạn; không thêm cổ hoặc sát thương tức thì.
        if(SBAI.level==='kho'&&ta&&ta.phase==='startup'&&ta.t>=.15&&
          (ta.s.kind==='heal'||ta.s.kind==='proj')&&dist>150&&dist<330&&ok('dash')){
          a.intent='near';Sim.issue(B,a.id,{skill:'dash',x:t.x-Math.sign(t.x-a.x)*80,z:t.z});continue;
        }
        // BNB pilot: các ứng viên áp sát/cắt góc đọc vị trí quá khứ, không đọc đích move/con trỏ.
        if(advanced&&dist>145){
          const away=(vx*(t.x-a.x)+vz*(t.z-a.z))/Math.max(1,dist)>30;
          const exposed=ta?.phase==='startup'&&ta.t>=.2&&['heal','buff','proj'].includes(ta.s.kind);
          const edge=t.x<X0+130||t.x>X1-130;
          const candidates=[{role:'cut',score:away?65:25},
            {role:'pressure',score:exposed?85:0},{role:'edge',score:edge?60:0}];
          const choice=candidates.sort((a,b)=>b.score-a.score)[0];
          if(choice.score>=60){
            const lead=away?.45:.12,side=Math.sign(t.x-a.x)||a.face;
            const px=Math.max(X0,Math.min(X1,t.x+vx*lead-side*70)),pz=Math.max(0,Math.min(Z1,t.z+vz*lead));
            a.intent='near';a.decision={role:choice.role,at:B.t,x:px,z:pz};
            if(dist>170&&dist<420&&ok('dash')&&(away||exposed||edge||B.rng()<L.gap)){Sim.issue(B,a.id,{skill:'dash',x:px,z:pz});continue}
            if(dist>190||Math.abs(t.z-a.z)>a.sk.atk.depth){Sim.issue(B,a.id,{skill:'move',x:px,z:pz});continue}
          }
        }
        // Sương Yêu (tăng công, ch137): bật khi sắp vào tầm và còn dư chân nguyên cho Lốc; không bật lại khi đang bật.
        if(ok('suongyeu')&&!a.empower&&dist<240&&a.ess>=a.sk.suongyeu.cost+(a.sk.locbangnhan?.cost||0)&&B.rng()<.5){a.intent='power';Sim.issue(B,a.id,{skill:'suongyeu'});continue}
        // Không phí Lốc khóa đất lên mục tiêu đang chạy ở mức Khó; áp sát chờ thời cơ.
        if(ok('locbangnhan')&&dist<a.sk.locbangnhan.castRange&&B.t-(a.lastBig??-2)>8&&
          ((!advanced&&SBAI.level!=='kho')||t.state!=='move')){
          a.lastBig=B.t;a.intent='big';Sim.issue(B,a.id,{skill:'locbangnhan'});continue}
        if(ok('thuytrao')&&!a.shield&&dist<180&&a.hp<a.maxHp*.65&&B.rng()<.6){a.intent='guard';Sim.issue(B,a.id,{skill:'thuytrao'});continue}
        // áp sát bằng lướt khi đối thủ giữ khoảng cách (thả diều): buộc người chơi canh vị trí
        if(dist>170&&dist<330&&ok('dash')&&B.rng()<L.gap){a.intent='near';Sim.issue(B,a.id,{skill:'dash',x:t.x-Math.sign(t.x-a.x)*80,z:t.z});continue}
        a.intent=Sim.inMelee(a,t,a.sk.atk,true)?'melee':'near';
        Sim.issue(B,a.id,{skill:'atk'});
      }
    }};
  if(typeof module!=='undefined')module.exports=SBAI;else root.SBAI=SBAI;
})(this);
