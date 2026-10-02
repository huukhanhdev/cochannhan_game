// Âm mẫu sandbox, chỉ đọc event; không dùng RNG hoặc clock gameplay.
// Hai nguồn âm cho cùng một tên cue (kind):
//   1. File thật nếu có assets/audio/battle/manifest.json ({"cues":{"punch":"punch_01.ogg", ...},"sources":{...}}),
//      vd bộ âm CC0 (ghi nguồn + giấy phép từng file trong "sources"). Tải và giải mã một lần lúc unlock.
//   2. Âm tổng hợp Web Audio (fallback) khi chưa có file hoặc file lỗi.
// TÍCH HỢP: campaign giữ SFX riêng; E dùng SBAudio. Không tạo AudioContext mới mỗi chiêu.
const SBAudio=(()=>{
  let ctx,master,compressor,noise,unlocked=false,muted=false,volume=.35,loading=null;
  const voices=new Set(),buffers={},fileGains={};
  try {muted=localStorage.getItem('sb_audio_muted')==='1';const v=localStorage.getItem('sb_audio_volume');if(v!==null&&Number.isFinite(+v))volume=Math.max(0,Math.min(1,+v))}catch(e){}
  function stop(){for(const v of voices){try{v.stop()}catch(e){}}voices.clear()}
  function gain(){if(master)master.gain.setValueAtTime(muted?0:volume,ctx.currentTime)}
  // Nạp file âm (nếu có). Lỗi/thiếu file → giữ âm tổng hợp, không báo lỗi trận.
  function loadFiles(){
    if(loading)return loading;
    const dir='assets/audio/battle/';
    return loading=fetch(dir+'manifest.json').then(r=>r.ok?r.json():null).then(man=>{
      if(!man)return;
      return Promise.all(Object.entries(man.cues||{}).map(([kind,entry])=>{
        const file=typeof entry==='string'?entry:entry?.file;
        if(typeof file!=='string'||!file||file.includes('..')||file.startsWith('/')||file.includes(':'))return;
        fileGains[kind]=Number.isFinite(entry?.gain)?Math.max(0,Math.min(1,entry.gain)):.4;
        return fetch(dir+file).then(r=>r.ok?r.arrayBuffer():null).then(b=>b&&ctx.decodeAudioData(b)).then(buf=>{if(buf)buffers[kind]=buf}).catch(()=>{});}));
    }).catch(()=>{});
  }
  async function unlock(){
    if(document.hidden)return;
    try{
      if(!ctx){
        const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
        ctx=new C();master=ctx.createGain();compressor=ctx.createDynamicsCompressor();
        compressor.threshold.value=-18;compressor.ratio.value=4;compressor.knee.value=12;
        master.connect(compressor);compressor.connect(ctx.destination);gain();
        noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);
        const samples=noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
        loadFiles();
      }
      await ctx.resume();unlocked=ctx.state==='running';
    }catch(e){unlocked=false}
  }
  // Âm tổng hợp: [noise?, tần số đầu, tần số cuối, thời lượng s, biên độ, kiểu sóng]
  const SYNTH={
    punch:[false,130,40,.13,.35],wind:[true,1800,450,.13,.13],heavy:[true,900,260,.2,.18],
    moon:[true,4000,900,.2,.16],cut:[true,3000,500,.16,.22],ice:[true,6500,1500,.16,.2],storm:[true,700,2600,.45,.2],
    saw:[false,180,120,.22,.16,'sawtooth'],grab:[false,320,90,.16,.22,'square'],
    jade:[false,1400,650,.23,.14],gold:[false,520,390,.32,.16,'triangle'],water:[true,500,1400,.3,.16],
    heal:[false,500,1000,.3,.12]};
  function play(kind){
    if(!unlocked||muted||document.hidden||ctx.state!=='running'||voices.size>=8)return;
    const t=ctx.currentTime,g=ctx.createGain();let source,stopAt=null;
    if(buffers[kind]){
      source=ctx.createBufferSource();source.buffer=buffers[kind];g.gain.value=fileGains[kind]??.4;source.connect(g);
    }else{
      const [isNoise,f0,f1,dur,amp,wave]=SYNTH[kind]||SYNTH.wind;
      source=isNoise?ctx.createBufferSource():ctx.createOscillator();
      if(isNoise){source.buffer=noise;const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=.8;
        f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);source.connect(f);f.connect(g);
      }else{source.type=wave||'sine';source.frequency.setValueAtTime(f0,t);source.frequency.exponentialRampToValueAtTime(f1,t+dur);source.connect(g)}
      g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(amp,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+dur);
      stopAt=t+dur+.02;
    }
    g.connect(master);voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();g.disconnect()};
    source.start(t);if(stopAt)source.stop(stopAt);
  }
  // Hộ thể → chất liệu âm: ba hộ thể phải nghe khác nhau (người chơi nghe để biết đòn bị đỡ)
  const SHIELD={bachngoc:'jade',thienbong:'gold',thuytrao:'water',vobang:'ice'};
  const RELEASE={nguyet:'moon',cuxi:'saw',cuongthu:'heavy',dash:'wind',lamdieu:'ice'};
  function consume(events,B,speed){
    if(!unlocked||muted||document.hidden)return;
    for(const e of events){
      if((B.t-e.t)/(speed||1)>.15)continue;                       // bỏ cue quá hạn (catch-up), không phát dồn
      if(e.type==='release'){
        if(e.kind==='buff'||e.kind==='heal'||e.kind==='escape'||e.kind==='empower'||e.kind==='aoe'||e.kind==='grab')continue;
        play(e.skill==='atk'?(B.actors[e.who]?.sk[e.skill]?.fx==='ice'?'ice':'wind'):RELEASE[e.skill]||'wind');
      }else if(e.type==='dmg'&&!e.dot){
        if(e.blocked&&SHIELD[e.shield])play(SHIELD[e.shield]);    // lớp chất liệu hộ thể, impact chính đã giảm
        else play(B.actors[e.source]?.sk[e.skill]?.fx==='ice'?'ice':e.skill==='nguyet'?'cut':e.skill==='cuxi'?'saw':'punch');
      }else if(e.type==='grab')play('grab');
      else if(e.type==='shield')play(SHIELD[e.skill]||'jade');
      else if(e.type==='heal')play('heal');
      else if(e.type==='zoneFire')play('storm');
      else if(e.type==='escape'||e.type==='empower')play('ice');
      else if(e.type==='detonate')play('storm');
    }
  }
  function mount(){
    const button=document.getElementById('sound'),slider=document.getElementById('volume');
    const label=()=>{button.textContent=muted?'Âm: tắt':'Âm: bật';button.setAttribute('aria-pressed',String(!muted))};label();slider.value=String(volume);
    button.onclick=()=>{muted=!muted;if(muted)stop();gain();label();try{localStorage.setItem('sb_audio_muted',muted?'1':'0')}catch(e){};if(!muted)unlock()};
    slider.oninput=()=>{volume=+slider.value;gain();try{localStorage.setItem('sb_audio_volume',String(volume))}catch(e){}};
    document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);
    // Ẩn tab: tắt âm đang ngân. Quay lại: thử resume (đã unlock trước đó); cue cũ không phát bù vì consume bỏ event quá hạn.
    document.addEventListener('visibilitychange',()=>{if(document.hidden){unlocked=false;stop();if(ctx)ctx.suspend().catch(()=>{})}else if(ctx&&!muted)unlock()});
    window.addEventListener('pagehide',stop);
  }
  return {mount,consume,get ready(){return unlocked},get voices(){return voices.size},get files(){return Object.keys(buffers)}};
})();
