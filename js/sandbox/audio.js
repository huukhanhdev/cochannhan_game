// Âm mẫu sandbox, chỉ đọc event; không dùng RNG hoặc clock gameplay.
const SBAudio=(()=>{
  let ctx,master,noise,unlocked=false,muted=false,volume=.35;
  const voices=new Set();
  try {muted=localStorage.getItem('sb_audio_muted')==='1';const v=localStorage.getItem('sb_audio_volume');if(v!==null&&Number.isFinite(+v))volume=Math.max(0,Math.min(1,+v))}catch(e){}
  function stop(){for(const v of voices){try{v.stop()}catch(e){}}voices.clear()}
  function gain(){if(master)master.gain.setValueAtTime(muted?0:volume,ctx.currentTime)}
  async function unlock(){
    if(document.hidden)return;
    try{
      if(!ctx){
        const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
        ctx=new C();master=ctx.createGain();master.connect(ctx.destination);gain();
        noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);
        const samples=noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
      }
      await ctx.resume();unlocked=ctx.state==='running';
    }catch(e){unlocked=false}
  }
  function play(kind){
    if(!unlocked||muted||document.hidden||ctx.state!=='running'||voices.size>=8)return;
    const shapes={punch:[false,130,40,.13,.35],wind:[true,1800,450,.13,.13],
      moon:[true,4000,900,.2,.16],ice:[true,6500,1500,.16,.2],
      cut:[true,3000,500,.16,.22],jade:[false,1400,650,.23,.14],heal:[false,500,1000,.3,.12]};
    const [isNoise,f0,f1,dur,amp]=shapes[kind]||shapes.wind;
    const source=isNoise?ctx.createBufferSource():ctx.createOscillator(),g=ctx.createGain();
    const t=ctx.currentTime;
    if(isNoise){source.buffer=noise;const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=.8;
      f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);source.connect(f);f.connect(g);
    }else{source.type='sine';source.frequency.setValueAtTime(f0,t);source.frequency.exponentialRampToValueAtTime(f1,t+dur);source.connect(g)}
    g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(amp,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    g.connect(master);voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();g.disconnect()};
    source.start(t);source.stop(t+dur+.02);
  }
  function consume(events,B,speed){
    if(!unlocked||muted||document.hidden)return;
    for(const e of events){
      if((B.t-e.t)/(speed||1)>.15)continue;
      if(e.type==='release'){
        if(e.kind==='buff'||e.kind==='heal'||e.kind==='escape'||e.kind==='aoe')continue;
        play(e.skill==='nguyet'?'moon':e.skill==='atk'&&e.who==='bnb'?'ice':'wind');
      }else if(e.type==='dmg'&&!e.dot){
        play(e.blocked?'jade':e.source==='bnb'?'ice':e.skill==='nguyet'?'cut':'punch');
      }else if(e.type==='shield')play('jade');
      else if(e.type==='heal')play('heal');
      else if(e.type==='escape'||e.type==='zoneFire')play('ice');
    }
  }
  function mount(){
    const button=document.getElementById('sound'),slider=document.getElementById('volume');
    const label=()=>{button.textContent=muted?'Âm: tắt':'Âm: bật';button.setAttribute('aria-pressed',String(!muted))};label();slider.value=String(volume);
    button.onclick=()=>{muted=!muted;if(muted)stop();gain();label();try{localStorage.setItem('sb_audio_muted',muted?'1':'0')}catch(e){};if(!muted)unlock()};
    slider.oninput=()=>{volume=+slider.value;gain();try{localStorage.setItem('sb_audio_volume',String(volume))}catch(e){}};
    document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){unlocked=false;stop();if(ctx)ctx.suspend().catch(()=>{})}});
    window.addEventListener('pagehide',stop);
  }
  return {mount,consume,get ready(){return unlocked},get voices(){return voices.size}};
})();
