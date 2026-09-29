// Hệ thống âm thanh Web Audio API dành cho game Thiên Ngoại Chi Ma
const SFX = (function(){
  let ctx = null;
  let muted = false;

  try {
    muted = localStorage.getItem('tncm_sound_muted') === '1';
  } catch(e){}

  function getCtx(){
    if(!ctx){
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if(AudioCtx) ctx = new AudioCtx();
    }
    if(ctx && ctx.state === 'suspended'){
      ctx.resume();
    }
    return ctx;
  }

  function isMuted(){ return muted; }
  function toggleMute(){
    muted = !muted;
    try { localStorage.setItem('tncm_sound_muted', muted ? '1' : '0'); } catch(e){}
    return muted;
  }

  // Tiếng chém kiếm khí / nguyệt nhận
  function blade(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  // Tiếng cự lực va đập (Lực đạo)
  function impact(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.22);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  // Tiếng sấm sét Lôi đạo
  function thunder(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.48);
  }

  // Tiếng cộng hưởng linh hồn Dị Giới (Soul chime)
  function soul(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    [528, 792, 1056].forEach((f, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.12, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.9);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.95);
    });
  }

  // Tiếng đột phá cảnh giới
  function levelUp(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    [392, 523, 659, 784, 1046].forEach((f, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.07);
      gain.gain.setValueAtTime(0.15, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.7);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.75);
    });
  }

  // Tiếng nguyên thạch / tiền tệ
  function coin(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    [1300, 1750].forEach((f, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.05);
      gain.gain.setValueAtTime(0.15, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.22);
    });
  }

  return { blade, impact, thunder, soul, levelUp, coin, isMuted, toggleMute };
})();
window.SFX = SFX;
