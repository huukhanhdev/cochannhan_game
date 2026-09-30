// Giao diện: thanh trạng thái, dòng thời gian, bảng nhân vật, bản đồ, thẻ sự kiện, các bảng chức năng.
// Nạp trước engine.js; chỉ gọi hàm engine khi render.

const UI={tab:'than'};
try{UI.tab=localStorage.getItem('tms-tab')||'than'}catch(e){}

const GU_META={
  xuanthu:{icon:'蝉',cls:'rank-6'},nguyetquang:{icon:'月',cls:'rank-1'},nguyetmang:{icon:'芒',cls:'rank-2'},
  tuutrung:{icon:'酒',cls:'rank-1'},tuvi:{icon:'味',cls:'rank-2'},bachthi:{icon:'猪',cls:'rank-1'},hacthi:{icon:'黑',cls:'rank-1'},
  thietbi:{icon:'铁',cls:'rank-2'},ngocbi:{icon:'玉',cls:'rank-1'},thienbong:{icon:'蓬',cls:'rank-3'},trilieu:{icon:'愈',cls:'rank-1'},
  huyetnguyet:{icon:'血',cls:'rank-2'},huyetlo:{icon:'颅',cls:'rank-4'},diathinh:{icon:'耳',cls:'rank-2'},cuongnham:{icon:'岩',cls:'rank-1'},
  uguang:{icon:'幽',cls:'rank-1'},bachngoc:{icon:'瓷',cls:'rank-2'},hungluc:{icon:'熊',cls:'rank-1'},liemtuc:{icon:'隐',cls:'rank-1'},
  xaloi1:{icon:'舍',cls:'rank-1'},xaloi2:{icon:'利',cls:'rank-2'},xaloi3:{icon:'银',cls:'rank-3'},
  sinhco:{icon:'叶',cls:'rank-1'},tieuguang:{icon:'光',cls:'rank-1'},toanphong:{icon:'风',cls:'rank-1'},dongbi:{icon:'铜',cls:'rank-1'},thanhti:{icon:'丝',cls:'rank-1'},
  nguyettoan:{icon:'旋',cls:'rank-2'},nguyetngan:{icon:'银',cls:'rank-2'},nguyetnghe:{icon:'裳',cls:'rank-2'},bangdao:{icon:'刀',cls:'rank-2'},thuytrao:{icon:'水',cls:'rank-2'},
  anlan:{icon:'鳞',cls:'rank-2'},cuongthu:{icon:'钳',cls:'rank-3'},thachkhieu:{icon:'石',cls:'rank-3'},amduong:{icon:'阴',cls:'rank-4'},duongco:{icon:'阳',cls:'rank-4'},hoalo:{icon:'炉',cls:'rank-2'},cuudiep:{icon:'草',cls:'rank-2'},cuxikimngo:{icon:'蜈',cls:'rank-3'},mokmi:{icon:'魅',cls:'rank-3'},daosihuyetbuc:{icon:'蝠',cls:'rank-3'},
  thiennguyenbaolien:{icon:'莲',cls:'rank-3'},thiennguyen:{icon:'莲',cls:'rank-3'},cotthuong:{icon:'枪',cls:'rank-2'},amduongchuyenthan:{icon:'阳',cls:'rank-4'},
};
// Chân dung NPC từ tranh nhân vật
const NPC_IMG={
  toctruong:'n_toctruong',caumo:'n_caumo',mactran:'n_mactran',xichluyen:'n_xichluyen',giaphu:'n_giaphu',
  phuongchinh:'n_phuongchinh',thanhthu:'n_thanhthu',nhuocnam:'n_thietnhuocnam',tiexueleng:'n_giave',nhatdai:'n_nhatdai',
  bai: () => (typeof S !== 'undefined' && (S.f?.bai_nu || S.f?.baiNu || S.q >= 2) ? 'n_bai_nu' : 'n_bai')
};
const NPC_META={hunglam:'熊',thuongtam:'猎',macnhan:'颜',xichson:'山',tiexueleng:'铁',nhuocnam:'若',phuongchinh:'正',caumo:'舅',tramthuy:'翠',thanhthu:'书',giaphu:'贾',kimsinh:'金',bai:'冰',toctruong:'族',xichluyen:'赤',mactran:'莫',xichthanh:'城'};
const CANON_GLYPH={c_khaikhieu:'启',c_giasan:'家',c_conghocduong:'劫',c_khaohach:'考',c_tramthuy:'婢',c_thuongdoi:'商',c_kimsinh:'贾',
  c_dieutra:'查',c_thuongdoiroi:'商',c_baigia:'白',c_lang1:'狼',c_lang2:'木',c_lang3:'王',c_luancong:'荒',c_bai:'冰',c_thiet:'铁',c_huyetdong:'血',c_thietvay:'捕',c_nhatdai:'尸',c_final:'终'};

