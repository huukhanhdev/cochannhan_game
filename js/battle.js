// Đấu trường PixiJS (WebGL): bối cảnh nhiều lớp, chân dung thư pháp, hạt, ánh sáng cộng màu,
// hit-stop, rung camera. Engine đẩy sự kiện vào FX.q(...); renderCombat() dựng/cập nhật rồi phát hiệu ứng.
const FX={queue:[],toastMsg:null,busy:false,q(e){this.queue.push(e)}};
const RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);

const ART={
  heorung:{g:'猪',sc:'forest',c:'#d2ab82'},
  dienlang:{g:'狼',sc:'forest',c:'#9fc7e8'},
  hachung:{g:'熊',sc:'forest',c:'#b3a695'},
  tanbinh:{g:'魔',sc:'forest',c:'#b890d6'},
  hoctro:{g:'徒',sc:'village',c:'#ddd6c0'},
  macbac:{g:'莫',sc:'village',c:'#ddd6c0'},
  cosusay:{g:'醉',sc:'village',c:'#dcb466'},
  hunggia:{g:'熊',sc:'forest',c:'#c8915e'},
  sontac:{g:'贼',sc:'forest',c:'#b5ad9a'},
  baitrinhsat:{g:'白',sc:'forest',c:'#e3edf1'},
  kimsinh:{g:'贾',sc:'forest',c:'#dcb466'},
  tuukhoi:{g:'酒',sc:'wine',c:'#e6bf70'},
  dlbay:{g:'群',sc:'tide',c:'#a4cdee'},
  loiquan:{g:'雷',sc:'tide',c:'#b3dbff'},
  langvuong:{g:'王',sc:'tide',c:'#d7ebff'},
  gialao:{g:'老',sc:'village',c:'#ddd6c0'},
  bai:{g:'冰',sc:'snow',c:'#c6e8f6'},
  huyetkhoi:{g:'血',sc:'blood',c:'#e8664f'},
  baicosu:{g:'白',sc:'fire',c:'#e3edf1'},
  baitruonglao:{g:'长',sc:'fire',c:'#e3edf1'},
  madutam:{g:'魔',sc:'blood',c:'#e8664f'},
  tiexueleng:{g:'铁',sc:'village',c:'#c9d3d6'},
  nhatdai:{g:'尸',sc:'blood',c:'#e8664f'},
  giave:{g:'卫',sc:'village',c:'#dcb466'},
  docxa:{g:'蛇',sc:'forest',c:'#8fd07a'},
  bao:{g:'豹',sc:'forest',c:'#e0b35a'},
  thachhau:{g:'猴',sc:'forest',c:'#b5ad9a'},
  hauquan:{g:'猴',sc:'wine',c:'#d9b27a'},
  hunglam:{g:'熊',sc:'forest',c:'#c8915e'},
  sontacvuong:{g:'匪',sc:'forest',c:'#b5ad9a'},
  bachmaon:{g:'熊',sc:'snow',c:'#eef4f6'},
  tramthuysat:{g:'刺',sc:'village',c:'#d86a6a'},
  phuongchinh:{g:'正',sc:'village',c:'#9fd8ff'},
  macnhan:{g:'莫',sc:'village',c:'#e7a0b0'},
};
const SCENE_NAME={forest:'Rừng trúc Thanh Mao',village:'Cổ Nguyệt sơn trại',tide:'Tường trại · Lang triều',wine:'Động phủ Hoa Tửu',blood:'Huyết động',snow:'Tuyết giữa mùa hạ',fire:'Thanh Mao Sơn bốc cháy'};
const SKILL_GLYPH={strike:'拳',herb:'药',flee:'走',nguyetquang:'月',huyetnguyet:'血',nguyetmang:'芒',ngocbi:'玉',thietbi:'铁',cuongnham:'岩',thienbong:'蓬',trilieu:'愈',
  cuongthu:'钳',thachkhieu:'石',amduong:'阴',duongco:'阳',tieuguang:'光',toanphong:'风',dongbi:'铜',thanhti:'丝',nguyettoan:'旋',nguyetngan:'银',nguyetnghe:'裳',bangdao:'刀',thuytrao:'水',anlan:'鳞',hoalo:'炉',cuudiep:'草',cuxikimngo:'蜈',mokmi:'魅',daosihuyetbuc:'蝠',sinhco:'叶',
  huyet_tram:'斩',hung_tram:'劈',bachngoc:'瓷',man_luc:'撞',nguyet_xa:'射',thien_khue:'护',nguyet_toan_xa:'旋',bang_trao_ho:'盾',kim_ngo_tram:'齿',huyet_duc_phong:'吸',
  thuy_nguyet:'澜',bang_huyet:'霜',tienlydilang:'蛛',
  boigiap:'甲',cotthuong:'枪',loatoan:'锥',cotthu:'刺',tichhoi:'灰',thanhnhiet:'清',khieukhieu:'跳',
  khiluc:'气',tulucsinh:'苏',kimcuong:'刚',trucxung:'冲',baodan:'爆',dochat:'蝎',hoathu:'焰',baoviem:'炎',
  kimquang:'芒',hondao:'魂',cotduc:'翼'};
const INTENT_SEAL={atk:'攻',heavy:'猛',guard:'守'};
// Nhóm cổ quyết định hình dạng đòn đánh trong đấu trường
const GU_EL={nguyetquang:'nguyet',tieuguang:'nguyet',nguyetmang:'beam',nguyetngan:'ngan',nguyettoan:'toan',huyetnguyet:'huyet',
  bangdao:'bang',toanphong:'phong',cuxikimngo:'kim',daosihuyetbuc:'buc',cotthuong:'beam',loatoan:'beam',cotthu:'kim',khiluc:'phong',hoathu:'fire',baoviem:'fire',kimquang:'beam',hondao:'buc',baodan:'fire'};
const EL_TINT={nguyet:0x9fd8ff,ngan:0xeef4ff,toan:0x9ff0c8,huyet:0xff5a44,bang:0xbfe8ff,phong:0xd8f0e8,kim:0xf0c46a,buc:0xd8342a,beam:0xbfe6ff,fist:0xece8cf,fire:0xff6a3a};
// Màu hộ thể theo cổ
const SHIELD_TINT={thuytrao:0x6ab8ff,thanhti:0x9fe0a0,hoalo:0xff8a3a,mokmi:0x6fbf5a,thienbong:0xf0e0c0,bachngoc:0xf4f4ea,nguyetnghe:0xbfd8ff,thietbi:0xb8c2c8,dongbi:0xd89a5a,cuongnham:0xa89a88};
const BRUSH='"Ma Shan Zheng", "STKaiti", "KaiTi", "Kaiti SC", serif';
const DISPLAY='"Cormorant Garamond", Georgia, serif';

// Tranh thủy mặc (tạo bằng Canva AI) trong assets/art/
const ART_DIR='assets/art/';
const PORTRAIT={heorung:'p_boar',dienlang:'p_wolf',hachung:'p_bear',tanbinh:'p_cultivator',hoctro:'p_cultivator',macbac:'p_cultivator',
  dlbay:'p_wolf',loiquan:'p_wolf',langvuong:'p_wolfking',gialao:'p_gialao',
  bai: () => (typeof S !== 'undefined' && (S.f?.bai_nu || S.f?.baiNu || S.book === 2) ? 'p_bai_female' : 'p_bai'),
  huyetkhoi:'p_blood',baicosu:'p_cultivator',baitruonglao:'p_baitruonglao',madutam:'p_madutam',giave:'p_giave',tiexueleng:'p_giave',
  nhatdai:'p_nhatdai',
  docxa:'p_boar',bao:'p_wolf',hauquan:'p_jar',hunglam:'p_cultivator',sontacvuong:'p_cultivator',bachmaon:'p_bear',tramthuysat:'p_giave',
  phuongchinh:'p_phuongchinh',thanhthu:'p_thanhthu',nhuocnam:'p_thietnhuocnam',macnhan:'p_cultivator'};
