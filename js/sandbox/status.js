// Hệ trạng thái chung (docs/undone/KE_HOACH_TRANG_THAI_HIEU_UNG.md §1, §7).
// Mỗi actor có a.st = {id: [instance…]}, instance = {src, until, power, stacks, data}.
// S1a: slow, bleed chạy qua đây nhưng giữ đúng luật cũ (mode 'replace': lần gây sau ghi đè lần trước),
//      và giữ các trường cũ a.slowUntil / a.slowF / a.bleed bằng getter/setter để AI, HUD, test cũ không đổi.
// S2:  stun (choáng), root (trói), seal (phong cấm) + giảm dần theo nhóm + miễn 1,2s sau khi khống chế kết thúc.
// transform / absorb / pha truyện giữ cơ chế riêng; statusView() chỉ đọc chúng để hiện icon/AI.
(function(root){
  const DEF={
    // mode: replace (ghi đè, luật cũ) · refresh (một instance, hạn = max, power lấy lớn) · perSource (mỗi nguồn một instance)
    slow:{n:'Làm chậm',good:false,mode:'replace',icon:'緩',color:0x8fd0ff},
    bleed:{n:'Chảy máu',good:false,mode:'replace',icon:'血',color:0xd04848,dot:true},
    stun:{n:'Choáng',good:false,mode:'refresh',group:'hard',block:{move:true,act:true,gu:true,item:true},interrupt:true,icon:'暈',color:0xffe14a},
    root:{n:'Trói',good:false,mode:'refresh',group:'root',block:{move:true},icon:'縛',color:0xc8a070},
    seal:{n:'Phong cấm',good:false,mode:'refresh',group:'seal',block:{gu:true},icon:'封',color:0x9a7fd0},
  };
  // Giảm dần trong cửa sổ 6s theo nhóm: 100% → 50% → 25% → miễn. Trần khống chế cứng 1,5s.
  const DR=[1,.5,.25,0],DR_WINDOW=6,IMMUNE_AFTER=1.2,HARD_CAP=1.5;

  function list(a,id){return (a.st[id]||(a.st[id]=[]))}
  function get(a,id){const L=a.st[id];return L&&L.length?L[0]:null}
  // Gắn trường cũ (slowUntil/slowF/bleed) vào store mới. Đọc/ghi y như trước.
  function install(a){
    a.st={};a.cc={};
    Object.defineProperty(a,'slowUntil',{configurable:true,enumerable:true,
      get(){return get(a,'slow')?.until||0},
      set(v){if(!v){a.st.slow=[];return}const i=get(a,'slow');if(i)i.until=v;else a.st.slow=[{src:null,until:v,power:.7,stacks:1}]}});
    Object.defineProperty(a,'slowF',{configurable:true,enumerable:true,
      get(){return get(a,'slow')?.power},
      set(v){const i=get(a,'slow');if(i)i.power=v;else a.st.slow=[{src:null,until:0,power:v,stacks:1}]}});
    Object.defineProperty(a,'bleed',{configurable:true,enumerable:true,
      get(){return get(a,'bleed')},
      set(v){a.st.bleed=v?[Object.assign({src:null,power:v.dps,stacks:1},v)]:[]}});
  }
  // Áp trạng thái. Trả {ok, dur} hoặc {ok:false, reason}. Không tự emit: sim emit để giữ thứ tự event.
  function apply(B,t,id,o){
    const D=DEF[id];if(!D)throw new Error('Không có trạng thái '+id);
    let dur=o.dur;
    if(D.group){
      const c=t.cc[D.group]||(t.cc[D.group]={n:0,last:-99,immuneUntil:0});
      if(B.t<c.immuneUntil)return {ok:false,reason:'immune'};
      if(t.kit.ccImmune?.includes(D.group))return {ok:false,reason:'immune'};
      if(B.t-c.last>DR_WINDOW)c.n=0;
      const k=DR[Math.min(c.n,DR.length-1)];if(!k)return {ok:false,reason:'immune'};
      dur*=k*(t.kit.ccResist||1);if(D.group==='hard')dur=Math.min(dur,HARD_CAP);
      c.n++;c.last=B.t;
    }
    const L=list(t,id),inst={src:o.src??null,until:B.t+dur,power:o.power??1,stacks:1,data:o.data||null};
    if(D.mode==='replace'||!L.length)t.st[id]=[inst];
    else if(D.mode==='refresh'){const i=L[0];i.until=Math.max(i.until,inst.until);i.power=Math.max(i.power,inst.power);i.src=inst.src}
    else{const i=L.find(x=>x.src===inst.src);if(i){i.until=Math.max(i.until,inst.until);i.stacks=Math.min(i.stacks+1,D.maxStacks||5)}else L.push(inst)}
    return {ok:true,dur};
  }
  function active(B,a,id){const L=a.st[id];return !!(L&&L.some(i=>i.until>B.t))}
  // Gom cờ chặn của mọi trạng thái đang hiệu lực.
  function blocked(B,a,what){for(const id in a.st){const D=DEF[id];if(D?.block?.[what]&&active(B,a,id))return D}return null}
  // Gỡ trạng thái hết hạn; trả danh sách id vừa hết (để sim emit statusEnd và mở khoảng miễn).
  function expire(B,a){
    const ended=[];
    for(const id in a.st){const D=DEF[id];if(!D||id==='slow'||id==='bleed')continue;   // slow/bleed: sim tự lo như luật cũ
      const L=a.st[id];if(!L.length)continue;const keep=L.filter(i=>i.until>B.t);
      if(keep.length<L.length){a.st[id]=keep;if(!keep.length){ended.push(id);if(D.group){const c=a.cc[D.group];if(c)c.immuneUntil=B.t+IMMUNE_AFTER}}}}
    return ended;
  }
  function clearAll(a){for(const id in a.st)a.st[id]=[]}
  // Danh sách để hiện (icon trên đầu/HUD) và cho AI đọc, gồm cả cơ chế riêng (transform, absorb, shield, empower, enrage).
  function view(B,a){
    const out=[];
    for(const id in a.st){const D=DEF[id];const i=(a.st[id]||[]).find(x=>x.until>B.t);if(D&&i)out.push({id,n:D.n,good:!!D.good,left:i.until-B.t,icon:D.icon,color:D.color})}
    if(a.shield)out.push({id:'shield',n:a.shield.n||a.sk[a.shield.id]?.n||'Hộ thể',good:true,left:a.shield.until-B.t,icon:'盾'});
    if(a.empower)out.push({id:'empower',n:a.sk[a.empower.id]?.n||'Tăng công',good:true,left:a.empower.until-B.t,icon:'力'});
    if(a.transform)out.push({id:'transform',n:a.sk[a.transform.id]?.n||'Biến thân',good:true,left:a.transform.until-B.t,icon:'變'});
    if(a.absorb)out.push({id:'absorb',n:'Hấp thu',good:true,left:a.absorb.until-B.t,icon:'石'});
    if(a.enrage)out.push({id:'enrage',n:'Cuồng nộ',good:true,left:Infinity,icon:'怒'});
    // Khống chế cứng trước, rồi trói, phong cấm, các trạng thái khác (để icon trên đầu hiện cái quan trọng nhất).
    const P={stun:0,root:1,seal:2};out.sort((x,y)=>(P[x.id]??9)-(P[y.id]??9));
    return out;
  }
  const SB_STATUS={DEF,DR,DR_WINDOW,IMMUNE_AFTER,HARD_CAP,install,apply,active,blocked,expire,clearAll,view,get};
  if(typeof module!=='undefined')module.exports=SB_STATUS;else root.SB_STATUS=SB_STATUS;
})(this);
