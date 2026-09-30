// Trình bày (lộ trình giai đoạn 3): cảnh hội thoại, chữ hiện dần, bản đồ theo ngày đêm và thời tiết,
// cảnh Xuân Thu Thiền khi chết hoặc quay ngược, vuốt đổi tab trên điện thoại.
// Nạp sau ui.js, trước engine.js.

/* ---------- 3.1 Người nói trong sự kiện ---------- */
// Sự kiện nào do ai nói. Sự kiện có thể tự khai báo ev.who để ghi đè.
const EV_WHO={c_khaikhieu:'phuongchinh',c_giasan:'caumo',c_tramthuy:'tramthuy',c_thuongdoi:'giaphu',c_kimsinh:'kimsinh',c_dieutra:'giaphu',
  c_bai:'bai',c_lang2:'thanhthu',c_luancong:'toctruong',c_thiet:'tiexueleng',c_thietvay:'tiexueleng',c_baigia:'thanhthu',
  r_pctienbo:'phuongchinh',r_phephai:'mactran',x_tramthuy:'tramthuy'};
const WHO_PREFIX={npc_pc_:'phuongchinh',npc_tt_:'thanhthu',npc_bai_:'bai',npc_cm_:'caumo',npc_nn_:'nhuocnam',npc_hl_:'hunglam'};
// Tranh chân dung ngoài assets/npc
const WHO_ART={bai:'art/p_bai.jpg'};
function evSpeaker(id){
  const ev=EV[id]||{};
  if(ev.who)return ev.who;
  if(EV_WHO[id])return EV_WHO[id];
  if(id.startsWith('npc_xm_'))return S.f.phe==='Mạc gia'?'mactran':'xichluyen';
  for(const p in WHO_PREFIX)if(id.startsWith(p))return WHO_PREFIX[p];
  return null;
}
function speakerHTML(k){
  if(!k||!NPC[k])return '';
  const img=NPC_IMG[k]?asset('npc/'+NPC_IMG[k]+'.jpg'):WHO_ART[k]?asset(WHO_ART[k]):'';
  const v=S.rel[k]||0,mood=v>=20?'warm':v<=-20?'cold':'';
  return `<div class="speaker ${mood}" aria-label="${esc(NPC[k].n)}">
    <span class="spk-ava${img?' img':''}"${img?` style="background-image:url('${img}')"`:''}>${img?'':(NPC_META[k]||'人')}</span>
    <span class="spk-name">${esc(NPC[k].n)}</span></div>`;
}

// Chữ hiện dần. Bấm vào thẻ để hiện hết. Lựa chọn chỉ hiện khi chữ đã chạy xong.
let typeTimer=null;
const TYPE_CPS=160; // ký tự mỗi giây
function typeStory(){
  clearInterval(typeTimer);
  const el=document.querySelector('.story-text'),ch=document.querySelector('.story .choices');
  if(!el||!ch||RM||S.ff)return;
  const full=el.textContent;if(full.length<40)return;
  let n=0;el.textContent='';ch.classList.add('await');
  const card=el.closest('.story');
  const done=()=>{clearInterval(typeTimer);if(el.isConnected)el.textContent=full;ch.classList.remove('await');card&&card.removeEventListener('click',skip,true)};
  const skip=ev=>{if(ch.classList.contains('await')){ev.stopPropagation();ev.preventDefault();done()}};
  card&&card.addEventListener('click',skip,true);
  const t0=performance.now();
  typeTimer=setInterval(()=>{
    if(!el.isConnected)return clearInterval(typeTimer);
    n=Math.min(full.length,Math.ceil((performance.now()-t0)*TYPE_CPS/1000));el.textContent=full.slice(0,n);
    if(n>=full.length)done();
  },16);
}

