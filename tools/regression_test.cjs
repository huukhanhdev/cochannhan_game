// Hồi quy tích hợp cho các lỗi gameplay/story từng lọt qua story_test.cjs.
// Chạy đúng engine production trong VM, không gán window.S giả.
const fs=require('fs');
const path=require('path');
const vm=require('vm');

const root=path.join(__dirname,'..');
const noop=()=>{};
const store={};
const ctx={
  console,Math,JSON,Date,
  setTimeout:(fn)=>fn(),clearTimeout:noop,
  localStorage:{
    getItem:key=>store[key]??null,
    setItem:(key,value)=>{store[key]=value},
    removeItem:key=>{delete store[key]}
  },
  document:{
    getElementById:()=>null,addEventListener:noop,querySelectorAll:()=>[],
    createElement:()=>({getContext:()=>null})
  },
  matchMedia:()=>({matches:true}),performance:{now:()=>Date.now()}
};
ctx.window=ctx;
vm.createContext(ctx);

const modules=[
  'data.js','story.js','events.js','living.js','battle.js','minigame.js','auto.js','rt.js','ff.js',
  'cicada.js','butterfly.js','q2/core.js','q2/data2.js','q2/luc.js','q2/truyenthua.js',
  'q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js','q2/ch4_thanh.js',
  'q2/ch5_thieuchu.js','q2/ch6_tamxoa.js','q2/ch7_ngu.js','q2/ch8_baquy.js','q2/ch9_phanboi.js'
];
for(const file of modules){
  vm.runInContext(fs.readFileSync(path.join(root,'js',file),'utf8'),ctx,{filename:file});
}
vm.runInContext('function render(){} function showToast(){}',ctx);
const engine=fs.readFileSync(path.join(root,'js','engine.js'),'utf8').replace(/window\.claude\?\.hot[\s\S]*$/,'');
vm.runInContext(engine,ctx,{filename:'engine.js'});

const run=code=>vm.runInContext(code,ctx);
let failed=0;
function test(name,code){
  let ok=false;
  try{ok=!!run(code)}catch(error){console.error(`  ❌ [ERROR] ${name}\n     ${error.stack||error}`);failed++;return}
  if(ok)console.log(`  ✅ [PASS] ${name}`);
  else{console.error(`  ❌ [FAIL] ${name}`);failed++}
}

console.log('--- HỒI QUY TÍCH HỢP ENGINE ---');
run('META=freshMeta();newLife();S.traitOpts=null');
test('Story API ghi vào global lexical S của engine',`(storySetOutcome('engine_binding','ok',{choiceText:'Ghi trên state thật'}),storyHasOutcome('engine_binding','ok')&&S.story.journal.some(j=>j.chainId==='engine_binding'))`);

run(`newLife();S.traitOpts=null;S.chuyen=1;S.giai=3;S.prog=0;S.ap=3;S.gu.push({k:'xaloi1',h:0});useGu(S.gu.length-1);cultivate(0)`);
test('Xá Lợi ở đỉnh giai mở minigame đột phá qua hành động tu luyện',`S.prog===need()&&S.mg&&S.mg.type==='break'`);

run(`newLife();S.traitOpts=null;S.evq=['c_thuongdoi'];S.f={hs:0};choose(0)`);
test('Đổ thạch chỉ được xếp sau khi thương đội tới',`S.f.caravan===1&&S.evq[0]==='c_dothach'&&!Object.values(CANON).includes('c_dothach')`);

run(`newLife();S.traitOpts=null;S.canon={};S.turn=11;S.chuyen=2;S.giai=0;S.gu.push({k:'ngocbi',h:0},{k:'bachthi',h:0});S.evq=[];S.pend=null;startTurn()`);
test('Bạch Ngọc xuất hiện bằng điều kiện gameplay khi đủ Nhị chuyển và nguyên liệu',`S.pend==='c_bachngoc'`);

run(`newLife();S.traitOpts=null;S.over='win';startQ2('huyetlo_bai');enterChapter('q2_thuongdoi');S.rel.tamtu=30;S.evq=['q2_td_thuongluong'];S.traitOpts=null;choose(0)`);
test('Lựa chọn Tử Kinh chuyển chương và dispatcher Q2 xếp hậu quả đúng lúc',`S.chap==='q2_thanh'&&S.evq.includes('q2_tt_tukinhvao')&&S.story.applied['pending:tu_kinh_vao_thanh']===true&&!S.story.pending.some(p=>p.id==='tu_kinh_vao_thanh')`);
run(`choose(S.evq.indexOf('q2_tt_tukinhvao')===0?0:-1)`);
test('Người chơi xử lý được cảnh hậu quả Tử Kinh và journal ghi nhận',`S.story.journal.some(j=>j.tag==='tu_kinh'&&j.choiceText.includes('Nam Thu Uyển'))`);

run(`newLife();S.traitOpts=null;S.cicada.charge=100;S.turn=4;rewindTime(false);storySetOutcome('after_rewind','bound',{choiceText:'State sau nghịch chuyển'})`);
test('Story API tiếp tục bám state mới sau Xuân Thu Thiền',`storyHasOutcome('after_rewind','bound')&&S.story.journal.some(j=>j.chainId==='after_rewind')`);

console.log('----------------------------------');
if(failed){
  console.error(`💥 CÓ ${failed} HỒI QUY TÍCH HỢP THẤT BẠI!`);
  process.exit(1);
}
console.log('🎉 TẤT CẢ HỒI QUY TÍCH HỢP ĐỀU ĐẠT!');