// Điểm trên bản đồ sơn trại (tọa độ % trên tranh bg_village)
const MAP_SPOTS=[
  {id:'hocduong',x:23,y:34,g:'学',n:'Học đường',d:'Nghe giảng, gặp bạn học. Có thể tăng ngộ tính.'},
  {id:'robgate',x:36,y:46,g:'劫',n:'Cổng học đường',d:'Cướp nguyên thạch bạn học. Danh vọng giảm.',tag:'demon'},
  {id:'trai',x:11,y:58,g:'寨',n:'Sơn trại',d:'Tửu lâu, tin đồn, đấu đá nội bộ.'},
  {id:'nhiemvu',x:48,y:56,g:'令',n:'Nhiệm vụ đường',d:'Nguyên thạch và danh vọng. Có khi gặp sơn tặc.'},
  {id:'tuluyen',x:28,y:78,g:'修',n:'Bế quan',d:'Dồn chân nguyên và nguyên thạch vào tu vi.'},
  {id:'nghi',x:50,y:82,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết, chân nguyên, mau lành thương.'},
  {id:'hauson',x:62,y:20,g:'洞',n:'Hậu sơn',d:'Khe đá thoang thoảng mùi rượu.'},
  {id:'nui',x:84,y:34,g:'山',n:'Núi Thanh Mao',d:'Săn thú, tìm cổ hoang. Có thể gặp kẻ mạnh hơn nhiều.'},
  {id:'market',x:70,y:68,g:'市',n:'Chợ',d:'Mua bán cổ trùng. Không tốn thời gian.',minor:1},
  {id:'refine',x:88,y:66,g:'炉',n:'Lò luyện cổ',d:'Hợp luyện cổ bậc cao. Không tốn thời gian.',minor:1},
];

function bar(v,m,c){return `<div class="bar"><i style="width:${clamp(v/m*100,0,100)}%;background:${c}"></i></div>`}
function meter(label,v,m,cls,extra){
  return `<div class="meter ${cls||''}"><div class="mrow"><span>${label}</span><b>${Math.max(0,Math.floor(v))}<small> / ${m}</small></b></div><div class="mtrack"><i style="width:${clamp(v/m*100,0,100)}%"></i></div>${extra||''}</div>`;
}

function renderMoon(){
  const el=$('moon');if(!el)return;
  const p=(((S.turn-1)%3)*10+5)/30,r=18,cx=21,cy=21;
  const off=2*r*(p<.5?p*2:(1-p)*2)*(p<.5?1:-1);
  el.innerHTML=`<defs><clipPath id="mc"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ece8cf"/>
    <circle cx="${cx-off}" cy="${cy}" r="${r+.5}" fill="#10171a" clip-path="url(#mc)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3a474d"/>`;
}

/* ---------- Thanh trạng thái ---------- */
function renderHUD(){
  const e=ESS[S.chuyen];
  const res=[['石',S.stones,'Nguyên thạch','gold'],['药',S.herbs,'Linh dược',''],['血',S.blood,'Huyết khí',''],['酒',S.wine,'Tứ vị tửu','']];
  $('hud').innerHTML=`
    <div class="hud-id">
      <div class="avatar" style="--ring:${e.c}"><span style="background-image:url('${asset('art/p_hero.jpg')}')"></span><b>${CH[S.chuyen]}</b></div>
      <div class="who">
        <div class="nm">Phương Nguyên <small>kiếp ${META.life}</small></div>
        <div class="rk">${rankName()}</div>
        <div class="xp" title="Tu vi ${S.prog}/${need()}"><i style="width:${clamp(S.prog/need()*100,0,100)}%"></i></div>
      </div>
    </div>
    <div class="hud-bars">
      ${meter('Khí huyết',S.hp,maxHp(),'hp')}
      ${meter('Chân nguyên <em>'+e.n+'</em>',S.ess,maxEss(),'es')}
    </div>
    ${cicadaChip()}
    ${driftChip()}
    <div class="hud-res">${res.map(r=>`<span class="res ${r[3]}" title="${r[2]}"><i>${r[0]}</i>${r[1]}</span>`).join('')}</div>
    <div class="hud-social">
      ${meter('Danh vọng',Math.max(0,S.danh),100,'danh')}
      ${meter('Hiềm nghi',S.susp,100,'susp'+(S.susp>=70?' hot':''))}
    </div>
    ${S.inj?`<span class="injury" title="${INJURY[S.inj.k].d}">伤 ${INJURY[S.inj.k].n} · ${S.inj.t} tuần</span>`:''}
    <div class="hud-time">
      ${hudTimeHTML()}
      <svg id="moon" width="42" height="42" viewBox="0 0 42 42" aria-hidden="true"></svg>
    </div>
    <div class="hud-btns">
      ${S.ff?'<button class="btn warn" data-ff="stop">Dừng tua</button>':''}
      <button class="btn ghost" id="codexBtn">Cổ Đồ Giám</button>
      <button class="btn ghost" id="soundBtn">${window.SFX&&SFX.isMuted()?'Âm thanh: tắt':'Âm thanh: bật'}</button>
    </div>`;
  renderMoon();
}

/* ---------- Dòng thời gian 27 tuần ---------- */
function renderTimeline(){
  let cells='';
  for(let t=1;t<=curFinal();t++){
    const cid=(S.canon||CANON)[t],m=Math.ceil(t/3),tu=TUAN[(t-1)%3];
    const cls=[t<S.turn?'past':'',t===S.turn?'now':'',cid?'ev':'',t%3===1?'mstart':''].join(' ');
    cells+=`<div class="tl ${cls}" title="Tháng ${m} · ${tu}${cid?': '+EV[cid].hint:''}">${t%3===1?`<span class="mlab">T${m}</span>`:''}${cid?`<i>${CANON_GLYPH[cid]||EV[cid].g||'事'}</i>`:''}</div>`;
  }
  const cal=S.canon||CANON,next=Object.keys(cal).map(Number).sort((a,b)=>a-b).find(t=>t>=S.turn);
  const nx=next?`<span class="next">Ký ức tương lai: <b>${EV[cal[next]].hint}</b>${next===S.turn?' · tuần này':` · còn ${next-S.turn} tuần`}</span>`:'';
  $('timeline').innerHTML=`<div class="tl-track">${cells}</div>${nx}`;
}

/* ---------- Bảng nhân vật (tab) ---------- */
function renderSheet(){
  const tabs=[['than','Thân'],['co','Cổ trùng'],['nhan','Nhân vật'],['ky','Ký ức']];
  let body='';
  if(UI.tab==='than'){
    const tot=S.canonHit+S.canonMiss,dev=tot?Math.round(S.canonMiss/tot*100):0;
    const daoLbl=S.dao>=40?'Ma đạo':S.dao>=15?'Nghiêng ma':S.dao<=-40?'Chính đạo':S.dao<=-15?'Nghiêng chính':'Trung dung';
    body=`
      ${S.trait?`<div class="trait-chip"><i>${TRAITS[S.trait].g}</i><div><b>${TRAITS[S.trait].n}</b><small>+ ${TRAITS[S.trait].up} · − ${TRAITS[S.trait].down}</small></div></div>`:''}
      ${(S.world||[]).map(k=>`<div class="world-chip"><i>${WORLD[k].g}</i><div><b>${WORLD[k].n}</b><small>${WORLD[k].d}</small></div></div>`).join('')}
      <div class="aperture-wrap"><canvas id="apertureCanvas"></canvas><div class="aperture-overlay">Không khiếu · ${talentName(S.tuchat)}</div></div>
      <div class="attrs">
        <div><span class="label">Tâm cơ</span><b>${S.tamco}</b></div>
        <div><span class="label">Sát phạt</span><b>${S.satphat}</b></div>
        <div><span class="label">Ngộ tính</span><b>${S.ngo}</b></div>
      </div>
      <div class="stat"><div class="row"><span>Đạo tâm</span><span class="${S.dao>=15?'danger':S.dao<=-15?'good':'dimt'}">${daoLbl}</span></div>
        <div class="axis"><i style="left:${(S.dao+100)/2}%"></i></div><div class="row dimt small"><span>Chính</span><span>Ma</span></div></div>
      <div class="kv">
        <div class="row"><span>Sát lực cơ bản</span><span>${baseAtk()}</span></div>
        <div class="row"><span>Hệ số tu luyện</span><span>×${cultMult().toFixed(2)}</span></div>
        <div class="row"><span>Nuôi cổ mỗi tuần</span><span>${foodCost()} thạch</span></div>
        <div class="row"><span>Lệch nguyên tác</span><span>${tot?dev+'%':'chưa có'}</span></div>
        <div class="row"><span>Ký ức kiếp trước</span><span class="drift-t${driftTier()}">${DRIFT_LABEL[driftTier()]}</span></div>
        ${S.inj?`<div class="row danger"><span>${INJURY[S.inj.k].n}</span><span>${INJURY[S.inj.k].d} · ${S.inj.t} tuần</span></div>`:''}
      </div>
      <button class="btn warn wide" data-a="thien" ${cicadaReady()&&!S.combat&&!S.over?'':'disabled'} title="Tự kích hoạt Xuân Thu Thiền, quay ngược ${REWIND_WEEKS} tuần">${cicadaReady()?`Kích hoạt Xuân Thu Thiền (quay ngược ${REWIND_WEEKS} tuần)`:`Xuân Thu Thiền đang hồi phục ${Math.floor(cicadaCharge())}% · còn ${cicadaWeeksLeft()} tuần`}</button>`;
  }else if(UI.tab==='co'){
    body=`<div class="gu">${S.gu.map((g,i)=>{
      const d=GU[g.k],gm=GU_META[g.k]||{icon:'蛊',cls:'rank-1'};
      return `<div class="gucard-rich ${gm.cls}">
        <div class="gu-emblem">${guEmblem(g.k,gm.icon,'fill')}</div>
        <div class="gu-body">
          <div class="gu-top"><span class="gu-name">${d.n}</span><span class="pill">${CH[d.r]} chuyển</span></div>
          <div class="gu-desc">${d.d}</div>
          <div class="gu-footer"><small class="dimt">${d.food?`Ăn ${d.fn} · ${(g.k==='nguyetquang'&&S.f.freeMoon)?'miễn phí':d.food+' thạch'}`:'Ăn '+d.fn}${d.cost?` · ${d.cost} chân nguyên`:''}${CD[g.k]?` · hồi ${CD[g.k]}`:''}</small>
            ${g.h?`<span class="hunger-pill hunger-bad">Đói ${g.h}/3</span>`:''}</div>
          ${d.t==='use'?`<button class="btn" data-use="${i}" ${S.combat?'disabled':''}>Dùng</button>`:''}
        </div></div>`}).join('')}</div>`;
  }else if(UI.tab==='nhan'){
    function npcQuestProgress(k){
      const prog=S.npcProg||{};
      const vr=S.var||{};
      if(k==='phuongchinh'){
        const p=prog.phuongchinh||1;
        const r=vr.phuongchinh_route==='kieu_ngao'?'Kiêu ngạo':'Tự ti';
        if(S.f.pcAlly) return '<span class="npc-quest-pill done">Đồng minh sinh tử</span>';
        if(S.f.pcHate) return '<span class="npc-quest-pill hate">Thù hận thấu xương</span>';
        return `<span class="npc-quest-pill">Tuyến: Giai đoạn ${p}/5 · ${r}</span>`;
      }
      if(k==='thanhthu'){
        const p=prog.thanhthu||0;
        if(S.f.qingshuAlive) return '<span class="npc-quest-pill done">Đã cứu sống · Tri kỷ</span>';
        if(S.f.qingshuDead) return '<span class="npc-quest-pill dead">Tử trận bão tuyết</span>';
        return `<span class="npc-quest-pill">Tuyến: Giai đoạn ${p}/4</span>`;
      }
      if(k==='bai'){
        const p=prog.bai||0;
        if(S.f.baiAlly) return '<span class="npc-quest-pill done">Tri kỷ Ma đạo</span>';
        return `<span class="npc-quest-pill">Tuyến: Giai đoạn ${p}/4 · Bắc Minh Thể</span>`;
      }
      if(k==='xichluyen'||k==='mactran'||k==='xichthanh'){
        const p=prog.xich_mac||0;
        const phe=S.f.phe||'Trung lập';
        return `<span class="npc-quest-pill">Tranh ghế ${p}/4 · ${phe}</span>`;
      }
      if(k==='caumo'||k==='tramthuy'){
        const p=prog.caumo||1;
        if(S.f.tuulau===3) return '<span class="npc-quest-pill done">Đã đoạt trọn di sản</span>';
        return `<span class="npc-quest-pill">Gia sản ${p}/4</span>`;
      }
      return '';
    }
    const npcs=Object.keys(S.met).filter(k=>NPC[k]);
    body=`<div class="npc-list">${npcs.map(k=>{
      const v=S.rel[k]||0,col=v>=20?'var(--jade)':v<=-20?'var(--blood)':'var(--dim)';
      const imgName = typeof NPC_IMG[k]==='function' ? NPC_IMG[k]() : NPC_IMG[k];
      return `<div class="npc-item">${imgName?`<span class="npc-ava img" style="background-image:url('${asset('npc/'+imgName+'.jpg')}')"></span>`:`<span class="npc-ava">${NPC_META[k]||'人'}</span>`}
        <div class="npc-info"><b>${NPC[k].n}</b><small>${NPC[k].d}</small>${npcQuestProgress(k)}</div>
        <div class="npc-rel"><span style="color:${col}">${v>0?'+':''}${v}</span><div class="rel-bar"><i style="width:${clamp((v+100)/2,0,100)}%;background:${col}"></i></div></div></div>`}).join('')}</div>`;
  }else{
    const mems=Object.keys(S.mem||{});
    const deaths=(META.deaths||[]).slice(-5).reverse();
    body=`<div class="mems">${mems.length?mems.map(k=>`<div><b>${MEM[k]?MEM[k].n:k}</b><small class="dimt">${MEM[k]?MEM[k].d:''}</small></div>`).join(''):'<small class="dimt">Chưa có. Mỗi lần chết, những gì đã trải qua sẽ theo ngươi về quá khứ.</small>'}</div>
      <span class="label">Sát chiêu đã ngộ</span>
      <div class="mems">${COMBOS.filter(cb=>(S.combos||{})[cb.id]).map(cb=>`<div><b>${cb.n}</b><small class="dimt">${cb.req.map(k=>GU[k].n).join(' + ')} · ${cb.d}</small></div>`).join('')||'<small class="dimt">Chưa ngộ ra sát chiêu nào. Có đủ cổ rồi bế quan để lĩnh ngộ.</small>'}</div>
      <span class="label">Lưu trữ</span>
      <div class="savebox"><button class="btn" data-save="copy">Sao chép save</button><button class="btn" data-save="paste">Nhập save</button></div>
      <textarea id="saveText" class="savetext" rows="3" placeholder="Dán mã save vào đây rồi bấm Nhập save" hidden></textarea><small class="dimt" id="saveMsg"></small>
      ${deaths.length?`<span class="label">Những lần chết gần nhất</span><div class="deaths">${deaths.map(d=>`<div class="row"><span>Kiếp ${d.life} · tháng ${Math.ceil((d.turn||1)/3)}</span><span class="danger">${esc(d.cause)}</span></div>`).join('')}</div>`:''}`;
  }
  $('sheet').innerHTML=`<div class="tabs" role="tablist">${tabs.map(t=>`<button class="tab ${UI.tab===t[0]?'on':''}" data-tab="${t[0]}" role="tab" aria-selected="${UI.tab===t[0]}">${t[1]}${t[0]==='co'?` <small>${S.gu.length}</small>`:''}</button>`).join('')}</div><div class="tab-body">${body}</div>`;
  if(UI.tab==='than'&&window.Aperture)Aperture.init();
}

/* ---------- Nhật ký ---------- */
function renderLog(){
  const el=$('log');if(!el)return;
  el.innerHTML=S.log.map(l=>`<p class="${l.c}">${esc(l.t)}</p>`).join('');
  el.scrollTop=el.scrollHeight;
}

/* ---------- Sân khấu chính ---------- */
function choiceBtn(c,i,evId){
  const ok=!c.req||c.req();
  const seen=META.seen&&META.seen[evId];
  const tags=[c.mem?'<span class="tag mem">憶 Ký ức</span>':'',c.canon&&seen?'<span class="tag canon">Nguyên tác</span>':'',c.tag==='ma'?'<span class="tag ma">Ma</span>':'',c.tag==='chinh'?'<span class="tag chinh">Chính</span>':''].join('');
  let chk='';
  if(c.check){
    const p=chance(c.check[0],c.check[1],c.bonus?c.bonus():0);
    const lbl=S.ngo>=10?`${p}%`:p>=75?'Dễ':p>=50?'Vừa':p>=25?'Khó':'Rất khó';
    chk=`<span class="odds ${p>=75?'e':p>=50?'m':p>=25?'h':'x'}">${ATTR[c.check[0]]} · ${lbl}</span>`;
  }
  return `<button class="choice" data-ch="${i}" ${ok?'':'disabled'}><span class="ct">${esc(c.t)}</span><span class="cmeta">${chk}${tags}${!ok&&c.reqT?`<small>${c.reqT}</small>`:''}</span></button>`;
}

function renderStage(){
  const st=$('stage');
  if(S.over==='win'&&S.book===2){st.innerHTML=q2WinHTML();return}
  if(S.over==='win'){
    const E=ENDINGS[S.ending],tot=S.canonHit+S.canonMiss;
    st.innerHTML=`<div class="over has-art" style="--art:url('${asset('art/p_hero.jpg')}')"><span class="label">Kiếp ${META.life} · Tháng ${month()} · ${rankName()}</span>
      <h3>${E.t}</h3><p>${E.d}</p>
      <p>Bám nguyên tác ${tot?Math.round(S.canonHit/tot*100):0}% · chết ${META.life-1} lần trước khi tới được đây.</p>
      ${Q2_GATE.includes(S.ending)?`<p>Quyển hai mở ra: xuôi sông Hoàng Long, tới Bạch Cốt Sơn và Thương gia thành.</p><button class="btn big" data-a="q2">Sang Quyển hai</button>`:'<p class="dimt">Kết cục này ở lại chính đạo, không dẫn sang Quyển hai. Các kết cục ma đạo hoặc cùng Bạch Ngưng Băng xuống núi mới mở Quyển hai.</p>'}
      <button class="btn ${Q2_GATE.includes(S.ending)?'ghost':'big'}" data-a="newgame">Bắt đầu lại từ kiếp một</button></div>`;
    return;
  }
  if(S.over==='rewind'){
    const d=META.deaths[META.deaths.length-1],to=Math.max(1,S.turn-REWIND_WEEKS);
    st.innerHTML=`<div class="over has-art dead" style="--art:url('${asset('art/bg_fire.jpg')}')"><span class="label">${timeLabel()} · ${rankName()}</span>
      <h3>Xuân Thu Thiền thức tỉnh</h3>
      <p>Ngươi chết dưới tay ${esc(d?d.cause:'số mệnh')}. Con ve vàng trong không khiếu vỗ cánh, quang âm chảy ngược ${REWIND_WEEKS} tuần, về tháng ${Math.ceil(to/3)}.</p>
      <p>Mất: những gì có được trong ${REWIND_WEEKS} tuần đó. Giữ lại: mọi ký ức. Sau lần này Xuân Thu Thiền kiệt sức, cần ${CICADA_WEEKS} tuần để hồi phục. Chết trước lúc đó là chết thật.</p>
      <button class="btn big" data-a="rewind">Nghịch chuyển quang âm</button></div>`;
    return;
  }
  if(S.over==='dead'&&S.book===2){st.innerHTML=q2DeadHTML();return}
  if(S.over==='dead'){
    const d=META.deaths[META.deaths.length-1];
    st.innerHTML=`<div class="over has-art dead" style="--art:url('${asset('art/bg_fire.jpg')}')"><span class="label">${timeLabel()} · ${rankName()}</span>
      <h3>Phương Nguyên đã chết</h3>
      <p>Ngươi chết dưới tay ${esc(d?d.cause:'số mệnh')}. Xuân Thu Thiền mới hồi phục ${Math.floor(cicadaCharge())}%, không đủ sức nghịch chuyển quang âm.</p>
      <p>Chết là chết thật. Mọi thứ bắt đầu lại từ lễ khai khiếu: tu vi, cổ trùng, và cả ký ức về những gì đời này đã trải qua đều mất sạch.</p>
      <button class="btn big" data-a="rebirth">Bắt đầu lại từ đầu</button></div>`;
    return;
  }
  if(S.combat){if(S.ff){st.innerHTML=ffCombatHTML();return}renderCombat(st);return}
  if(S.traitOpts){
    st.innerHTML=`<div class="paper intro">
      <span class="label">Kiếp ${META.life} · Sáng ngày khai khiếu</span>
      <h2 class="title">Thiên mệnh kiếp này</h2>
      <p class="dimt">Xuân Thu Thiền đưa ngươi về, nhưng quang âm nghịch chuyển làm thiên hạ lệch đi. Mỗi kiếp một thế cục khác.</p>
      <div class="worlds"><span class="label">Thiên cơ kiếp này</span>${(S.world||[]).map(k=>`<div class="world-chip"><i>${WORLD[k].g}</i><div><b>${WORLD[k].n}</b><small>${WORLD[k].d}</small></div></div>`).join('')}</div>
      <p class="dimt">Chọn một mệnh cách.</p>
      <div class="traits">${S.traitOpts.map(k=>{const t=TRAITS[k];return `<button class="trait-card" data-trait="${k}"><span class="tg">${t.g}</span><b>${t.n}</b><span class="up">+ ${t.up}</span><span class="down">− ${t.down}</span></button>`}).join('')}</div>
    </div>`;
    return;
  }
  if(S.ffOffer){st.innerHTML=ffOfferHTML();return}
  if(S.mg){renderMG(st);return}
  if(S.evq.length){
    const id=S.evq[0],ev=EV[id];
    const diso=ev.loc==='diso';
    st.innerHTML=`<article class="story ${ev.canon?'canon':''} ${diso?'diso':''}">
      <div class="story-art" style="background-image:url('${eventArt(id)}')">
        ${speakerHTML(evSpeaker(id))}
        <div class="story-cap"><span class="label">${ev.canon?'Mốc nguyên tác':diso?'Dị số':'Kỳ ngộ'} · ${timeLabel()}</span><h2>${ev.title}</h2></div>
      </div>
      <div class="story-body">
        <p class="story-text">${esc(evText(id))}</p>
        <div class="choices">${choicesOf(ev).map((c,i)=>choiceBtn(c,i,id)).join('')}</div>
      </div></article>`;
    return;
  }
  const head=(t,sub)=>`<div class="headrow"><div><span class="label">${sub||''}</span><h2 class="title">${t}</h2></div><button class="btn" data-a="close">Quay lại bản đồ</button></div>`;
  if(S.panel==='tuluyen'){
    const cap=cultMaxStones(),opts=[...new Set([0,Math.ceil(cap/2),cap])].filter(n=>n<=S.stones);
    st.innerHTML=`<div class="paper">${head('Bế quan tu luyện','Mười ngày trong phòng kín')}
      <p class="dimt">Chân nguyên hiện có ${Math.floor(S.ess)}. Mỗi viên nguyên thạch hồi 5 chân nguyên; một lần bế quan chỉ hấp thu tới khi không khiếu đầy thêm một lần (tối đa ${cap} viên). Hệ số tu luyện ×${cultMult().toFixed(2)}.${S.inj&&S.inj.k==='kinh'?' Kinh mạch tổn hại làm tu luyện chậm đi.':''}</p>
      <div class="act-grid-rich">${opts.map(n=>`<button class="act-card-rich" data-cult="${n}"><div class="act-icon">修</div>
        <div class="act-text"><b>${n?`Dùng thêm ${n} nguyên thạch`:'Chỉ dùng chân nguyên'}</b><small class="gold">Tu vi +${Math.round((Math.floor(S.ess)+n*5)*cultMult()*(.4+.2*apLeft()))}</small></div></button>`).join('')}</div></div>`;
    return;
  }
  if(S.panel==='gamble'){
    const icons=['石','竹','血','冰'];
    st.innerHTML=`<div class="paper">${head('Phường Đoán Thạch','Quầy mổ thạch của Cổ gia')}
      <p class="dimt">Chọn đá bằng mắt và trực giác. Có thể ra cổ trùng hiếm hoặc nguyên thạch tinh khiết, cũng có thể chỉ là vụn vôi. Người thu mua Cổ gia luôn ép giá dưới giá gốc. Mỗi tuần quầy chỉ bán ${STONE_WEEKLY} khối, tuần này còn <b class="gold">${stonesLeft()}</b>.</p>
      <div class="gamble-grid">${STONES_GAMBLE.map((x,i)=>`<button class="stone-card st-${i+1}" data-gamble="${x.id}" ${S.stones<x.price||stonesLeft()<=0?'disabled':''}>
        <div class="stone-visual">${icons[i]||'石'}</div><b>${x.n}</b><span class="stone-price">${x.price} nguyên thạch</span><small>${x.d}</small>
        <span class="pill ${mem('doanthach')?'canonp':''}">${mem('doanthach')?'Soi vân đá chuẩn hơn':`Độ sâu: DC ${x.dc}`}</span></button>`).join('')}</div></div>`;
    return;
  }
  if(S.panel==='market'){
    const item=(g,n,d,attr,price)=>`<div class="item"><div class="iinfo"><span class="glyph-ico">${g}</span><div><b>${n}</b><small>${d}</small></div></div><button class="btn" ${attr} ${S.stones<price?'disabled':''}>${price} thạch</button></div>`;
    st.innerHTML=`<div class="paper">${head(S.f.caravan?'Chợ thương đội Cổ gia':'Chợ sơn trại','Không tốn thời gian')}
      <div class="shop"><span class="label">Cổ trùng</span>
        ${S.shop.length?S.shop.map((k,i)=>`<div class="item"><div class="iinfo">${guEmblem(k,(GU_META[k]||{}).icon,'lg')}<div><b>${GU[k].n}</b><small>${GU[k].d} Ăn ${GU[k].fn}, ${GU[k].food} thạch/tuần.</small></div></div>
          <button class="btn" data-buy="${i}" ${S.stones<guPrice(k)?'disabled':''}>${guPrice(k)} thạch</button></div>`).join(''):'<span class="dimt">Hết hàng.</span>'}
        <span class="label">Tạp hóa</span>
        ${item('药','Linh dược','Hồi 30 khí huyết và giải độc trong chiến đấu.','data-item="herb"',itemPrice('herb'))}
        ${item('血','Huyết khí','Nguyên liệu luyện Huyết Nguyệt Cổ.','data-item="blood"',8)}
        ${S.f.caravan?item('酒','Tứ vị tửu','Nguyên liệu luyện Tứ Vị Tửu Trùng. Chỉ thương đội có bán.','data-item="wine"',15):''}
        ${S.f.caravan?`<div class="item hl"><div class="iinfo"><span class="glyph-ico">石</span><div><b class="gold">Phường Đoán Thạch</b><small>Thử vận may với hóa thạch cổ trùng.</small></div></div><button class="btn active" data-a="gamble">Vào quầy</button></div>`:''}
        <span class="label">Bán cổ (40% giá)</span>
        ${S.gu.map((g,i)=>GU[g.k].t==='fate'?'':`<div class="item"><div class="iinfo">${guEmblem(g.k,(GU_META[g.k]||{}).icon)}<div><b>${GU[g.k].n}</b></div></div><button class="btn" data-sell="${i}">+${Math.floor(GU[g.k].p*.4)} thạch</button></div>`).join('')}
      </div></div>`;
    return;
  }
  if(S.panel==='refine'){
    st.innerHTML=`<div class="paper">${head('Lò luyện cổ','Mỗi tuần luyện được một lần')}
      <p class="dimt">Thất bại thì cổ gốc chết, nguyên liệu mất.</p>
      <div class="refine-grid">${RECIPES.map((r,i)=>{
        const t=GU[r.id],src=GU[r.from],ex=r.extraGu?GU[r.extraGu]:null,ch=Math.round(refineChance(r)*100);
        return `<div class="refine-card"><div>
            <div class="formula"><span class="f-box">${src.n}</span> + ${ex?`<span class="f-box">${ex.n}</span> + `:''}${r.st?`<span class="f-box">${r.st} thạch</span> + `:''}${r.bl?`<span class="f-box">${r.bl} huyết khí</span> + `:''}${r.wine?`<span class="f-box">${r.wine} tứ vị tửu</span> + `:''}${r.hb?`<span class="f-box">${r.hb} linh dược</span> + `:''}<span class="gold">➔</span> <span class="f-box out">${t.n}</span></div>
            <small class="dimt">${t.d}</small></div>
          <div class="rc-side"><span class="pill ${ch>=70?'good':ch>=50?'gold':'danger'}">${ch}%</span><button class="btn" data-refine="${i}" ${canRefine(r)?'':'disabled'}>Luyện</button></div></div>`}).join('')}</div></div>`;
    return;
  }
  if(S.book===2){renderMap2(st);return}
  // Bản đồ sơn trại
  const acts=Object.fromEntries(ACTS.map(a=>[a.id,a]));
  const spots=MAP_SPOTS.filter(s=>s.minor||(acts[s.id]&&(!acts[s.id].show||acts[s.id].show())));
  st.innerHTML=`<div class="mapwrap">
    <div class="map ${S.turn>=(S.tideT||19)-3&&!S.f.tideDone?'storm':''} ${mapMood()}" style="background-image:url('${asset('art/bg_map.jpg')}')">
      <div class="map-fx" aria-hidden="true"><i class="mist m1"></i><i class="mist m2"></i><i class="mist m3"></i>
        ${[[6,52],[10.5,47],[3,60],[92.5,60],[96,66],[57,43]].map(([x,y],i)=>`<b class="lantern" style="left:${x}%;top:${y}%;animation-delay:${i*.37}s"></b>`).join('')}
        ${S.turn>=(S.tideT||19)-3&&!S.f.tideDone?'<i class="rain"></i><i class="flash"></i>':''}${mapFxHTML()}</div>
      <div class="map-cap"><span class="label">${timeLabel()} · việc ${Math.min(AP_WEEK,AP_WEEK-S.ap+1)}/${AP_WEEK}</span><h2>${S.ap>=AP_WEEK?'Tuần này đi đâu?':`Còn ${S.ap} việc trong tuần`}</h2></div>
      ${spots.map(s=>`<button class="spot ${s.minor?'minor':''} ${s.tag||''}" data-a="${s.id}" style="left:${s.x}%;top:${s.y}%"><span class="sseal">${s.g}</span><span class="slbl">${s.n}</span><span class="stip">${s.d}${s.minor?'':s.id==='tuluyen'?' · dùng hết việc còn lại trong tuần':' · 1 việc'}</span></button>`).join('')}
    </div>
    <div class="map-foot">
      <button class="btn" data-a="absorb" ${S.stones<5||S.ess>=maxEss()?'disabled':''}>Hấp thu 5 nguyên thạch (+25 chân nguyên)</button>
      ${S.pend?`<button class="btn active pend-btn" data-a="pend" title="Hết việc trong tuần thì chuyện này tự tìm tới">Đối mặt: ${EV[S.pend].hint||EV[S.pend].title}</button>`:''}
      <button class="btn ghost" data-a="endweek">Qua tuần</button>
      <span class="dimt small">Mỗi tuần ${AP_WEEK} việc. ${S.pend?'Đại sự trong tuần sẽ tự tới khi hết việc. ':''}Chợ và lò luyện không tốn việc.</span>
    </div></div>`;
}

function viewKey(){
  if(S.over)return 'over:'+S.over;
  if(S.combat)return 'combat:'+(S.combat.id||S.combat.k);
  if(S.traitOpts)return 'trait';
  if(S.mg)return 'mg:'+S.mg.type;
  if(S.evq.length)return 'ev:'+S.evq[0]+':'+S.turn+':'+(S.sceneN||0);
  if(S.panel)return 'panel:'+S.panel;
  return 'map:'+S.turn;
}
function render(){
  if(UI.batch)return;
  $('mainPanel').classList.toggle('in-combat',!!S.combat);
  $('stage').classList.toggle('ff-on',!!S.ff);
  if(!S.combat)Scene.stop();
  renderHUD();renderTimeline();renderSheet();renderLog();renderStage();
  // Mực loang khi đổi cảnh
  const k=viewKey(),kind=k.split(':')[0];
  if(UI.lastView!==undefined&&UI.lastView!==k&&!(kind==='combat'&&UI.lastView===k)&&!RM&&!S.ff){
    const el=$('stage').firstElementChild;
    if(el&&(kind!=='ev'||UI.lastView.split(':')[1]!==k.split(':')[1])){
      el.classList.add('ink-in');el.addEventListener('animationend',()=>el.classList.remove('ink-in'),{once:true});
    }
  }
  if(kind==='ev'&&UI.lastView!==k)typeStory();
  UI.lastView=k;
  renderTitle();
  showToast();
}

/* ---------- Màn hình mở đầu ---------- */
const INTRO=[
  'Năm trăm năm trước, Huyết Ma Phương Nguyên khiến cả chính đạo khiếp sợ.',
  'Quần hùng vây giết hắn trên đỉnh núi. Trước khi chết, hắn luyện thành Xuân Thu Thiền.',
  'Con ve vàng vỗ cánh. Quang âm chảy ngược.',
  'Hắn mở mắt, trở lại năm mười lăm tuổi, sáng ngày khai khiếu ở Cổ Nguyệt sơn trại.',
  'Lần này hắn biết trước tương lai. Nhưng tương lai cũng đã bắt đầu lệch đi.',
];
UI.title=true;
function renderTitle(){
  const L=$('titleLayer');if(!L)return;
  if(!UI.title){L.innerHTML='';return}
  if(L.dataset.mode===(UI.intro?'intro':'title'))return;
  L.dataset.mode=UI.intro?'intro':'title';
  const cont=META.life>1||S.turn>1||S.log.length>6;
  L.innerHTML=`<div class="title-screen ${UI.intro?'intro':''}">
    <div class="ts-bg" style="background-image:url('${asset('art/bg_title.jpg')}')"></div>
    <div class="ts-hero" style="background-image:url('${asset('art/p_hero.jpg')}')"></div>
    <div class="ts-mist"><i></i><i></i></div>
    ${UI.intro?`<div class="ts-intro">${INTRO.map((t,i)=>`<p style="animation-delay:${.4+i*2.1}s">${t}</p>`).join('')}
        <button class="btn big ts-go" data-title="go" style="animation-delay:${.6+INTRO.length*2.1}s">Mở mắt</button>
        <button class="btn ghost ts-skip" data-title="go">Bỏ qua</button></div>`
      :`<div class="ts-content">
        <div class="ts-glyph" aria-hidden="true">蛊真人</div>
        <h1>Thanh Mao Sơn Ký</h1>
        <p class="ts-sub">${S.book===2?'Quyển hai · '+(CHAPTERS[S.chap]||{n:''}).n:'Quyển một · Ma đầu trùng sinh'}</p>
        <div class="ts-btns">
          <button class="btn big" data-title="${cont?'go':'intro'}">${cont?(S.book===2?`Tiếp tục · ${timeLabel()}`:`Tiếp tục · kiếp ${META.life}, tháng ${month()}`):'Bắt đầu'}</button>
          ${cont?'<button class="btn ghost" data-title="intro">Xem lại mở đầu</button>':''}
          ${(META.q2Unlocked||Q2_TEST)&&S.book!==2?`<button class="btn ghost" data-title="q2">${META.q2Unlocked?'Vào thẳng Quyển hai':'Thử Quyển hai (bản thử)'}</button>`:''}
        </div>
        <p class="ts-note">Fan game phi thương mại dựa trên Cổ Chân Nhân của Cổ Chân</p>
      </div>`}
  </div>`;
}
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-title]');if(!b)return;
  if(b.dataset.title==='intro'){UI.intro=true;renderTitle();return}
  UI.title=false;UI.intro=false;
  if(b.dataset.title==='q2')startQ2(META.q2From||'ma');
  const L=$('titleLayer');L.firstElementChild&&L.firstElementChild.classList.add('ts-out');
  setTimeout(()=>{L.dataset.mode='';renderTitle()},RM?0:700);
});