const PTINT={docxa:0xa8f0a0,bao:0xffd890,bachmaon:0xf4fbff,hunglam:0xeed0b0,phuongchinh:0xcfe8ff,tramthuysat:0xffb0b0,tiexueleng:0xd8dde2,nhatdai:0xff8a70,loiquan:0xcfe2ff,dlbay:0xdde6ee,kimsinh:0xf2e0b4,hunggia:0xeed0b0,baitrinhsat:0xe4edf4,baicosu:0xe4edf4,cosusay:0xf0dcc0,madutam:0xffc2b4};
const BGIMG={
  forest:'bg_forest',village:'bg_village',tide:'bg_tide',wine:'bg_wine',blood:'bg_blood',snow:'bg_snow',fire:'bg_fire',
  shang_city:'scene_shang_city',tam_xoa:'scene_tam_xoa_mountain',hutien:'scene_hutien_blessed',hoang_long:'scene_hoang_long_river',bach_cot:'scene_bach_cot'
};
// Tranh minh họa kinh điển cho các mốc sự kiện lớn (Quyển 1 & Quyển 2)
const EVENT_ILLUSTRATIONS={
  c_khaikhieu:'scene_fy_moonlight',
  c_nhanthu:'scene_yaole_bear',
  c_lang2:'scene_qingshu_vs_bai',
  c_bai:'scene_fy_bnb_vol1',
  c_nhatdai:'scene_first_ancestor_blood',
  c_final:'scene_bnb_ice',
  q2_hl_be:'scene_fy_bnb_vol2',
  q2_td_tamtu:'scene_kindness_shang',
  q2_td_thuongluong:'scene_shang_city',
  q2_tc_phe:'scene_fy_shangxinci',
  q2_tc_ket:'scene_tam_xoa_mountain',
  q2_bc_tron:'scene_footless_bird_fly',
  q2_tx_himi:'scene_three_kings_entrance',
  q2_tx_toi:'scene_three_kings_entrance',
  q2_bq_phong:'scene_refine_fixed_immortal',
  q2_pb_luyen:'scene_refine_fixed_immortal',
  q2_pb_phanboi:'scene_blood_skull_refine',
  q2_ng_hotien:'scene_hutien_blessed',
  q2_ng_dangHon:'scene_danghun_mountain',
  q2_pb_hotien:'scene_little_hu_danghun'
};
// Phông nền theo sự kiện
const EV_SCENE={
  c_lang1:'tide',c_lang2:'snow',c_lang3:'tide',c_luancong:'village',c_bai:'snow',c_huyetdong:'blood',c_nhatdai:'blood',c_thiet:'village',c_thietvay:'village',c_final:'fire',
  hs_khe:'wine',hs_bich:'wine',hs_ngam:'wine',hs_dong:'wine',hs_mo:'blood',c_baigia:'forest',c_kimsinh:'forest'
};
// Phông nền theo vị trí
const LOC_SCENE={
  hocduong:'village',trai:'village',nui:'forest',nhiemvu:'forest',diso:'forest',
  hl_song:'hoang_long',hl_rung:'forest',bc_nui:'bach_cot',bc_dong:'bach_cot',td_doan:'forest',
  tc_thanh:'shang_city',tx_nui:'tam_xoa',ng_hotien:'hutien',bq_dong:'blood',pb_phuc:'hutien'
};
function eventArt(id){
  const ev=EV[id]||{};
  if(ev.art)return asset('art/'+ev.art+'.jpg');
  if(EVENT_ILLUSTRATIONS[id])return asset('art/'+EVENT_ILLUSTRATIONS[id]+'.jpg');
  const chapBg=(typeof S!=='undefined'&&S.book===2&&typeof curChap==='function'&&curChap()&&curChap().bg)?curChap().bg:null;
  const sc=(typeof EV_SCENE!=='undefined'&&EV_SCENE[id])||ev.sc||(typeof LOC_SCENE!=='undefined'&&LOC_SCENE[ev.loc])||null;
  if(sc&&BGIMG[sc])return asset('art/'+BGIMG[sc]+'.jpg');
  if(chapBg)return asset('art/'+chapBg+'.jpg');
  return asset('art/'+(BGIMG[sc]||'bg_village')+'.jpg');
}

/* ================= HTML: khung đấu trường, bảng chỉ số, thanh kỹ năng ================= */
function combatId(c){return String(c.id||c.k)}
function renderCombat(st){
  if(S.combat.rt)return renderRT(st);
  const c=S.combat,art=Object.assign({k:c.k},ART[c.k]||{g:'敌',sc:'forest',c:'#ddd6c0'});
  // === [BATTLE-01/02: TACTICAL TURN-BASED] START ===
  const isTac=typeof TacticalBattle!=='undefined'&&TacticalBattle.isEnabled();
  if(isTac)TacticalBattle.ensure(c);
  // === [BATTLE-01/02: TACTICAL TURN-BASED] END ===
  let arena=$('arena');
  if(!arena||arena.dataset.cid!==combatId(c)){
    st.innerHTML=`
      ${isTac?TacticalBattle.renderTacticalBar():''}
      <div class="arena" id="arena" data-cid="${esc(combatId(c))}" style="--foe:${art.c}">
        <div class="scene-name">${SCENE_NAME[art.sc]}</div>
        <div class="seal" id="eIntent"></div>
        ${window.PIXI?'':`<div class="nofx"><span class="gl v">方源</span><span class="gl foe">${art.g}</span></div>`}
        <div class="plate p" id="pPlate"></div>
        <div class="plate e" id="ePlate"></div>
      </div>
      <div class="skillbar" id="skillbar"></div>`;
    arena=$('arena');
    Arena.mount(arena,art);
  }
  updateCombat();
  playFX();
}

function updateCombat(){
  const c=S.combat,e=ESS[S.chuyen];
  // === [BATTLE-01/02: TACTICAL TURN-BASED] START ===
  const isTac=typeof TacticalBattle!=='undefined'&&TacticalBattle.isEnabled();
  if(isTac){
    TacticalBattle.ensure(c);
    const th=$('tacticalHud');
    if(th)th.outerHTML=TacticalBattle.renderTacticalBar();
  }
  // === [BATTLE-01/02: TACTICAL TURN-BASED] END ===
  const pc=[];
  if(c.shield>0)pc.push(`<span class="chip shield">玉 Hộ thể ${c.shield} lượt · nhận ${Math.round(c.shieldRed*100)}%${c.reflect?` · phản ${Math.round(c.reflect*100)}%`:''}</span>`);
  if(c.poison>0)pc.push(`<span class="chip bleed">毒 Trúng độc ${c.poison}</span>`);
  if(c.suppress>0)pc.push(`<span class="chip stun">压 Uy áp ${c.suppress}: cổ tốn ×1.5</span>`);
  $('pPlate').innerHTML=`<b>Phương Nguyên</b><span class="rk">${rankName()}</span>
    <div class="mbar hp"><i style="width:${clamp(S.hp/maxHp()*100,0,100)}%"></i><em>${Math.max(0,S.hp)} / ${maxHp()}</em></div>
    ${isTac&&c.tactical?`<div class="mbar es" style="--c:${e.c}"><i style="width:${clamp(S.ess/c.tactical.essCycleCap*100,0,100)}%"></i><em>${Math.floor(S.ess)} / ${c.tactical.essCycleCap} (tuần hoàn)</em></div>`:`<div class="mbar es" style="--c:${e.c}"><i style="width:${clamp(S.ess/maxEss()*100,0,100)}%"></i><em>${Math.floor(S.ess)} / ${maxEss()} chân nguyên</em></div>`}
    ${pc.length?`<div class="chips">${pc.join('')}</div>`:''}`;
  const st=[];
  if(isTac&&c.tactical&&c.tactical.stagger>0)st.push(`<span class="chip trait" style="background:#78350f;color:#fde68a;">🎯 Lộ Sơ Hở (+30% ST)</span>`);
  if(c.bleed>0)st.push(`<span class="chip bleed">血 Chảy máu ${c.bleed}</span>`);
  if(c.stun>0)st.push(`<span class="chip stun">晕 Choáng ${c.stun}</span>`);
  if(c.atkBuff>0)st.push(`<span class="chip bleed">狂 Lực +${Math.round(c.atkBuff*100)}%</span>`);
  if(fury(c)>0)st.push(`<span class="chip bleed">怒 Cuồng nộ +${Math.round(fury(c)*100)}%</span>`);
  if(!c.flee)st.push(`<span class="chip stun">Không thể chạy</span>`);
  (c.tr||[]).forEach(t=>{const d=FOE_TR[t];st.push(`<span class="chip trait" title="${esc(d.d)}">${d.g} ${d.n}</span>`)});
  $('ePlate').innerHTML=`<b>${esc(c.n)}</b><span class="rk">Đòn ${c.atk[0]}–${c.atk[1]}${c.def?` · Giáp ${c.def}`:''}${c.boss?(c.phase2?' · Giai đoạn 2':' · Thủ lĩnh'):''}</span>
    <div class="mbar en"><i style="width:${clamp(c.hp/c.max*100,0,100)}%"></i><em>${Math.max(0,c.hp)} / ${c.max}</em></div>
    ${st.length?`<div class="chips">${st.join('')}</div>`:''}`;
  const stun=c.stun>0,it=stun?'guard':c.intent;
  $('eIntent').className=`seal ${it==='skill'?'heavy':it}`;
  $('eIntent').innerHTML=`<span>${stun?'晕':it==='skill'?'技':INTENT_SEAL[it]}</span><small>${stun?'Đang choáng, lượt này không đánh':esc(intentText(c))}</small>`;
  Arena.sync({ess:e.c,shield:c.shield>0,intent:stun?'stun':it==='skill'?'heavy':it});

  const gus=S.gu.map((g,i)=>({i,k:g.k,d:GU[g.k]})).filter(x=>['attack','guard','heal'].includes(x.d.t));
  const seen=new Set(),uniq=gus.filter(x=>!seen.has(x.k)&&seen.add(x.k));
  const combos=COMBOS.filter(cb=>(S.combos||{})[cb.id]&&cb.req.every(k=>hasGu(k)));
  // Lý do không dùng được: đang hồi chiêu, bị băng phong
  const lock=key=>(c.frozen[key]||0)>0?`Bị băng phong ${c.frozen[key]-1||1} lượt`:(c.cd[key]||0)>0?`Hồi chiêu ${c.cd[key]} lượt`:'';
  const energyHint=cost=>isTac?TacticalBattle.energyHint(cost):'';
  const withEnergy=(text,cost)=>{const hint=energyHint(cost);return hint?`${text} · ${hint}`:text};
  const sk=[{attr:'data-f="strike"',g:SKILL_GLYPH.strike,n:typeof lucName==='function'?lucName():'Đánh tay',s:`${typeof lucShow==='function'?lucShow():baseAtk()} sát thương${c.def?` (−${c.def} giáp)`:''} · không tốn chân nguyên`,cls:''}];
  if(isTac){
    const guarded=typeof enemyIntentRange==='function'?enemyIntentRange(c,true):null;
    sk.push({attr:'data-f="guard_stance"',g:'守',n:'Thủ thế cơ bản',s:`Không tốn chân nguyên · giảm 35% đòn trực tiếp kế tiếp${guarded?` · dự kiến nhận ${guarded[0]}–${guarded[1]}`:''}`,cls:'stance'});
  }
  uniq.forEach(x=>{
    const cost=guCostIdx(x.i),lk=lock(x.k),hungry=(S.gu[x.i].h||0)>0;
    const cdInfo=(CD[x.k]||0)>0?` · hồi ${CD[x.k]}`:'';
    sk.push({attr:`data-f="gu" data-i="${x.i}"`,g:SKILL_GLYPH[x.k]||'蛊',img:guImgUrl(x.k),n:x.d.n,cost,dis:!!lk||S.ess<cost,cdl:lk,
      s:lk||withEnergy((hungry?'Đang đói · ':'')+(x.d.t==='attack'?`${Math.round(x.d.dmg*rankMult()+passAtk())} sát thương${x.d.pierce?' · xuyên giáp':''}${x.d.aoe?' · diện rộng':''}${x.d.stun?' · choáng':''}${x.d.chill||x.d.slow?' · giảm lực địch':''}${x.d.bleed?' · chảy máu':''}${x.d.lifesteal?' · hút máu':''}${cdInfo}`:x.d.t==='guard'?`Nhận ${Math.round((SHIELD_RED[x.k]||.4)*100)}% sát thương${x.d.warm?' · chặn hàn khí':''}${cdInfo}`:`Hồi ${healAmt(x.k)} khí huyết${x.d.cure?' · giải độc':''}${cdInfo}`),cost),
      cls:x.d.t==='attack'?'atk':x.d.t==='guard'?'grd':'heal'});
  });
  combos.forEach(cb=>{const cost=costOf(cb.cost),lk=lock(cb.id);sk.push({attr:`data-combo="${cb.id}"`,g:SKILL_GLYPH[cb.id]||'招',n:cb.n,cost,dis:!!lk||S.ess<cost,cdl:lk,s:lk||withEnergy(cb.d+` · hồi ${COMBO_CD}`,cost),cls:'combo'})});
  const hl=lock('herb');
  sk.push({attr:'data-f="herb"',g:SKILL_GLYPH.herb,n:'Linh dược',s:hl||`Hồi 30, giải độc · còn ${S.herbs}`,dis:S.herbs<1||!!hl,cdl:hl,cls:'heal'});
  const absorbCap=isTac?c.tactical.essCycleCap:maxEss(),absorbFull=S.ess>=absorbCap&&absorbCap>=maxEss();
  sk.push({attr:'data-f="absorb"',g:'石',n:'Hấp thu nguyên thạch',s:isTac?`5 thạch → +20 chân nguyên và mở trần tuần hoàn · còn ${S.stones}`:`5 thạch → +20 chân nguyên · còn ${S.stones}`,dis:S.stones<5||absorbFull,cls:''});
  if(c.flee)sk.push({attr:'data-f="flee"',g:SKILL_GLYPH.flee,n:'Bỏ chạy',s:`${Math.round((.45+S.satphat*.01-(c.boss?.15:0))*100)}% thành công`,cls:'run'});
  if(autoEligible(c))sk.push({attr:'data-auto="1"',g:'自',n:'Tự đánh',s:S.hp<maxHp()*AUTO_STOP?'Khí huyết quá thấp':`Đánh nhanh trận thường, dừng khi khí huyết dưới ${AUTO_STOP*100}%`,dis:S.hp<maxHp()*AUTO_STOP,cls:'auto'});
  $('skillbar').innerHTML=sk.map((x,n)=>`<button class="skill ${x.cls}${x.cdl?' cooling':''}" ${x.attr} ${x.dis||FX.busy?'disabled':''}>
      <span class="sg${x.img?' has-img':''}"${x.img?` style="background-image:url('${x.img}')"`:''}>${x.img?'':x.g}</span><span class="st"><b>${esc(x.n)}</b><small>${esc(x.s)}</small></span>
      ${x.cost?`<span class="sc">${x.cost}</span>`:''}${n<9?`<kbd>${n+1}</kbd>`:''}</button>`).join('');
}

