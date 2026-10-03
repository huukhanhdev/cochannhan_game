// Giao diện HTML sandbox E: thanh khí huyết / chân nguyên hai bên, thanh kỹ năng một hàng có nhãn phím,
// quạt hồi chiêu + số giây, nhãn thiếu chân nguyên / hết lượt (không chỉ đổi màu), dòng thông báo.
// TÍCH HỢP: thanh kỹ năng thay #skillbar của battle.js khi fightMode==='e'; thanh máu dùng lại UI cũ.
const SBHud=(function(){
  // Trạng thái từ hệ chung (choáng/trói/phong cấm…); slow/bleed vẫn hiện qua nhãn cũ bên dưới.
  const root_SB=a=>typeof SB_STATUS!=='undefined'?SB_STATUS.view(B,a).filter(v=>['stun','root','seal'].includes(v.id)).map(v=>v.n+' '+v.left.toFixed(1)+'s'):[];
  let B,el={};
  const KEYLBL=k=>k==null?'·':k===' '?'Space':k.toUpperCase();   // · = chiêu chưa gán phím, bấm bằng ô
  function mount(root,battle){
    B=battle;const p=B.actors[B.ids.player];
    root.innerHTML=`
      <div class="bars">${[B.ids.player,B.ids.enemy].map(id=>`<div class="bar-box ${id===B.ids.player?'pn':'bnb'}"><b>${B.actors[id].kit.n}</b> <small class="buff"></small>
        <div class="bar hp"><i></i><span></span></div><div class="bar ess"><i></i><span></span></div></div>`).join('')}</div>
      <div class="sbar"></div>
      <div class="controls"><button type="button" class="stop">Dừng</button><button type="button" class="cancel-aim" hidden>Hủy nhắm</button></div>
      <div class="desc"></div>`;
    el={sbar:root.querySelector('.sbar'),desc:root.querySelector('.desc'),bars:{}};
    for(const id of [B.ids.player,B.ids.enemy]){el.bars[id]=root.querySelector('.bar-box.'+(id===B.ids.player?'pn':'bnb'));
      if(!B.actors[id].maxEss)el.bars[id].querySelector('.bar.ess').hidden=true}   // thú: không có chân nguyên
    // Dòng gợi ý dựng theo kit người chơi và tên đối thủ (roster nhiều nhân vật, không viết cứng PN/BNB).
    const gu=p.kit.skills.filter(s=>s.kind!=='dash'&&s.kind!=='heal'&&s.kind!=='absorb'&&s.key!=null).map(s=>KEYLBL(s.key)),dash=p.kit.skills.find(s=>s.kind==='dash'),
      item=p.kit.skills.find(s=>s.kind==='heal');
    el.hint=['Chuột phải hoặc phím mũi tên: đi','chuột vào '+B.actors[B.ids.enemy].kit.n+': đánh',
      gu.length?gu.join(' ')+': chiêu (nhắm theo con trỏ) · Phát cổ: các cổ sẵn sàng khác hồi 2s':'',dash?KEYLBL(dash.key)+': lướt':'',
      item?KEYLBL(item.key)+': '+item.n:'',p.kit.skills.find(s=>s.kind==='absorb')?'2: hấp thu nguyên thạch':'','S: dừng'].filter(Boolean).join(' · ');
    const cells=[Object.assign({},p.kit.atk,{key:'chuột'}),...p.kit.skills];
    root.querySelector('.stop').onclick=()=>SBInput.stop();
    root.querySelector('.cancel-aim').onclick=()=>SBInput.cancelAim();
    cells.forEach(s=>{
      const c=document.createElement('button');c.className='cell';c.dataset.id=s.id;
      c.innerHTML=`<span class="k">${s.key==='chuột'?'Chuột':KEYLBL(s.key)}</span><span class="ic">${s.icon}</span><span class="nm">${s.n}</span><span class="sub"></span><span class="cdv"></span>`;
      c.addEventListener('mouseenter',()=>SBInput.setHover(s));
      c.addEventListener('mouseleave',()=>SBInput.setHover(null));
      let pointer=null;
      c.addEventListener('pointerdown',e=>{if(e.isPrimary===false||e.button!==0)return;pointer=e.pointerId});
      c.addEventListener('pointercancel',()=>{pointer=null});
      c.addEventListener('pointerleave',()=>{pointer=null});
      c.addEventListener('pointerup',e=>{if(e.pointerId!==pointer)return;pointer=null;
        if(e.pointerType==='touch'||e.pointerType==='pen')SBInput.touchCast(s.id);else SBInput.cast(s.id,true)});
      c.addEventListener('click',e=>{if(e.detail===0)SBInput.cast(s.id,true)});
      el.sbar.appendChild(c);
    });
  }
  function update(){
    for(const id of [B.ids.player,B.ids.enemy]){const a=B.actors[id],b=el.bars[id];
      b.querySelector('.hp i').style.width=(a.hp/a.maxHp*100)+'%';b.querySelector('.hp span').textContent=Math.ceil(a.hp)+' / '+Math.round(a.maxHp);
      b.querySelector('.ess i').style.width=(a.ess/a.maxEss*100)+'%';b.querySelector('.ess span').textContent=Math.floor(a.ess)+' chân nguyên';
      b.querySelector('.buff').textContent=[a.empower?(a.sk[a.empower.id]?.n||'Tăng công')+' '+Math.max(0,a.empower.until-B.t).toFixed(1)+'s':'',a.state==='shell'?'trong vỏ băng':'',...root_SB(a),a.transform?(a.sk[a.transform.id]?.n||'Biến thân')+' '+Math.max(0,a.transform.until-B.t).toFixed(1)+'s':'',a.enrage?'cuồng nộ':'',a.oneArm?'cụt tay phải':'',a.shield?(a.shield.n||a.sk[a.shield.id]?.n||a.shield.id)+' '+Math.max(0,a.shield.until-B.t).toFixed(1)+'s'+(a.shield.upkeepPerSecond?' · −'+a.shield.upkeepPerSecond+' c.n/s':''):'',a.bleed?'chảy máu':'',a.slowUntil>B.t?'bị chậm':''].filter(Boolean).join(' · ')}
    const p=B.actors[B.ids.player];
    [...el.sbar.children].forEach(c=>{
      const s=p.sk[c.dataset.id],cd=p.cd[s.id]||0,lack=(s.cost||0)>p.ess,out=s.uses&&!(p.uses[s.id]>0);
      c.classList.toggle('lack',lack&&!out);c.classList.toggle('cd',cd>0);c.classList.toggle('out',!!out);
      c.classList.toggle('selected',SBInput.selected?.id===s.id);c.setAttribute('aria-pressed',String(SBInput.selected?.id===s.id));
      c.classList.toggle('busy',p.act&&p.act.s.id===s.id);
      c.querySelector('.sub').textContent=out?'hết':lack?'thiếu c.nguyên':s.uses?'còn '+p.uses[s.id]:s.cost?s.cost+' c.n':'';
      c.querySelector('.cdv').textContent=cd>0?cd.toFixed(1):'';
      c.style.setProperty("--cd",Math.min(1,cd/Math.max(s.cd||0,B.guLock??SBSim.GU_LOCK)));
    });
    el.sbar.parentNode.querySelector('.cancel-aim').hidden=!SBInput.selected;
    const h=SBInput.hover,m=SBInput.msg;
    if(SBInput.selected){el.desc.textContent=(m?m+' · ':'')+SBInput.selected.n+': chạm vào sân để nhắm · trận vẫn chạy';return}
    el.desc.innerHTML=m?`<span class="warn">${m}</span>`:h?`<b>${h.n}</b> — ${h.d||''}${h.startup!=null?` · lấy đà ${h.startup}s`:''}${h.cd?` · hồi ${h.cd}s`:''}${h.cost?` · ${h.cost} chân nguyên`:''}<span class="src"> · ${h.src||''}</span>`:
      `<span class="hint">${el.hint}</span>`;
  }
  return {mount,update};
})();