// Xuất / nhập save (mã base64, dán qua clipboard)
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-save]');if(!b)return;
  const msg=t=>{const m=$('saveMsg');if(m)m.textContent=t};
  const ta=$('saveText');
  if(b.dataset.save==='copy'){
    const code=btoa(unescape(encodeURIComponent(JSON.stringify({S,META}))));
    const fallback=()=>{ta.hidden=false;ta.value=code;ta.select();msg('Không sao chép tự động được. Mã đã chọn sẵn, bấm Ctrl/Cmd+C.')};
    try{navigator.clipboard.writeText(code).then(()=>msg('Đã sao chép mã save. Lưu vào ghi chú để giữ lâu dài.'),fallback)}catch(e){fallback()}
  }else{
    if(ta.hidden){ta.hidden=false;ta.value='';ta.focus();msg('Dán mã save rồi bấm Nhập save lần nữa.');return}
    try{
      const d=JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))));
      if(!d.S||!d.META)throw 0;
      S=d.S;META=d.META;S.mod=S.mod||{};S.var=S.var||{};saveAll();render();msg('Đã nhập save.');
    }catch(e){msg('Mã save không hợp lệ. Kiểm tra lại đã dán đủ chưa.')}
  }
});

// Chuyển tab bảng nhân vật
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-tab]');if(!b)return;
  UI.tab=b.dataset.tab;try{localStorage.setItem('tms-tab',UI.tab)}catch(e){}
  renderSheet();
});