function setBusy(b){
  FX.busy=b;
  document.querySelectorAll('#skillbar .skill').forEach(el=>{if(b)el.dataset.lock=el.disabled?'1':'0',el.disabled=true;else if(el.dataset.lock==='0')el.disabled=false});
}
function playFX(){
  const q=FX.queue.splice(0);if(!q.length)return;
  let t=0;
  q.forEach(e=>{
    setTimeout(()=>Arena.play(e),t);
    t+=RM?60:({patk:430,combo:1150,eatk:420,ko:0,pdie:0}[e.type]??200);
  });
  if(q.some(e=>e.type==='ko'||e.type==='pdie'))return;
  setBusy(true);setTimeout(()=>setBusy(false),t+120);
}

function showToast(){
  const m=FX.toastMsg;FX.toastMsg=null;if(!m)return;
  const host=$('mainPanel');if(!host)return;
  const d=document.createElement('div');d.className='toast '+(m.cls||'');
  d.innerHTML=`<span class="tg">${m.g}</span><span><b>${esc(m.t)}</b>${m.sub?`<small>${esc(m.sub)}</small>`:''}</span>`;
  host.appendChild(d);
  const a=d.animate([{opacity:0,transform:'translate(-50%,-8px)'},{opacity:1,transform:'translate(-50%,0)',offset:.12},{opacity:1,offset:.8},{opacity:0,transform:'translate(-50%,-6px)'}],{duration:2600,easing:'ease-out'});
  a.onfinish=()=>d.remove();
}

/* ================= PixiJS ================= */
const SC={
  forest:{bg:['#0a1512','#17291f'],ink:0x040907,far:0x13241d,near:0x0a1511,part:'firefly',pc:0xc6ec8c,moon:1},
  village:{bg:['#12101a','#261c16'],ink:0x060509,far:0x1d1820,near:0x0e0b0e,part:'ember',pc:0xf2ac5c,moon:1},
  tide:{bg:['#090e14','#18222e'],ink:0x030507,far:0x141c26,near:0x080b10,part:'rain',pc:0xaac8e6},
  wine:{bg:['#15110a','#2a2010'],ink:0x070503,far:0x221a0e,near:0x100c06,part:'mote',pc:0xf2c86e},
  blood:{bg:['#190808','#321010'],ink:0x070101,far:0x2a0c0c,near:0x120404,part:'ember',pc:0xee543e},
  snow:{bg:['#0d141a','#1f2e3b'],ink:0x04070a,far:0x1a2733,near:0x0c131a,part:'snow',pc:0xf0f7ff,moon:1},
  fire:{bg:['#160a06','#381709'],ink:0x050201,far:0x2a1209,near:0x120603,part:'ember',pc:0xff8a3a},
};

