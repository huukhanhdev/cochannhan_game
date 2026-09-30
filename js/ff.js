// Tua nhanh bằng ký ức (lộ trình 1.1).
// Mỗi kiếp ghi lại: đi đâu mỗi tuần, bế quan dùng bao nhiêu thạch (S.path), và lựa chọn gần nhất ở từng sự kiện (META.choiceMem).
// Kiếp sau có thể "đi lại con đường cũ": game tự lặp lại, tự đánh trận thường, và dừng ngay khi có gì khác đi.
// Nạp trước engine.js; chỉ gọi hàm của engine lúc chạy.

const FF_DELAY=90;
// Mốc nguyên tác có biến thể cánh bướm: khóa trong S.var quyết định sự kiện có khác kiếp trước không.
// stop: biến thể khác thì lựa chọn cũ có thể nguy hiểm, nên dừng lại; còn lại chỉ ghi chú rồi đi tiếp.
const FF_BUTTERFLY={
  c_giasan:{k:'giasan'},c_conghocduong:{k:'gate'},
  c_kimsinh:{k:'kimsinh',stop:1},c_baigia:{k:'baigia',stop:1},c_bai:{k:'bai',stop:1},c_lang1:{k:'lang',stop:1},c_huyetdong:{k:'huyethai',stop:1},
};
// Sự kiện ngẫu nhiên nhỏ (không phải mốc truyện, không thuộc tuyến NPC): được tự chọn khi chưa có lựa chọn cũ
function ffMinor(id){const e=EV[id];return !!(e&&e.loc&&!e.canon)}
// Chọn phương án an toàn: không cần điều kiện thì ưu tiên, có tung xúc xắc thì chọn tỉ lệ cao nhất
function ffSafeChoice(chs){
  let best=-1,bs=-1;
  chs.forEach((c,i)=>{if(c.req&&!c.req())return;const sc=c.check?chance(c.check[0],c.check[1],c.bonus?c.bonus():0):70;if(sc>bs){bs=sc;best=i}});
  return best;
}

/* ---------- ghi lại đường đi ---------- */
function ffRecord(k,o){if(!S)return;(S.path=S.path||[]).push(Object.assign({t:S.turn,k},o))}
function ffRememberChoice(id,c){(META.choiceMem=META.choiceMem||{})[id]=c.t;(META.choiceTag=META.choiceTag||{})[id]=c.tag||''}
// Gọi ngay trước khi sang kiếp mới
function ffSaveLife(){
  META.lastPath=(S.path||[]).slice();META.lastVar=Object.assign({},S.var||{});META.lastEnd=S.turn;
}
// Có đường cũ đủ dài để tua không
function ffAvailable(){const p=META.lastPath||[];return p.filter(x=>x.k==='act').length>=2}
function ffMaxWeek(){return Math.max(2,...(META.lastPath||[]).filter(x=>x.k==='act').map(x=>x.t))}
function ffDefaultWeek(){return Math.max(2,Math.min(ffMaxWeek(),(META.lastEnd||2)-1))}

/* ---------- điều khiển ---------- */
function ffStart(until){
  S.ffOffer=false;
  S.ff={until:Math.max(2,Math.min(until,ffMaxWeek())),steps:0};
  log(`Ký ức kiếp trước dẫn đường. Ngươi đi lại con đường cũ tới tuần ${S.ff.until}.`,'mem');
  saveAll();render();ffSchedule();
}
function ffStop(reason){
  if(!S.ff)return;
  S.ff=null;FX.queue.length=0;FX.toastMsg=null;
  log(`Dừng tua: ${reason}`,'big');
  saveAll();render();
}
function ffSchedule(){setTimeout(ffStep,RM?0:FF_DELAY)}