/* ---------- 3.2 Bản đồ sống ---------- */
// Lớp CSS cho bản đồ: buổi trong tháng, thời tiết theo thiên cơ, trăng máu trước lang triều, khói sau lang triều
function mapMood(){
  const c=[['tod-sang','tod-chieu','tod-dem'][(S.turn-1)%3]];
  if(W('muadam'))c.push('wx-rain');
  // Tuyết giữa mùa hạ quanh lần gặp Bạch Ngưng Băng
  if(W('hanthu')||(S.turn>=16&&S.turn<=17&&!S.f.tideDone))c.push('wx-snow');
  if(W('dathan'))c.push('wx-heat');
  if(W('linhmach'))c.push('wx-qi');
  const tide=S.tideT||19;
  if(S.turn>=tide-3&&S.turn<tide&&!S.f.tideDone)c.push('bloodmoon');
  if(S.f.tideDone)c.push('ruin');
  if(S.turn>=26)c.push('ember');
  return c.join(' ');
}
function mapFxHTML(){
  const m=mapMood();let h='';
  if(m.includes('wx-rain')&&!m.includes('bloodmoon'))h+='<i class="rain soft"></i>';
  if(m.includes('wx-snow'))h+='<i class="snowfall"></i><i class="snowfall s2"></i>';
  if(m.includes('bloodmoon'))h+='<i class="bmoon"></i>';
  if(m.includes('ruin'))h+=[18,44,71].map((x,i)=>`<i class="smoke" style="left:${x}%;animation-delay:${-i*2.3}s"></i>`).join('');
  if(m.includes('ember'))h+='<i class="embers"></i>';
  return h;
}

/* ---------- 3.3 Cảnh Xuân Thu Thiền ---------- */
const CICADA_SVG=`<svg viewBox="-60 -60 120 120" class="cicada" aria-hidden="true">
  <g class="wing wl"><path d="M-4-8C-30-40-58-30-54-6-50 10-22 8-4 2Z"/><path d="M-4 2C-26 14-44 30-34 40-24 48-10 26-2 8Z"/></g>
  <g class="wing wr"><path d="M4-8C30-40 58-30 54-6 50 10 22 8 4 2Z"/><path d="M4 2C26 14 44 30 34 40 24 48 10 26 2 8Z"/></g>
  <ellipse cx="0" cy="4" rx="8" ry="22" class="body"/><circle cx="0" cy="-20" r="8" class="body"/>
  <circle cx="-5" cy="-22" r="2.4" class="eye"/><circle cx="5" cy="-22" r="2.4" class="eye"/></svg>`;
// kind: 'rewind' (quay ngược ngắn) hoặc 'dead' (chết thật, dài hơn). done chạy khi cảnh kết thúc hoặc bị bỏ qua.
function cicadaScene(kind,done){
  if(RM||!document.body){done();return}
  const from=S.turn,to=kind==='dead'?1:Math.max(1,S.turn-REWIND_WEEKS);
  const dur=kind==='dead'?3000:1700;
  const lines=S.log.slice(-7).reverse().map(l=>`<p>${esc(l.t)}</p>`).join('');
  const o=document.createElement('div');o.className='cicada-scene '+kind;
  o.innerHTML=`<div class="cs-motes">${Array.from({length:26},(_,i)=>`<i style="left:${(i*37)%100}%;animation-delay:${-(i*.13)%1.6}s;animation-duration:${1.1+(i%5)*.25}s"></i>`).join('')}</div>
    <div class="cs-log">${lines}</div>
    ${CICADA_SVG}
    <div class="cs-count"><b id="csWeek">Tuần ${from}</b><small>${kind==='dead'?`Kiếp ${META.life+1} · trở về lễ khai khiếu`:`Quang âm chảy ngược ${REWIND_WEEKS} tuần`}</small></div>
    <span class="cs-skip">Bấm để bỏ qua</span>`;
  document.body.appendChild(o);
  const t0=performance.now();let fin=false;
  // Hẹn giờ thay cho requestAnimationFrame: tab bị ẩn thì cảnh vẫn kết thúc
  const iv=setInterval(()=>{
    const p=Math.min(1,(performance.now()-t0)/dur),w=Math.round(from-(from-to)*Math.min(1,p*1.25));
    const el=o.querySelector('#csWeek');if(el)el.textContent=`Tuần ${w}`;
  },60);
  const end=()=>{if(fin)return;fin=true;clearInterval(iv);clearTimeout(tm);o.classList.add('out');setTimeout(()=>o.remove(),450);done()};
  const tm=setTimeout(end,dur);
  o.addEventListener('click',end);
}

/* ---------- 3.4 Điện thoại: vuốt ngang trên bảng nhân vật để đổi tab ---------- */
(function(){
  let x0=null,y0=0;
  document.addEventListener('touchstart',e=>{const s=e.target.closest&&e.target.closest('#sheet');if(!s){x0=null;return}x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  document.addEventListener('touchend',e=>{
    if(x0===null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
    if(Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx)*.6)return;
    const tabs=['than','co','nhan','ky'],i=tabs.indexOf(UI.tab);
    const n=clamp(i+(dx<0?1:-1),0,tabs.length-1);if(n===i)return;
    UI.tab=tabs[n];try{localStorage.setItem('tms-tab',UI.tab)}catch(err){}
    renderSheet();
  },{passive:true});
})();
