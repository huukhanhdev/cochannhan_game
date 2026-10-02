// Giao diện HTML sandbox E: thanh khí huyết / chân nguyên hai bên, thanh kỹ năng một hàng có nhãn phím,
// quạt hồi chiêu + số giây, nhãn thiếu chân nguyên / hết lượt (không chỉ đổi màu), dòng thông báo.
// TÍCH HỢP: thanh kỹ năng thay #skillbar của battle.js khi fightMode==='e'; thanh máu dùng lại UI cũ.
const SBHud=(function(){
  let B,el={};
  const KEYLBL=k=>k===' '?'Space':k.toUpperCase();
  function mount(root,battle){
    B=battle;const p=B.actors.pn;
    root.innerHTML=`
      <div class="bars">${['pn','bnb'].map(id=>`<div class="bar-box ${id}"><b>${B.actors[id].kit.n}</b> <small class="buff"></small>
        <div class="bar hp"><i></i><span></span></div><div class="bar ess"><i></i><span></span></div></div>`).join('')}</div>
      <div class="sbar"></div>
      <div class="desc"></div>`;
    el={sbar:root.querySelector('.sbar'),desc:root.querySelector('.desc'),bars:{}};
    for(const id of ['pn','bnb'])el.bars[id]=root.querySelector('.bar-box.'+id);
    const cells=[Object.assign({},p.kit.atk,{key:'chuột'}),...p.kit.skills];
    cells.forEach(s=>{
      const c=document.createElement('button');c.className='cell';c.dataset.id=s.id;
      c.innerHTML=`<span class="k">${s.key==='chuột'?'Chuột':KEYLBL(s.key)}</span><span class="ic">${s.icon}</span><span class="nm">${s.n}</span><span class="sub"></span><span class="cdv"></span>`;
      c.addEventListener('mouseenter',()=>SBInput.setHover(s));
      c.addEventListener('mouseleave',()=>SBInput.setHover(null));
      c.addEventListener('click',()=>SBInput.cast(s.id,true));
      el.sbar.appendChild(c);
    });
  }
  function update(){
    for(const id of ['pn','bnb']){const a=B.actors[id],b=el.bars[id];
      b.querySelector('.hp i').style.width=(a.hp/a.maxHp*100)+'%';b.querySelector('.hp span').textContent=Math.ceil(a.hp)+' / '+a.maxHp;
      b.querySelector('.ess i').style.width=(a.ess/a.maxEss*100)+'%';b.querySelector('.ess span').textContent=Math.floor(a.ess)+' chân nguyên';
      b.querySelector('.buff').textContent=[a.shield?a.sk[a.shield.id].n+' '+Math.max(0,a.shield.until-B.t).toFixed(1)+'s':'',a.bleed?'chảy máu':'',a.slowUntil>B.t?'bị chậm':''].filter(Boolean).join(' · ')}
    const p=B.actors.pn;
    [...el.sbar.children].forEach(c=>{
      const s=p.sk[c.dataset.id],cd=p.cd[s.id]||0,lack=(s.cost||0)>p.ess,out=s.uses&&!(p.uses[s.id]>0);
      c.classList.toggle('lack',lack&&!out);c.classList.toggle('cd',cd>0);c.classList.toggle('out',!!out);
      c.classList.toggle('busy',p.act&&p.act.s.id===s.id);
      c.querySelector('.sub').textContent=out?'hết':lack?'thiếu c.nguyên':s.uses?'còn '+p.uses[s.id]:s.cost?s.cost+' c.n':'';
      c.querySelector('.cdv').textContent=cd>0?cd.toFixed(1):'';
      c.style.setProperty('--cd',s.cd?(cd/s.cd):0);
    });
    const h=SBInput.hover,m=SBInput.msg;
    el.desc.innerHTML=m?`<span class="warn">${m}</span>`:h?`<b>${h.n}</b> — ${h.d||''}${h.startup!=null?` · lấy đà ${h.startup}s`:''}${h.cd?` · hồi ${h.cd}s`:''}${h.cost?` · ${h.cost} chân nguyên`:''}<span class="src"> · ${h.src||''}</span>`:
      '<span class="hint">Chuột phải: đi · chuột vào Bạch Ngưng Băng: đánh · Q W E R D: cổ (nhắm theo con trỏ) · Space: lướt · 1: Sinh Mệnh Diệp · S: dừng</span>';
  }
  return {mount,update};
})();