const Arena=(function(){
  let low=false,fpsN=0,fpsT=0,TX={},app=null,host=null,root,L={},W=0,H=0,tw=[],parts=[],wx=[],sc,art,P=null,E=null,T=0,shake=0,stop_=0,pend=[],state={},ready=false,nextBolt=0,tex={};
  const col=h=>parseInt(String(h).replace('#',''),16);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const ease={out:p=>1-Math.pow(1-p,3),in:p=>p*p*p,back:p=>{const c=1.7;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2)},lin:p=>p};
  function tween(dur,upd,done,e){tw.push({t:0,dur:RM?Math.min(dur,120):dur,upd,done,e:e||ease.out})}
  function seeded(s){return ()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

  function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return PIXI.Texture.from(c)}
  function makeTextures(){
    if(tex.soft)return;
    tex.soft=canvasTex(64,64,(x,w)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
    tex.dot=canvasTex(16,16,x=>{x.fillStyle='#fff';x.beginPath();x.arc(8,8,7,0,7);x.fill()});
    tex.vig=canvasTex(256,256,x=>{const g=x.createRadialGradient(128,128,60,128,128,182);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.75)');x.fillStyle=g;x.fillRect(0,0,256,256)});
    tex.streak=canvasTex(4,32,x=>{const g=x.createLinearGradient(0,0,0,32);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.9)');x.fillStyle=g;x.fillRect(1,0,2,32)});
    tex.beam=canvasTex(256,24,x=>{const g=x.createLinearGradient(0,0,0,24);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,256,24)});
    tex.crescent=canvasTex(96,96,x=>{x.fillStyle='#fff';x.shadowColor='#fff';x.shadowBlur=10;x.beginPath();x.arc(40,48,34,-1.3,1.3);x.arc(28,48,30,1.15,-1.15,true);x.closePath();x.fill()});
    tex.shard=canvasTex(48,12,x=>{x.fillStyle='#fff';x.shadowColor='#fff';x.shadowBlur=6;x.beginPath();x.moveTo(0,6);x.lineTo(14,1);x.lineTo(48,6);x.lineTo(14,11);x.closePath();x.fill()});
    tex.bat=canvasTex(48,28,x=>{x.fillStyle='#fff';x.beginPath();x.moveTo(24,10);x.quadraticCurveTo(12,0,0,6);x.quadraticCurveTo(8,10,6,18);x.quadraticCurveTo(14,14,18,22);x.lineTo(24,16);x.lineTo(30,22);x.quadraticCurveTo(34,14,42,18);x.quadraticCurveTo(40,10,48,6);x.quadraticCurveTo(36,0,24,10);x.fill()});
    tex.claw=canvasTex(160,12,x=>{const g=x.createLinearGradient(0,0,160,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.3,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,6);x.quadraticCurveTo(80,-2,160,6);x.quadraticCurveTo(80,8,0,6);x.fill()});
  }
  const IMG={};
  // Tải ảnh; mask=true thì làm mờ viền theo hình elip để hòa vào cảnh
  function loadTex(name,mask){
    const key=name+(mask?'@m':'');
    if(IMG[key])return IMG[key];
    return IMG[key]=new Promise(res=>{
      const im=new Image();
      im.onload=()=>{
        if(!mask){res(PIXI.Texture.from(im));return}
        const c=document.createElement('canvas'),w=im.naturalWidth,h=im.naturalHeight;c.width=w;c.height=h;
        const x=c.getContext('2d');x.drawImage(im,0,0);
        x.globalCompositeOperation='destination-in';
        x.save();x.translate(w/2,h*.47);x.scale(1,h/w*.92);
        const g=x.createRadialGradient(0,0,w*.18,0,0,w*.52);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.7,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,0)');
        x.fillStyle=g;x.fillRect(-w,-h,w*2,h*2);x.restore();
        res(PIXI.Texture.from(c));
      };
      im.onerror=()=>res(null);
      im.src=asset('art/'+name+'.jpg');
    });
  }
  function gradSprite(c0,c1){return new PIXI.Sprite(canvasTex(4,256,(x)=>{const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.fillRect(0,0,4,256)}))}

  function fontsReady(){
    if(!document.fonts||!document.fonts.load)return Promise.resolve();
    const glyphs='方源'+Object.values(ART).map(a=>a.g).join('')+Object.values(SKILL_GLYPH).join('');
    return Promise.race([Promise.all([document.fonts.load(`64px ${BRUSH}`,glyphs),document.fonts.load(`700 32px ${DISPLAY}`,'0123456789+−')]),new Promise(r=>setTimeout(r,1500))]).catch(()=>{});
  }

  async function mount(el,a){
    host=el;art=a;sc=SC[a.sc]||SC.forest;ready=false;pend=[];
    if(!window.PIXI)return;
    if(!app){
      app=new PIXI.Application({backgroundAlpha:0,antialias:true,resolution:Math.min(2,window.devicePixelRatio||1),autoDensity:true,resizeTo:el});
      app.ticker.add(tick);
    }else app.resizeTo=el;
    app.view.className='pixi';
    el.prepend(app.view);
    app.start();
    makeTextures();
    const foeName = typeof PORTRAIT[art.k] === 'function' ? PORTRAIT[art.k]() : (PORTRAIT[art.k] || 'p_cultivator');
    const want=[loadTex('p_hero',true),loadTex(foeName,true),loadTex(BGIMG[art.sc]||'bg_forest',false)];
    const [hero,foe,bg]=await Promise.race([Promise.all([fontsReady().then(()=>0),...want]).then(r=>r.slice(1)),new Promise(r=>setTimeout(()=>r([null,null,null]),5000))]);
    TX={hero,foe,bg};
    if(host!==el||!el.isConnected)return;
    build();ready=true;
    pend.splice(0).forEach(play);
  }
  function stop(){fpsN=0;fpsT=0;if(app){app.stop();app.stage.removeChildren().forEach(c=>c.destroy({children:true}))}ready=false;host=null;tw=[];parts=[];wx=[]}

  /* ---------- dựng cảnh ---------- */
  function mountains(rng,baseY,amp,color,alpha,step){
    const g=new PIXI.Graphics();g.beginFill(color,alpha);g.moveTo(-40,H+20);
    let y=baseY;for(let x=-40;x<=W+40;x+=step){y=baseY-amp*(.35+.65*rng())*(Math.sin(x*.004+rng())*.5+.8);g.lineTo(x,y)}
    g.lineTo(W+40,H+20);g.closePath();g.endFill();return g;
  }
  function brushRing(R,color){
    const g=new PIXI.Graphics(),rng=seeded(11);
    const a0=-2.2,a1=a0+Math.PI*1.72;
    for(let a=a0;a<a1;a+=.018){
      const p=(a-a0)/(a1-a0),w=R*.13*(p<.1?p/.1:p>.85?(1-p)/.15*1:1)*(.75+.25*Math.sin(a*9))+1.5;
      const rr=R+(rng()-.5)*3;
      g.beginFill(color,.85+.15*rng());g.drawCircle(Math.cos(a)*rr,Math.sin(a)*rr,w/2);g.endFill();
      if(rng()<.08){g.beginFill(color,.5);g.drawCircle(Math.cos(a)*(rr+rnd(-w,w)),Math.sin(a)*(rr+rnd(-w,w)),rnd(1,2.5));g.endFill()}
    }
    return g;
  }
  function brushText(t,size,fill,extra){
    return new PIXI.Text(t,Object.assign({fontFamily:BRUSH,fontSize:size,fill,align:'center',lineHeight:size*1.02,
      dropShadow:true,dropShadowColor:'#000000',dropShadowBlur:14,dropShadowDistance:0,dropShadowAlpha:.85,padding:20},extra||{}));
  }
  function sprite(t,tint,blend,alpha,scale){const s=new PIXI.Sprite(tex[t]);s.anchor.set(.5);s.tint=tint;if(blend)s.blendMode=PIXI.BLEND_MODES.ADD;s.alpha=alpha??1;if(scale)s.scale.set(scale);return s}

  function build(){
    app.stage.removeChildren().forEach(c=>c.destroy({children:true}));
    tw=[];parts=[];wx=[];L={};
    W=app.screen.width;H=app.screen.height;
    const rng=seeded(art.g.charCodeAt(0));
    root=new PIXI.Container();app.stage.addChild(root);
    const bg=gradSprite(sc.bg[0],sc.bg[1]);bg.x=bg.y=-30;bg.width=W+60;bg.height=H+60;root.addChild(bg);
    L.sky=new PIXI.Container();L.far=new PIXI.Container();L.near=new PIXI.Container();L.wx=new PIXI.Container();
    L.fig=new PIXI.Container();L.fx=new PIXI.Container();L.ui=new PIXI.Container();L.top=new PIXI.Container();
    root.addChild(L.sky,L.far,L.near,L.wx,L.fig,L.fx,L.ui);app.stage.addChild(L.top);

    if(TX.bg){
      const b=new PIXI.Sprite(TX.bg);b.anchor.set(.5);const k=Math.max(W/TX.bg.width,H/TX.bg.height)*1.08;
      b.scale.set(k);b.position.set(W/2,H/2);L.sky.addChild(b);L.bgimg=b;L.bgk=k;
      const dim=new PIXI.Graphics();dim.beginFill(0x000000,{snow:.5,village:.45,wine:.35}[art.sc]||.3);dim.drawRect(0,0,W,H);dim.endFill();L.sky.addChild(dim);
    }else{
    if(sc.moon){
      const mx=W*.84,my=H*.2,mr=Math.min(W,H)*.075;
      L.sky.addChild(sprite('soft',0xece8cf,true,.35,mr*.16));
      L.sky.children[0].position.set(mx,my);
      const m=new PIXI.Graphics();m.beginFill(0xf1ecd2,.9);m.drawCircle(mx,my,mr);m.endFill();L.sky.addChild(m);
    }
    L.far.addChild(mountains(rng,H*.55,H*.28,sc.far,1,W/14));
    L.far.addChild(mountains(rng,H*.7,H*.18,sc.near,1,W/10));
    props(rng);
    }

    // bóng đất
    const ground=new PIXI.Graphics();ground.beginFill(0x000000,.35);ground.drawEllipse(W*.26,H*.66,W*.1,H*.035);ground.drawEllipse(W*.74,H*.66,W*.11,H*.04);ground.endFill();L.near.addChild(ground);

    // Phương Nguyên
    const pr=Math.min(H*.22,86);
    P={c:new PIXI.Container(),bx:W*.26,by:H*.42};
    P.c.position.set(P.bx,P.by);
    P.as=pr*.04;P.aura=sprite('soft',col(state.ess||'#5fae8a'),true,.55,P.as);
    P.ring=new PIXI.Graphics();P.ring.lineStyle(3,0x7fd1a8,.85);P.ring.drawCircle(0,0,pr*.95);P.ring.lineStyle(10,0x7fd1a8,.18);P.ring.drawCircle(0,0,pr*.95);P.ring.visible=false;
    if(TX.hero){
      const k=(H*.9)/TX.hero.height;
      P.lv=makeLiving(TX.hero,'p_hero',k);P.t=P.lv.c;
      P.flash=P.lv.add;P.flash.tint=0xff3a20;P.flash.alpha=0;
      P.by=H*.5;P.c.y=P.by;P.as*=1.5;P.aura.scale.set(P.as);
    }else{
      P.t=brushText('方\n源',pr*.62,0xece8cf);P.t.anchor.set(.5);
      P.flash=brushText('方\n源',pr*.62,0xff5040,{dropShadow:false});P.flash.anchor.set(.5);P.flash.alpha=0;
    }
    P.c.addChild(P.aura,P.ring,P.t);if(!P.lv)P.c.addChild(P.flash);L.fig.addChild(P.c);

    // Kẻ địch
    const er=Math.min(H*.27,100),fc=col(art.c);
    E={c:new PIXI.Container(),bx:W*.74,by:H*.4,r:er,col:fc};
    E.c.position.set(E.bx,E.by);
    E.glow=sprite('soft',fc,true,.22,er*.045);
    E.ring=brushRing(er,0xffffff);E.ring.tint=fc;E.ring.alpha=.8;
    if(TX.foe){
      const k=(H*.92)/TX.foe.height*(art.k==='langvuong'||art.k==='hachung'?1.08:1);
      const foeName = typeof PORTRAIT[art.k] === 'function' ? PORTRAIT[art.k]() : (PORTRAIT[art.k] || 'p_cultivator');
      E.lv=makeLiving(TX.foe,foeName,k);E.t=E.lv.c;E.lv.plane.tint=PTINT[art.k]||0xffffff;
      E.flash=E.lv.add;E.flash.alpha=0;
      E.by=H*.5;E.c.y=E.by;E.r=Math.min(H*.3,110);E.ring.alpha=.3;E.ring.scale.set(1.5);
      E.seal=brushText(art.g,34,fc,{dropShadowBlur:8});E.seal.anchor.set(.5);E.seal.position.set(-TX.foe.width*k*.34,-TX.foe.height*k*.36);E.seal.alpha=.9;
    }else{
      E.t=brushText(art.g,er*1.15,fc);E.t.anchor.set(.5);
      E.flash=brushText(art.g,er*1.15,0xffffff,{dropShadow:false});E.flash.anchor.set(.5);E.flash.alpha=0;
    }
    E.c.addChild(E.glow,E.ring,E.t);if(!E.lv)E.c.addChild(E.flash);if(E.seal)E.c.addChild(E.seal);L.fig.addChild(E.c);

    // hạt thời tiết
    const n={firefly:26,ember:40,rain:110,mote:34,snow:80}[sc.part];
    for(let i=0;i<n;i++)wx.push(newWx(true));

    const vig=new PIXI.Sprite(tex.vig);vig.width=W;vig.height=H;L.top.addChild(vig);
    L.flash=new PIXI.Graphics();L.flash.beginFill(0xffffff);L.flash.drawRect(0,0,W,H);L.flash.endFill();L.flash.alpha=0;L.top.addChild(L.flash);
    nextBolt=T+1800;
    applyState();
  }

  function props(rng){
    const g=new PIXI.Graphics();
    if(art.sc==='forest'){
      L.bamboo=[];
      for(let i=0;i<10;i++){
        const b=new PIXI.Graphics(),x=rng()*W,w=4+rng()*7,h=H*1.1,seg=26+rng()*26;
        b.beginFill(sc.ink,.8);b.drawRect(-w/2,-h,w,h);
        for(let y=-seg*rng();y>-h;y-=seg){b.drawRect(-w/2-1.5,y,w+3,2.5)}
        for(let k=0;k<5;k++){const ly=-h*(.3+rng()*.6),dir=rng()<.5?-1:1;b.drawPolygon([0,ly,dir*(22+rng()*16),ly+6+rng()*6,dir*4,ly+3])}
        b.endFill();b.position.set(x,H+4);b.ph=rng()*6;L.near.addChild(b);L.bamboo.push(b);
      }
    }else if(art.sc==='village'||art.sc==='fire'){
      g.beginFill(sc.ink,.92);
      for(let x=-20;x<W+60;x+=90+rng()*50){
        const w=70+rng()*50,y=H*(.72+rng()*.08),h=22+rng()*14;
        g.drawRect(x+w*.15,y,w*.7,H-y);
        g.drawPolygon([x-8,y+4,x+4,y-4,x+w*.25,y-h,x+w*.75,y-h,x+w-4,y-4,x+w+8,y+4]);
        if(art.sc==='village'){L.lan=L.lan||[];L.lan.push({x:x+w*.5,y:y+10})}
      }
      g.endFill();L.near.addChild(g);
      (L.lan||[]).forEach(p=>{const s=sprite('soft',0xf09040,true,.55,.6);s.position.set(p.x,p.y);s.ph=rng()*6;L.near.addChild(s);p.s=s});
      if(art.sc==='fire'){L.fireGlow=sprite('soft',0xff6a20,true,.35,1);L.fireGlow.position.set(W/2,H);L.fireGlow.width=W*1.6;L.fireGlow.height=H*.9;L.near.addChild(L.fireGlow)}
    }else if(art.sc==='tide'){
      const wh=H*.22;g.beginFill(sc.ink,.95);g.drawRect(-10,H-wh,W+20,wh);
      for(let x=0;x<W;x+=30)g.drawRect(x,H-wh-12,17,12);g.endFill();L.near.addChild(g);
      L.eyes=[];
      for(let i=0;i<9;i++){const e=new PIXI.Container(),x=rng()*W,y=H*(.5+rng()*.12);
        [-5,5].forEach(dx=>{const s=sprite('soft',0x9dff8a,true,.9,.12);s.x=dx;e.addChild(s)});e.position.set(x,y);e.ph=rng()*20;L.far.addChild(e);L.eyes.push(e)}
    }else if(art.sc==='wine'||art.sc==='blood'){
      g.beginFill(sc.ink,.95);
      for(let x=-20;x<W+20;x+=26+rng()*24){const w=16+rng()*20,h=18+rng()*H*.18;g.drawPolygon([x,-2,x+w,-2,x+w*.5,h])}
      g.drawRect(-10,H-16,W+20,20);g.endFill();L.near.addChild(g);
      if(art.sc==='blood'){const pool=sprite('soft',0xc02a1a,true,.45,1);pool.position.set(W/2,H);pool.width=W*1.2;pool.height=H*.5;L.near.addChild(pool)}
    }else if(art.sc==='snow'){
      g.beginFill(sc.ink,.9);
      for(let i=0;i<8;i++){const x=rng()*W,h=H*(.2+rng()*.2),y=H+2;g.drawPolygon([x-h*.3,y,x,y-h,x+h*.3,y])}
      g.endFill();L.near.addChild(g);
    }
  }

  function newWx(init){
    const k=sc.part,o={k};
    const t=k==='rain'?'streak':'soft';
    o.s=new PIXI.Sprite(tex[t]);o.s.anchor.set(.5);o.s.tint=sc.pc;
    if(k!=='snow'&&k!=='rain')o.s.blendMode=PIXI.BLEND_MODES.ADD;
    o.ph=rnd(0,6);
    const x=rnd(0,W),y=init?rnd(0,H):(k==='snow'||k==='rain'?-20:H+20);
    o.s.position.set(x,y);
    switch(k){
      case 'firefly':o.vx=rnd(-.25,.25);o.vy=rnd(-.2,.2);o.s.scale.set(rnd(.12,.25));break;
      case 'ember':o.vx=rnd(-.3,.3);o.vy=-rnd(.4,1.3);o.s.scale.set(rnd(.08,.16));break;
      case 'mote':o.vx=rnd(-.15,.15);o.vy=-rnd(.1,.3);o.s.scale.set(rnd(.08,.15));break;
      case 'snow':o.vx=rnd(-.5,-.1);o.vy=rnd(.5,1.2);o.s.scale.set(rnd(.07,.14));o.s.alpha=.85;break;
      case 'rain':o.vx=-1.4;o.vy=rnd(10,14);o.s.rotation=.1;o.s.scale.set(1,rnd(.6,1.1));o.s.alpha=.35;break;
    }
    L.wx.addChild(o.s);return o;
  }

  /* ---------- trạng thái bền (khiên, ý đồ, màu chân nguyên) ---------- */
  function sync(s){state=Object.assign(state,s);if(ready)applyState()}
  function applyState(){
    if(!P)return;
    P.aura.tint=col(state.ess||'#5fae8a');
    P.ring.visible=!!state.shield;
    E.ring.tint=state.intent==='heavy'?0xe0442c:state.intent==='guard'||state.intent==='stun'?0x7fd1a8:E.col;
  }

  /* ---------- hạt hiệu ứng ---------- */
  // Đấu trường đã đóng thì bỏ qua (hẹn giờ của hiệu ứng có thể chạy trễ)
  function live(){return ready&&L.fx&&!L.fx.destroyed}
  function particle(o){
    if(!live()||(low&&Math.random()<.55))return;
    const s=new PIXI.Sprite(tex[o.tex||'soft']);s.anchor.set(.5);s.tint=o.tint??0xffffff;
    if(o.add!==false)s.blendMode=PIXI.BLEND_MODES.ADD;
    s.position.set(o.x,o.y);s.scale.set(o.sc||.2);s.alpha=o.a??1;s.rotation=o.rot||0;
    (o.layer||L.fx).addChild(s);
    parts.push({s,vx:o.vx||0,vy:o.vy||0,g:o.g||0,life:o.life||600,max:o.life||600,a0:s.alpha,grow:o.grow||0,drag:o.drag??.98});
  }
  function sparks(x,y,tint,n,spd){for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),v=rnd(spd*.4,spd);particle({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,tint,sc:rnd(.06,.14),life:rnd(250,550),drag:.9})}}
  function ink(x,y,tint,n,spd){for(let i=0;i<n;i++){const a=rnd(-Math.PI,0)+rnd(-.6,.6),v=rnd(spd*.3,spd);particle({tex:'dot',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,g:.18,tint,add:false,sc:rnd(.25,.7),life:rnd(500,900),drag:.97})}}
  function ring(x,y,tint,r0,r1,w,dur){
    if(!live())return;
    const g=new PIXI.Graphics();g.position.set(x,y);g.blendMode=PIXI.BLEND_MODES.ADD;L.fx.addChild(g);
    tween(dur,p=>{g.clear();g.lineStyle(w*(1-p)+1,tint,1-p);g.drawCircle(0,0,r0+(r1-r0)*p)},()=>g.destroy());
  }
  function num(side,text,style){
    if(!live())return;
    const F=side==='p'?P:E;if(!F)return;
    const big=style==='crit',small=style==='dot'||style==='txt';
    const fill={gu:0xc4e6ff,crit:0xf0c46a,taken:0xff8e7a,heal:0x8fe0b0,dot:0xff7b72,reflect:0x86e0b0,txt:0xece8cf}[style]||0xf4efe0;
    const t=new PIXI.Text(text,{fontFamily:style==='txt'?'"Be Vietnam Pro", sans-serif':DISPLAY,fontWeight:'700',fontSize:big?50:small?(style==='txt'?15:24):34,fill,
      stroke:'#000000',strokeThickness:big?6:4,dropShadow:true,dropShadowColor:'#000',dropShadowBlur:8,dropShadowDistance:0,letterSpacing:style==='txt'?2:0});
    t.anchor.set(.5);const x=F.c.x+rnd(-24,24),y=F.c.y-(side==='p'?60:E.r*.9);t.position.set(x,y);L.ui.addChild(t);
    t.scale.set(.4);
    tween(big?1200:950,p=>{t.y=y-p*60;t.scale.set(p<.18?.4+ease.back(p/.18)*.8:1.2-(p-.18)*.25);t.alpha=p<.7?1:1-(p-.7)/.3},()=>t.destroy(),ease.lin);
  }
  function flashScreen(tint,a,dur){if(!L.flash)return;L.flash.tint=tint;tween(dur,p=>{L.flash.alpha=a*(1-p)},null,ease.lin)}
  function hit(F,strength){
    if(!RM){stop_=Math.max(stop_,strength>1?110:60);shake=Math.max(shake,6*strength)}
    F.flash.alpha=1;tween(220,p=>{F.flash.alpha=1-p});
    const dir=F===E?1:-1;tween(240,p=>{F.c.x=F.bx+dir*14*strength*Math.sin(p*Math.PI)});
    leanPulse(F,dir*.25*Math.min(1.6,strength),360);
    if(F===E){pose(E,{head:-.22,jawOpen:1,squint:.8,earL:.35,earR:-.35,legFL:-.1,legFR:-.08,tail:-.3},120);rest(E,480,strength>1?300:160)}
  }

  /* ---------- tư thế tranh sống ---------- */
  // Đổi dần các góc xương / thông số của tranh sống F sang target; khóa không có xương thì bị bỏ qua
  function pose(F,target,ms,e,done){if(!F||!F.lv)return;const lv=F.lv,from={};for(const k in target)from[k]=lv.act[k]||0;
    tween(ms,p=>{for(const k in target)lv.act[k]=from[k]+(target[k]-from[k])*p},done,e||ease.out)}
  function rest(F,ms,delay){if(!F||!F.lv)return;setTimeout(()=>{const t={};for(const k in F.lv.act)t[k]=0;pose(F,t,ms||450)},RM?0:(delay||0))}
  function leanPulse(F,amt,ms){if(!F||!F.lv)return;tween(ms,p=>{F.lv.lean=amt*Math.sin(p*Math.PI)},()=>{F.lv.lean=0})}
  // Điểm trên tranh (tỉ lệ 0..1) theo tọa độ cảnh
  function spot(F,u,v){if(!F.lv)return {x:F.c.x,y:F.c.y};const q=F.lv.world(u,v,T);return {x:F.c.x+q[0]*F.c.scale.x,y:F.c.y+q[1]*F.c.scale.y}}

  /* ---------- đòn đánh ---------- */
  function projectile(kind,land){
    const h=P.lv&&P.lv.def.hand?spot(P,P.lv.def.hand[0],P.lv.def.hand[1]):{x:P.c.x+30,y:P.c.y};
    const a={x:h.x,y:h.y},b=E.lv&&E.lv.def.mouth?spot(E,.25,.45):{x:E.c.x,y:E.c.y},ang=Math.atan2(b.y-a.y,b.x-a.x),dist=Math.hypot(b.x-a.x,b.y-a.y);
    if(RM){land();return}
    if(kind==='nguyetmang'){
      const bm=new PIXI.Sprite(tex.beam);bm.anchor.set(0,.5);bm.position.set(a.x,a.y);bm.rotation=ang;bm.tint=0xbfe6ff;bm.blendMode=PIXI.BLEND_MODES.ADD;L.fx.addChild(bm);
      const core=new PIXI.Sprite(tex.beam);core.anchor.set(0,.5);core.position.set(a.x,a.y);core.rotation=ang;core.blendMode=PIXI.BLEND_MODES.ADD;L.fx.addChild(core);
      let landed=false;
      tween(380,p=>{const s=Math.min(1,p*2.2);bm.scale.set(dist/256*s,1.8*(1-p*.6));core.scale.set(dist/256*s,.5);bm.alpha=core.alpha=p<.6?1:1-(p-.6)/.4;
        if(!landed&&s>=1){landed=true;land()}},()=>{bm.destroy();core.destroy()});
      return;
    }
    const el=GU_EL[kind]||'nguyet',tint=EL_TINT[el];
    // Băng: loạt mảnh băng bay thẳng
    if(el==='bang'){
      let landed=false;
      for(let n=0;n<5;n++)setTimeout(()=>{
        if(!live())return;
        const sh=new PIXI.Sprite(tex.shard);sh.anchor.set(.5);sh.tint=tint;sh.blendMode=PIXI.BLEND_MODES.ADD;sh.rotation=ang;L.fx.addChild(sh);
        const oy=rnd(-18,18);
        tween(260,p=>{sh.x=a.x+(b.x-a.x)*p;sh.y=a.y+(b.y-a.y)*p+oy*(1-p);particle({x:sh.x,y:sh.y,tint,sc:.05,life:200,drag:1})},()=>{sh.destroy();sparks(b.x,b.y,tint,5,4);if(!landed){landed=true;ring(b.x,b.y,tint,10,E.r*1.1,6,380);land()}},ease.in);
      },n*45);
      return;
    }
    // Phong: cơn lốc cuộn tới rồi nổ thành nhiều vòng (đánh cả vùng)
    if(el==='phong'){
      tween(420,p=>{const x=a.x+(b.x-a.x)*p,y=a.y+(b.y-a.y)*p;
        for(let q=0;q<3;q++){const an=T/60+q*2.1+p*14,r=10+p*26;particle({x:x+Math.cos(an)*r,y:y+Math.sin(an)*r*.5,tint,sc:rnd(.08,.16),life:260,vy:-.6,drag:.95})}},
        ()=>{[0,90,180].forEach((d,q)=>setTimeout(()=>ring(b.x,b.y,tint,10,E.r*(1.2+q*.35),8,420),d));land()},ease.lin);
      return;
    }
    // Đao Sí Huyết Bức: bầy dơi bay vòng rồi cắn xé
    if(el==='buc'){
      let landed=false;
      for(let n=0;n<8;n++){
        const bt=new PIXI.Sprite(tex.bat);bt.anchor.set(.5);bt.tint=tint;bt.blendMode=PIXI.BLEND_MODES.ADD;bt.scale.set(rnd(.6,1));bt.position.set(a.x,a.y);L.fx.addChild(bt);
        const cy=rnd(-90,60),cx=rnd(-40,60),ph=rnd(0,6),s0=bt.scale.x;
        setTimeout(()=>live()&&tween(480,p=>{const q=1-p;bt.x=q*q*a.x+2*q*p*((a.x+b.x)/2+cx)+p*p*(b.x+rnd(-10,10));bt.y=q*q*a.y+2*q*p*((a.y+b.y)/2+cy)+p*p*b.y;bt.scale.y=s0*(.4+.6*Math.abs(Math.sin(T/40+ph)))},
          ()=>{bt.destroy();sparks(b.x,b.y,tint,4,4);if(!landed){landed=true;land()}},ease.lin),n*35);
      }
      return;
    }
    // Nguyệt nhận: dáng bay theo từng loại
    const o={nguyet:{d:320,arc:24,spin:3,sc:.9},huyet:{d:320,arc:24,spin:3,sc:1},ngan:{d:220,arc:4,spin:1,sc:.8,trail:.5},
      toan:{d:460,arc:110,spin:5,sc:1.1},kim:{d:380,arc:10,spin:9,sc:1.1,saw:1}}[el]||{d:320,arc:24,spin:3,sc:.9};
    const cr=new PIXI.Sprite(tex.crescent);cr.anchor.set(.5);cr.tint=tint;cr.blendMode=PIXI.BLEND_MODES.ADD;cr.scale.set(o.sc);cr.position.set(a.x,a.y);L.fx.addChild(cr);
    const cr2=o.saw?new PIXI.Sprite(tex.crescent):null;if(cr2){cr2.anchor.set(.5);cr2.tint=tint;cr2.blendMode=PIXI.BLEND_MODES.ADD;cr2.scale.set(o.sc);L.fx.addChild(cr2)}
    const gl=sprite('soft',tint,true,.7,1.4);gl.position.copyFrom(cr.position);L.fx.addChild(gl);
    tween(o.d,p=>{
      cr.x=gl.x=a.x+(b.x-a.x)*p;cr.y=gl.y=a.y+(b.y-a.y)*p-Math.sin(p*Math.PI)*o.arc;cr.rotation=p*Math.PI*o.spin;
      if(cr2){cr2.position.copyFrom(cr.position);cr2.rotation=cr.rotation+Math.PI;if(Math.random()<.5)sparks(cr.x,cr.y,tint,1,3)}
      const ghost=new PIXI.Sprite(tex.crescent);ghost.anchor.set(.5);ghost.tint=tint;ghost.blendMode=PIXI.BLEND_MODES.ADD;ghost.position.copyFrom(cr.position);ghost.rotation=cr.rotation;ghost.scale.set(o.sc*.95);ghost.alpha=o.trail||.35;L.fx.addChild(ghost);
      parts.push({s:ghost,vx:0,vy:0,g:0,life:o.trail?260:180,max:o.trail?260:180,a0:ghost.alpha,grow:-.002,drag:1});
    },()=>{cr.destroy();gl.destroy();if(cr2)cr2.destroy();land()},ease.in);
  }
  // Địch né: lách sang bên, không có vệt trúng
  function dodge(){tween(300,p=>{E.c.x=E.bx+40*Math.sin(p*Math.PI);E.c.y=E.by-10*Math.sin(p*Math.PI)});num('e','Né','txt')}
  function impact(color,strength){
    hit(E,strength);
    ring(E.c.x,E.c.y,color,E.r*.3,E.r*1.5,8*strength,420);
    sparks(E.c.x,E.c.y,color,12*strength,7*strength);
    ink(E.c.x,E.c.y,art.sc==='blood'||color===0xff5a44?0x5a0c08:sc.ink,8*strength,5*strength);
  }

  const PLAY={
    patk(e){
      const color=e.kind==='fist'?EL_TINT.fist:EL_TINT[GU_EL[e.kind]]||0x9fd8ff;
      const land=()=>{if(e.miss)return dodge();impact(color,e.kind==='fist'?1:1.3);num('e','−'+e.dmg,e.kind==='fist'?'':'gu')};
      if(e.kind==='fist'){tween(220,p=>{P.c.x=P.bx+50*Math.sin(p*Math.PI)});leanPulse(P,.35,300);pose(P,{arm:-.3,fore:-.2},120);rest(P,400,200);setTimeout(land,RM?0:110)}
      else{
        tween(160,p=>{P.aura.scale.set(P.as*(1+.5*Math.sin(p*Math.PI)))});
        pose(P,{arm:.25,fore:.3,head:-.04,eyeGlow:.6},110,null,()=>pose(P,{arm:-.5,fore:-.42,head:.07,eyeGlow:1},150));
        leanPulse(P,.3,420);rest(P,520,380);
        setTimeout(()=>live()&&projectile(e.kind,land),RM?0:200);
      }
    },
    combo(e){
      const cb=COMBOS.find(x=>x.id===e.id);
      if(cb&&!RM)cutIn(cb.n);
      setTimeout(()=>live()&&comboHit(e),RM?0:560);
    },
  };
  // Cảnh cắt khi tung sát chiêu: dải mực, chân dung trượt vào, tên chiêu hiện dần như nét bút
  function cutIn(name){
    const band=new PIXI.Container(),bh=H*.34,y0=H*.5-bh/2;L.ui.addChild(band);
    const ink_=new PIXI.Graphics();ink_.beginFill(0x050605,.88);ink_.drawRect(0,y0,W,bh);ink_.endFill();
    ink_.beginFill(0xf0c46a,.7);ink_.drawRect(0,y0,W,2);ink_.drawRect(0,y0+bh-2,W,2);ink_.endFill();band.addChild(ink_);
    if(TX.hero){const hp=new PIXI.Sprite(TX.hero);const k=bh*1.6/TX.hero.height;hp.scale.set(k);hp.anchor.set(.5,.3);hp.position.set(-W*.2,H*.5);
      const m=new PIXI.Graphics();m.beginFill(0xffffff);m.drawRect(0,y0,W,bh);m.endFill();hp.mask=m;band.addChild(hp,m);
      tween(420,p=>{hp.x=-W*.2+W*.42*p},null,ease.out)}
    const t=brushText(name,Math.min(bh*.42,56),0xf0c46a,{dropShadowColor:'#8a5a10',dropShadowBlur:18});t.anchor.set(0,.5);t.position.set(W*.36,H*.5);band.addChild(t);
    const tm=new PIXI.Graphics();band.addChild(tm);t.mask=tm;
    tween(460,p=>{tm.clear();tm.beginFill(0xffffff);tm.drawRect(t.x-10,y0,(t.width+30)*p,bh);tm.endFill()},null,ease.lin);
    ink_.scale.x=0;tween(200,p=>{ink_.scale.x=p});
    setTimeout(()=>tween(260,p=>{band.alpha=1-p},()=>band.destroy({children:true})),800);
  }
  function comboHit(e){
      const onFoe=!!e.dmg||!!e.miss,F=onFoe?E:P;
      pose(P,onFoe?{arm:-.8,fore:-.5,head:.1,hair:-.3,eyeGlow:1}:{arm:-.3,fore:-.6,head:.04,eyeGlow:.7},200);leanPulse(P,onFoe?.45:.15,500);rest(P,650,450);
      const g=brushText(SKILL_GLYPH[e.id]||'招',Math.min(H*.5,170),0xf0c46a,{dropShadowColor:'#8a5a10',dropShadowBlur:30,dropShadowAlpha:1});
      g.anchor.set(.5);g.position.set(F.c.x,F.c.y);g.alpha=0;L.ui.addChild(g);
      tween(200,p=>{g.scale.set(2.6-1.6*p);g.alpha=p},()=>{
        if(e.miss)dodge();else if(onFoe){impact(0xf0c46a,2);num('e','−'+e.dmg,'crit')}else ring(P.c.x,P.c.y,0x7fd1a8,20,120,10,500);
        flashScreen(0xf0c46a,.3,380);
        tween(550,p=>{g.scale.set(1+p*.25);g.alpha=1-p},()=>g.destroy(),ease.in);
      },ease.back);
  }
  Object.assign(PLAY,{
    eatk(e){
      const heavy=e.heavy;
      tween(260,p=>{E.c.x=E.bx-60*Math.sin(p*Math.PI);E.c.scale.set(1+.12*Math.sin(p*Math.PI))});
      pose(E,{head:-.08,legFL:.3,legFR:.24,legBL:-.2,legBR:-.24,jawOpen:1,tail:-.35,eyeGlow:.6},160);leanPulse(E,-.35,320);rest(E,420,260);
      setTimeout(()=>{
        const n=heavy?5:3,base=-.6;
        for(let i=0;i<n;i++){
          const s=new PIXI.Sprite(tex.claw);s.anchor.set(.5);s.tint=heavy?0xff4a30:0xff8c78;s.blendMode=PIXI.BLEND_MODES.ADD;
          s.position.set(P.c.x+(i-(n-1)/2)*14,P.c.y+(i-(n-1)/2)*6);s.rotation=base+rnd(-.08,.08);L.fx.addChild(s);
          const w=heavy?1.5:1.1;
          tween(360,p=>{s.scale.set(w*Math.min(1,p*3),heavy?1.6:1.1);s.alpha=p<.4?1:1-(p-.4)/.6},()=>s.destroy());
        }
        P.flash.alpha=.9;tween(300,p=>{P.flash.alpha=.9*(1-p)});
        pose(P,{head:-.16,squint:1,arm:.22,fore:.3,hair:.25},110);leanPulse(P,-.28,380);rest(P,520,260);
        tween(260,p=>{P.c.x=P.bx-16*(heavy?2:1)*Math.sin(p*Math.PI)});
        if(!RM){shake=Math.max(shake,heavy?16:8);stop_=Math.max(stop_,heavy?90:40)}
        ink(P.c.x,P.c.y,0x4a0a06,heavy?14:7,heavy?7:4);
        if(heavy)flashScreen(0xd02010,.28,420);
        num('p','−'+e.dmg,heavy?'crit':'taken');
      },RM?0:140);
    },
    heal(e){
      num('p','+'+e.amt,'heal');pose(P,{eyeGlow:.5,squint:.4},200);rest(P,500,300);
      for(let i=0;i<16;i++)particle({x:P.c.x+rnd(-40,40),y:P.c.y+rnd(0,50),vy:-rnd(.8,2),vx:rnd(-.2,.2),tint:0x8fe0b0,sc:rnd(.1,.22),life:rnd(600,1000),drag:1});
    },
    shield(e){
      const t=SHIELD_TINT[e.k]||0x7fd1a8,R=Math.min(H*.22,86)*1.2;
      pose(P,{arm:-.3,fore:-.6,head:.04,eyeGlow:.5},260);rest(P,480,420);ring(P.c.x,P.c.y,t,20,R,10,500);sparks(P.c.x,P.c.y,t,10,4);P.ring.visible=true;
      // Hình dạng riêng: nước rơi, tơ quấn, lửa bốc, lá bay
      for(let i=0;i<18;i++){const an=rnd(0,Math.PI*2),x=P.c.x+Math.cos(an)*R*.8,y=P.c.y+Math.sin(an)*R*.8;
        if(e.k==='thuytrao')particle({tex:'dot',x,y:P.c.y-R*.9+rnd(0,20),vy:rnd(2,4),tint:t,sc:rnd(.2,.35),life:rnd(400,700),drag:1});
        else if(e.k==='hoalo')particle({x,y,vy:-rnd(1,2.4),vx:rnd(-.3,.3),tint:t,sc:rnd(.08,.16),life:rnd(500,900),drag:.99});
        else if(e.k==='thanhti'||e.k==='mokmi')particle({tex:e.k==='thanhti'?'streak':'dot',x,y,vx:-Math.sin(an)*2,vy:Math.cos(an)*2,rot:an,tint:t,sc:rnd(.2,.4),life:rnd(500,800),drag:.96});
      }
    },
    dot(e){num('e','−'+e.dmg,e.cls==='reflect'?'reflect':'dot');if(e.cls==='bleed')ink(E.c.x,E.c.y+10,0x6a0c08,6,3)},
    text(e){num(e.on,e.t,'txt')},
    ko(){
      if(!RM){stop_=160;shake=18}
      E.flash.alpha=1;flashScreen(0xffffff,.35,300);
      pose(E,{head:.35,jawOpen:.6,squint:1,legFL:-.2,legFR:-.18,legBL:.16,legBR:.14,earL:.4,earR:-.4,tail:.4},600,ease.in);if(E.lv)tween(600,p=>{E.lv.sq=-.12*p;E.lv.breath=1-p},null,ease.in);
      sparks(E.c.x,E.c.y,E.col,40,9);ink(E.c.x,E.c.y,sc.ink,30,8);ink(E.c.x,E.c.y,E.col,14,6);
      ring(E.c.x,E.c.y,E.col,E.r*.5,E.r*2.2,12,700);
      // Tan thành mực: từng giọt mực bong khỏi thân, trôi theo hướng đòn cuối
      for(let i=0;i<(low?24:70);i++)setTimeout(()=>particle({tex:'dot',x:E.c.x+rnd(-E.r*.7,E.r*.7),y:E.c.y+rnd(-E.r,E.r*.9),vx:rnd(.6,2.4),vy:-rnd(.2,1.2),g:-.01,tint:i%3?sc.ink:E.col,add:false,a:.9,sc:rnd(.3,.9),grow:.0006,life:rnd(900,1500),drag:.985}),i*9);
      tween(800,p=>{E.t.alpha=E.flash.alpha=1-p;E.ring.alpha=.8*(1-p);E.ring.scale.set(1+p*.4);E.glow.alpha=.22*(1-p);if(E.seal)E.seal.alpha=.9*(1-p);E.c.y=E.by+p*14},null,ease.in);
    },
    pdie(){
      if(!RM){stop_=160;shake=14}
      flashScreen(0xa01008,.5,900);ink(P.c.x,P.c.y,0x4a0a06,30,7);
      pose(P,{head:.35,squint:1,arm:.35,fore:.3,hair:.4},900,ease.in);if(P.lv)tween(900,p=>{P.lv.lean=-.4*p;P.lv.sq=-.2*p;P.lv.breath=1-p},null,ease.in);
      tween(1000,p=>{P.t.alpha=1-p;P.aura.alpha=.55*(1-p);P.c.y=P.by+p*18},null,ease.in);
    },
  });
  function play(e){if(!window.PIXI||!app)return;if(!ready){pend.push(e);return}if(PLAY[e.type])PLAY[e.type](e)}

  /* ---------- vòng lặp ---------- */
  function tick(){
    if(!ready||!host||!host.isConnected)return;
    const ms=Math.min(50,app.ticker.deltaMS);T+=ms;
    // Chế độ đồ họa thấp: 2 giây đầu dưới 40 khung hình mỗi giây thì bớt hạt, bớt thời tiết
    if(!low&&fpsT<2000&&document.visibilityState==='visible'&&app.ticker.deltaMS<200){fpsN++;fpsT+=app.ticker.deltaMS;if(fpsT>=2000&&fpsN/2<40){low=true;wx.splice(0,Math.floor(wx.length*.6)).forEach(o=>o.s.destroy())}}
    if(Math.abs(app.screen.width-W)>1||Math.abs(app.screen.height-H)>1){build();return}
    const k=ms/16.67;
    // thời tiết luôn chạy
    for(let i=0;i<wx.length;i++){
      const o=wx[i],s=o.s;s.x+=o.vx*k;s.y+=o.vy*k;o.ph+=.04*k;
      if(o.k==='firefly')s.alpha=.3+.6*Math.max(0,Math.sin(o.ph));
      if(o.k==='ember'||o.k==='mote')s.alpha=.4+.4*Math.sin(o.ph);
      if(s.y<-30||s.y>H+30||s.x<-30||s.x>W+30){s.destroy();wx[i]=newWx(false);if(o.k==='snow'||o.k==='rain')wx[i].s.x=rnd(0,W*1.2)}
    }
    if(L.bgimg){L.bgimg.x=W/2+Math.sin(T/9000)*W*.02;L.bgimg.scale.set(L.bgk*(1+.015*Math.sin(T/7000)))}
    if(L.bamboo)L.bamboo.forEach(b=>b.rotation=Math.sin(T/1800+b.ph)*.02);
    if(L.lan)L.lan.forEach(p=>p.s.alpha=.45+.2*Math.sin(T/400+p.s.ph));
    if(L.fireGlow)L.fireGlow.alpha=.3+.08*Math.sin(T/170)+.05*Math.sin(T/53);
    if(L.eyes)L.eyes.forEach(e=>{const t=(T/1000+e.ph)%6;e.alpha=t<.15?0:t<3.5?1:0});
    if(art.sc==='tide'&&T>nextBolt&&!RM){nextBolt=T+2600+Math.random()*4200;bolt()}

    if(stop_>0){stop_-=ms;return}
    // Tween của trận trước (hẹn giờ chạy trễ) có thể trỏ tới hình đã hủy: bỏ đi thay vì báo lỗi mỗi khung hình
    for(let i=tw.length-1;i>=0;i--){const t=tw[i];t.t+=ms;const p=Math.min(1,t.t/t.dur);
      try{t.upd(t.e(p));if(p>=1){tw.splice(i,1);t.done&&t.done()}}catch(err){tw.splice(i,1)}}
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i];p.life-=ms;
      if(p.life<=0||p.s.destroyed){if(!p.s.destroyed)p.s.destroy();parts.splice(i,1);continue}
      p.vx*=Math.pow(p.drag,k);p.vy=p.vy*Math.pow(p.drag,k)+p.g*k;p.s.x+=p.vx*k;p.s.y+=p.vy*k;
      p.s.alpha=p.a0*(p.life/p.max);if(p.grow)p.s.scale.set(Math.max(.01,p.s.scale.x+p.grow*ms));
    }
    // nhịp thở
    if(P&&E){
      P.aura.alpha=.45+.15*Math.sin(T/700);
      if(E.lv){const heavy=state.intent==='heavy'&&!E.lv.act.squint;E.lv.crouch+=((heavy?.7:0)-E.lv.crouch)*.06*k;if(heavy)E.lv.act.eyeGlow=Math.max(E.lv.act.eyeGlow||0,.5)}
      if(P.lv)P.lv.update(T,ms);else P.t.y=Math.sin(T/900)*3;
      if(E.lv)E.lv.update(T,ms);else E.t.y=Math.sin(T/750+1)*4;E.ring.rotation+=(state.intent==='heavy'?.05:.004)*k;
      E.glow.alpha=(state.intent==='heavy'?.4:.22)+.06*Math.sin(T/500);
      if(P.ring.visible)P.ring.alpha=.7+.3*Math.sin(T/260);
      if(Math.random()<.18*k)particle({x:P.c.x+rnd(-26,26),y:P.c.y+rnd(10,50),vy:-rnd(.3,.9),tint:col(state.ess||'#5fae8a'),sc:rnd(.05,.1),life:rnd(700,1200),drag:1});
      if(Math.random()<.12*k)particle({tex:'soft',x:E.c.x+rnd(-E.r,E.r),y:E.c.y+E.r*.6,vy:-rnd(.2,.5),vx:rnd(-.2,.2),tint:sc.ink,add:false,a:.45,sc:rnd(.5,.9),grow:.0008,life:rnd(1200,1800),drag:1,layer:L.near});
    }
    if(shake>.3){root.x=rnd(-shake,shake);root.y=rnd(-shake,shake);shake*=Math.pow(.86,k)}else{root.x=root.y=0}
  }
  function bolt(){
    const g=new PIXI.Graphics(),x0=rnd(W*.1,W*.9);g.blendMode=PIXI.BLEND_MODES.ADD;
    g.lineStyle(2.5,0xdfefff,1);g.moveTo(x0,0);let x=x0,y=0;while(y<H*.55){x+=rnd(-22,22);y+=rnd(12,26);g.lineTo(x,y)}
    L.sky.addChild(g);flashScreen(0xcfe3ff,.3,260);
    tween(300,p=>{g.alpha=1-p},()=>g.destroy(),ease.lin);
  }

  return {mount,stop,sync,play};
})();

// engine gọi Scene.stop() khi rời trận
const Scene={stop:()=>Arena.stop()};

// Phím tắt 1–9
document.addEventListener('keydown',ev=>{
  if(!S||!S.combat||ev.metaKey||ev.ctrlKey||ev.altKey)return;
  const n=parseInt(ev.key,10);if(!n)return;
  const b=document.querySelectorAll('#skillbar .skill')[n-1];
  if(b&&!b.disabled){ev.preventDefault();b.click()}
});