// Một bước tự chơi. Trả về false khi đã dừng.
function ffStep(){
  if(!S||!S.ff)return false;
  S.ff.steps++;
  if(S.ff.steps>600)return ffStop('tua quá lâu, trả quyền điều khiển cho ngươi.'),false;
  if(S.over)return ffStop('kiếp này đã kết thúc.'),false;
  if(S.mg){mgAct('auto');return ffNext()}
  if(S.combat){return ffFight()}
  if(S.evq.length){
    const id=S.evq[0],ev=EV[id];
    const bf=FF_BUTTERFLY[id];
    if(bf&&META.lastVar&&META.lastVar[bf.k]!==undefined&&META.lastVar[bf.k]!==(S.var||{})[bf.k]){
      if(bf.stop)return ffStop(`cánh bướm vỗ cánh, 【${ev.title}】 kiếp này đã khác kiếp trước.`),false;
      log(`Cánh bướm: 【${ev.title}】 kiếp này có chỗ khác kiếp trước. Ký ức vẫn chọn như cũ.`,'mem');
    }
    const chs=choicesOf(ev);
    const text=(META.choiceMem||{})[id];
    if(!text){
      if(!ffMinor(id))return ffStop(`gặp 【${ev.title}】, chuyện chưa từng trải qua.`),false;
      const j=ffSafeChoice(chs);if(j<0)return ffStop(`gặp 【${ev.title}】, không có lựa chọn nào làm được.`),false;
      log(`Chuyện vặt chưa gặp bao giờ, ngươi chọn cách an toàn nhất.`,'mem');
      choose(j);
      if(S.combat)return ffFightStart();
      return ffNext();
    }
    let i=chs.findIndex(c=>c.t===text&&(!c.req||c.req()));
    if(i<0&&!ev.canon){
      // Biến thể mới của tuyến NPC: chọn theo tâm tính cũ (ma, chính, trung dung)
      const tag=(META.choiceTag||{})[id];
      if(tag!==undefined){i=chs.findIndex(c=>(c.tag||'')===tag&&(!c.req||c.req()));if(i>=0)log(`【${ev.title}】 khác kiếp trước. Ký ức chọn theo tâm tính cũ.`,'mem')}
      if(i<0&&ffMinor(id)){i=ffSafeChoice(chs);if(i>=0)log('Lựa chọn cũ không làm được, ngươi chọn cách an toàn nhất.','mem')}
    }
    if(i<0)return ffStop(`ở 【${ev.title}】, lựa chọn kiếp trước không còn làm được.`),false;
    choose(i);
    if(S.combat)return ffFightStart();
    return ffNext();
  }
  if(S.panel==='tuluyen'){
    const e=(META.lastPath||[]).find(x=>x.k==='cult'&&x.t===S.turn);
    const n=Math.max(0,Math.min(e?e.n:0,S.stones,cultMaxStones()));
    cultivate(n);return ffNext();
  }
  if(S.panel){S.panel=null}
  if(S.turn>=S.ff.until)return ffStop(`đã tới tuần ${S.turn}. Từ đây ngươi tự quyết.`),false;
  if(S.hp<maxHp()*.2)return ffStop('khí huyết quá thấp.'),false;
  const a=(META.lastPath||[]).find(x=>x.k==='act'&&x.t===S.turn);
  // Máu thấp thì nghỉ một tuần như người chơi thật, rồi đi tiếp đường cũ
  if(S.hp<maxHp()*.4&&(!a||a.a!=='nghi')){log('Thương thế chưa lành, ký ức bảo ngươi tĩnh dưỡng tuần này.','mem');act('nghi');return ffNext()}
  if(!a)return ffStop('kiếp trước chưa từng đi tới đây.'),false;
  const spec=ACTS.find(x=>x.id===a.a);
  if(!spec||(spec.show&&!spec.show()))return ffStop(`tuần này không thể ${spec?spec.n.toLowerCase():'làm như cũ'}.`),false;
  act(a.a);
  if(S.combat)return ffFightStart();
  return ffNext();
}
function ffNext(){FX.queue.length=0;FX.toastMsg=null;if(S.ff)ffSchedule();return !!S.ff}

