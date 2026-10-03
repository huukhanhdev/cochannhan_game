// Bước A2 (KE_HOACH_DUA_ROSTER_VAO_BATTLE §3): bộ chiêu Phương Nguyên dựng từ SAVE, không từ preset.
// Người dùng chốt 03/10: dùng cổ đang sở hữu, tu vi, trạng thái và vật phẩm trong save hiện tại. Không cấp hay tước cổ.
// Cổ đã mất hoặc đã tiêu hao khi hợp luyện thì không còn trong S.gu nên không có nút. Nhánh khác truyện giữ đúng tài sản.
//
// GU_SKILL[k]: định nghĩa chiêu sandbox cho cổ chủ động k (key trong GU của js/data.js). Cổ thiếu định nghĩa → missing.
//  · Chiêu đã có trong kit demo (Nguyệt Mang, Bạch Ngọc, Cứ Xỉ, Thiên Bồng, lá Sinh Cơ) dùng lại đúng bản đó (cùng số liệu).
//  · Chiêu mới: số liệu game. Sát thương = GU.dmg × DMG_K, hệ số rút từ hai cổ đã chỉnh:
//    Nguyệt Mang 36 → 21, Cứ Xỉ 58 → 34, tức ≈ 0,58. Phí = GU.cost × 0,75 (tối thiểu 4).
//    Cơ chế theo mô tả GU trong data.js (src ghi rõ); Blue đối chiếu chương trước khi coi là canon.
//  · Cổ bị động không thành nút nhưng cộng vào đòn: atk (Bạch Thỉ/Hắc Thỉ/Hùng Lực) cộng vào đánh tay và chiêu cận chiến;
//    moonAtk (U Quang, Tiểu Quang) cộng vào chiêu nguyệt nhận. Cả hai nhân DMG_K.
//  · Cường Thủ: chưa có nút. Canon là đứng vận để đoạt cổ (review Blue §9.1.4); bản kéo người trong pn_demo là chuyển thể.
(function(root){
  const STONE_CAP=3,DMG_K=.58,COST_K=.75,KEYS=['q','w','e','r','d','f','t','g'];
  const dmg=v=>Math.round(v*DMG_K),cost=v=>Math.max(4,Math.round(v*COST_K));
  const from=id=>()=>root.SB_KITS.pn.skills.find(s=>s.id===id);
  // Mỗi định nghĩa là hàm (G) → chiêu, G = GU[k] của data.js (truyền vào, không đọc biến toàn cục).
  const proj=(k,n,icon,o)=>G=>Object.assign({id:k,n,icon,kind:'proj',clip:['sk_nguyet','cast'],startup:.38,active:.05,recovery:.32,
    cd:3,speed:430,range:520,fx:'moon',nguyet:true,tags:['poke']},o,{dmg:dmg(G.dmg),cost:cost(G.cost)});
  const guard=(k,n,icon,red,o)=>G=>Object.assign({id:k,n,icon,kind:'buff',clip:['sk_bachngoc','guard'],startup:.2,active:.05,recovery:.2,
    cd:9,group:'shield',red,dur:3,tint:0xe8f4ff,tags:['guard']},o,{cost:cost(G.cost)});
  const GU_SKILL={
    // Đã có trong kit demo: dùng nguyên bản (giữ số liệu đã chỉnh và nguồn chương).
    nguyetmang:from('nguyet'),bachngoc:from('bachngoc'),cuxikimngo:from('cuxi'),thienbong:from('thienbong'),
    // Nguyệt nhận các loại (data.js: nguyet:1)
    nguyetquang:proj('nguyetquang','Nguyệt Quang','月',{range:330,speed:400,cd:2.4,
      src:'data.js GU.nguyetquang: nguyệt nhận tầm mười mét (VN ch.22–25 học đường) · số liệu game'}),
    nguyetngan:proj('nguyetngan','Nguyệt Ngân','銀',{range:620,speed:470,cd:3.4,src:'data.js GU.nguyetngan: tầm hai mươi mét · số liệu game'}),
    huyetnguyet:proj('huyetnguyet','Huyết Nguyệt','血',{range:520,cd:4,bleed:{dps:3,dur:3},fx:'blood',
      src:'data.js GU.huyetnguyet: vết thương chảy máu · số liệu game'}),
    nguyettoan:proj('nguyettoan','Nguyệt Toàn','旋',{range:560,cd:5,turn:1.6,pierce:.5,
      src:'data.js GU.nguyettoan: nguyệt nhận bay vòng cung, luồn qua khiên (VN ch.104 Thanh Thư) · số liệu game'}),
    toanphong:G=>({id:'toanphong',n:'Toàn Phong',icon:'風',kind:'aoe',clip:['cast','sk_nguyet'],startup:.65,active:.05,recovery:.35,
      cd:6,castRange:320,radius:80,dmg:dmg(G.dmg),cost:cost(G.cost),slow:{f:.75,dur:1.5},fx:'wind',tags:['control'],src:'data.js GU.toanphong: lốc xoáy làm địch chao đảo · số liệu game'}),
    bangdao:G=>({id:'bangdao',n:'Băng Đao',icon:'冰',kind:'melee',clip:['heavy','attack'],startup:.45,active:.1,recovery:.4,
      cd:4,range:120,depth:48,dmg:dmg(G.dmg),cost:cost(G.cost),slow:{f:.7,dur:1.5},fx:'ice',tags:['burst'],src:'data.js GU.bangdao: đao băng làm đông máu · số liệu game'}),
    // Hộ thể (data.js: "chỉ nhận X% sát thương" → red = 1 − X)
    ngocbi:guard('ngocbi','Ngọc Bì','玉',.5,{src:'data.js GU.ngocbi: nhận 50% · VN ch.80 PN đỡ lợn rừng bằng vai · số liệu game'}),
    dongbi:guard('dongbi','Đồng Bì','銅',.55,{src:'data.js GU.dongbi: nhận 45% · số liệu game'}),
    thietbi:guard('thietbi','Thiết Bì','鐵',.6,{src:'data.js GU.thietbi: nhận 40% · số liệu game'}),
    cuongnham:guard('cuongnham','Cương Nham','岩',.5,{src:'data.js GU.cuongnham: nhận 50% · số liệu game'}),
    thuytrao:guard('thuytrao','Thủy Tráo','水',.5,{tint:0xbfe8ff,src:'data.js GU.thuytrao: nhận 50% · VN ch.143 PN đoạt từ BNB · số liệu game'}),
    nguyetnghe:guard('nguyetnghe','Nguyệt Nghê Thường','裳',.65,{src:'data.js GU.nguyetnghe: nhận 35% · số liệu game'}),
    // Hồi máu
    trilieu:G=>({id:'trilieu',n:'Trị Liệu',icon:'治',kind:'heal',clip:['heal'],startup:.6,active:.05,recovery:.3,cd:8,
      amt:G.healAmt||35,cost:cost(G.cost),tags:['heal'],src:'data.js GU.trilieu: hồi 35, cầm máu · số liệu game'}),
    // Cửu Diệp: lá Sinh Cơ là vật phẩm (S.herbs), không phải chiêu tốn chân nguyên; lượt = số lá đang có.
    cuudiep:from('leaf'),
  };
  // Cổ chủ động chưa có chiêu, kèm lý do (hiện trong sandbox/HUD và test).
  const PENDING={
    cuongthu:'canon là đứng vận đoạt cổ; chờ thiết kế channel (review Blue §9.1.4)',
    daosihuyetbuc:'cần kind summon/lifesteal (bước D)',mokmi:'cần kind transform (bước D)',
    hoalo:'cần phản sát thương (reflect)',thanhti:'hộ thể kèm hồi máu, chờ kiểu chiêu kết hợp',amduong:'cổ cốt truyện, không dùng trong trận thường',
  };

  // env: {GU, maxHp(), maxEss()} — campaign truyền GU của data.js và hai hàm maxHp/maxEss của engine.js.
  // Thiếu GU thì báo lỗi (không đoán cổ). Thiếu maxHp/maxEss thì dùng S.maxHp/S.maxEss nếu có, rồi tới số demo.
  function pnKitFromSave(S,env){
    env=env||{};const GU=env.GU;if(!GU)throw new Error('pnKitFromSave cần env.GU (GU của js/data.js)');
    const owned=(S.gu||[]).map(g=>g.k).filter((k,i,a)=>a.indexOf(k)===i);
    const skills=[],missing=[],unbound=[],passive={atk:0,moon:0};
    for(const k of owned){
      const G=GU[k];if(!G){missing.push({k,n:k,reason:'không có trong GU'});continue}
      if(G.t==='passive'){passive.atk+=G.atk||0;passive.moon+=G.moonAtk||0;continue}
      if(G.t==='fate'||G.t==='use')continue;                       // Xuân Thu Thiền, xá lợi...: không phải chiêu trong trận
      const def=GU_SKILL[k];
      if(!def){missing.push({k,n:G.n,reason:PENDING[k]||'chưa có định nghĩa chiêu'});continue}
      skills.push(JSON.parse(JSON.stringify(def(G))));
    }
    // Thứ tự ô: công → hộ thể → hồi; lá Sinh Cơ phím 1, lướt Space (lướt là thân pháp, không phải cổ).
    const rank=s=>s.kind==='heal'&&s.uses!=null?9:s.kind==='heal'?3:s.kind==='buff'?2:1;
    skills.sort((a,b)=>rank(a)-rank(b));
    const out=[];let ki=0;
    for(const s of skills){
      if(s.id==='leaf'){s.key='1';s.uses=Math.max(0,S.herbs|0);if(!s.uses){missing.push({k:'cuudiep',n:'Sinh Cơ Diệp',reason:'không còn lá (S.herbs = 0)'});continue}out.push(s);continue}
      // Không bỏ cổ đang sở hữu vì thiếu phím (review Blue): chiêu vẫn vào kit, bấm bằng ô trên thanh kỹ năng; ghi riêng vào unbound.
      if(ki>=KEYS.length){s.key=null;unbound.push({k:s.id,n:s.n});out.push(s);continue}
      s.key=KEYS[ki++];out.push(s);
    }
    const demo=root.SB_KITS.pn,inj=S.inj?.k;
    const atk=JSON.parse(JSON.stringify(demo.atk));
    const pAtk=Math.round(passive.atk*DMG_K),pMoon=Math.round(passive.moon*DMG_K);
    atk.dmg+=pAtk;if(inj==='tay')atk.dmg=Math.max(1,Math.round(atk.dmg*.7));
    for(const s of out){if(s.kind==='melee'&&pAtk)s.dmg+=pAtk;if((s.nguyet||s.fx==='moon')&&pMoon)s.dmg+=pMoon}
    out.push(JSON.parse(JSON.stringify(demo.skills.find(s=>s.id==='dash'))));
    // Nguyên thạch trong túi (S.stones) → lượt hấp thu trong trận. Campaign trừ lại S.stones theo số viên đã dùng khi trận kết thúc.
    // Tối đa STONE_CAP viên mỗi trận (người dùng chốt 03/10), không quá số đá đang có.
    const stones=Math.min(STONE_CAP,Math.max(0,S.stones|0));
    if(stones){const ns=JSON.parse(JSON.stringify(demo.skills.find(s=>s.id==='nguyenthach')));ns.uses=stones;out.push(ns)}
    const maxHp=env.maxHp?env.maxHp():S.maxHp||S.hp||demo.hp,maxEss=env.maxEss?env.maxEss():S.maxEss||S.ess||demo.ess;
    // Cổ trị liệu làm đòn hút máu của Huyết Thủ ma tu trượt (RT_WEAK.madutam trong js/rt.js).
    const antiDrain=owned.some(k=>k==='trilieu'||k==='amduong');
    const kit={antiDrain,n:'Phương Nguyên',sprite:'phuong_nguyen',hp:maxHp,ess:maxEss,essRegen:0,speed:demo.speed,atk,skills:out,
      start:{hp:Math.max(1,Math.min(maxHp,S.hp??maxHp)),ess:Math.max(0,Math.min(maxEss,S.ess??maxEss))},
      fromSave:{chuyen:S.chuyen,giai:S.giai,gu:owned,passive:{atk:pAtk,moon:pMoon},inj:inj||null},missing,unbound};
    return kit;
  }
  // Khí huyết / chân nguyên tối đa theo công thức campaign (engine.js maxHp, maxEss). Sandbox không nạp engine.js nên
  // chép ở đây — một chỗ duy nhất; sửa công thức bên engine thì sửa cả hàm này. Dùng cho PN từ save, preset PN và NPC người.
  function campaignMax(S,GU){
    const MX=typeof MAXE!=='undefined'?MAXE:[0,50,100,180,280],g=k=>(S.gu||[]).reduce((s,x)=>s+(((GU||{})[x.k]||{})[k]||0),0);
    return {maxHp:()=>Math.round((70+70*S.chuyen+10*(S.giai||0)+g('hp'))*((S.mod&&S.mod.hp)||1)),
      maxEss:()=>Math.round(MX[S.chuyen]*((S.tuchat||44)/44)*((S.mod&&S.mod.ess)||1))};
  }
  const SB_GU={GU_SKILL,PENDING,DMG_K,STONE_CAP,pnKitFromSave,campaignMax};
  if(typeof module!=='undefined')module.exports=SB_GU;else root.SB_GU=SB_GU;
})(this);