// Trận sinh tử và thủ lĩnh không tự đánh
function ffFightStart(){
  const c=S.combat;
  if(c.boss||!c.flee)return ffStop(`${c.n} chặn đường. Trận này ngươi phải tự đánh.`),false;
  return ffFight();
}
// Tự đánh trọn trận thường ngay trong một bước (không dựng đấu trường)
function ffFight(){
  let guard=0;
  while(S.combat&&S.ff&&guard++<80){
    if(S.hp<maxHp()*.2)return ffStop(`khí huyết cạn dần khi đấu với ${S.combat.n}.`),false;
    if(S.hp<maxHp()*.35&&S.combat.flee&&!S.combat.boss){playerAct('flee');continue}
    ffCombatAction();
  }
  if(S.combat&&S.ff)return ffStop(`trận với ${S.combat.n} kéo dài quá lâu.`),false;
  if(S.over==='dead'){S.ff=null;return false}
  return ffNext();
}
// Cách đánh tự động: giống người chơi máy trong tools/sim.cjs
function ffCombatAction(){
  const c=S.combat,hpR=S.hp/maxHp();
  const gus=S.gu.map((g,i)=>({i,k:g.k,d:GU[g.k]}));
  const ready=x=>guReady(x.k)&&S.ess>=guCostIdx(x.i);
  const guard=gus.find(x=>x.d.t==='guard'&&ready(x));
  const heal=gus.find(x=>x.d.t==='heal'&&ready(x));
  const atks=gus.filter(x=>x.d.t==='attack'&&ready(x)).sort((a,b)=>b.d.dmg-a.d.dmg);
  const combo=COMBOS.find(cb=>(META.combos||{})[cb.id]&&cb.req.every(k=>hasGu(k))&&guReady(cb.id)&&S.ess>=costOf(cb.cost)&&cb.dmg);
  if(hpR<.45&&heal)return playerAct('gu',heal.i);
  if(hpR<.45&&S.herbs>0&&guReady('herb'))return playerAct('herb');
  if((c.intent==='heavy'||(c.intent==='skill'&&['thunder','charge','rage'].includes(c.sk)))&&guard&&c.shield<=0)return playerAct('gu',guard.i);
  if(c.intent==='guard'&&!(c.stun>0)&&guard&&c.shield<=0)return playerAct('gu',guard.i);
  if(combo)return playerAct('combo',combo.id);
  if(atks.length)return playerAct('gu',atks[0].i);
  if(S.stones>=5&&S.ess<10)return playerAct('absorb');
  return playerAct('strike');
}

/* ---------- giao diện ---------- */
function ffOfferHTML(){
  const max=ffMaxWeek(),def=ffDefaultWeek();
  const opts=[];for(let t=2;t<=max;t++)opts.push(`<option value="${t}" ${t===def?'selected':''}>Tháng ${Math.ceil(t/3)} · ${TUAN[(t-1)%3]} (tuần ${t})</option>`);
  return `<div class="paper intro ff-offer">
    <span class="label">Kiếp ${META.life} · Ký ức kiếp trước</span>
    <h2 class="title">Đi lại con đường cũ?</h2>
    <p class="dimt">Kiếp trước ngươi đi tới tuần ${META.lastEnd||max}. Ngươi có thể để ký ức dẫn đường: lặp lại nơi đã đến và lựa chọn đã chọn, tự đánh các trận thường.</p>
    <p class="dimt">Sẽ dừng lại ngay khi gặp chuyện chưa từng trải qua, khi cánh bướm làm mốc nguyên tác khác đi, khi gặp trận sinh tử, hoặc khi khí huyết xuống thấp.</p>
    <div class="ff-row"><label for="ffUntil">Tua tới</label><select id="ffUntil">${opts.join('')}</select></div>
    <div class="ts-btns"><button class="btn big" data-ff="go">Để ký ức dẫn đường</button><button class="btn ghost" data-ff="skip">Tự đi từ đầu</button></div>
  </div>`;
}
function ffCombatHTML(){
  const c=S.combat;
  return `<div class="paper ff-fight"><span class="label">Ký ức dẫn đường · tuần ${S.turn}</span><h2 class="title">Tự đánh: ${esc(c.n)}</h2>
    <p class="dimt">Khí huyết ${Math.max(0,S.hp)}/${maxHp()} · Địch ${Math.max(0,c.hp)}/${c.max}</p></div>`;
}
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-ff]');if(!b||b.disabled)return;
  const k=b.dataset.ff;
  if(k==='go'){const s=document.getElementById('ffUntil');ffStart(s?+s.value:ffDefaultWeek())}
  else if(k==='skip'){S.ffOffer=false;saveAll();render()}
  else if(k==='stop'){ffStop('ngươi tự dừng lại.')}
});
