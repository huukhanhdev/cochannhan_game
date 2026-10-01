// Hệ thống âm thanh Cổ Phong thuần Web Audio API (không tải file ngoài)
const SFX = (function(){
  let ctx = null;
  let muted = false;

  try {
    muted = localStorage.getItem('tms_sound_muted') === '1';
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
    try { localStorage.setItem('tms_sound_muted', muted ? '1' : '0'); } catch(e){}
    return muted;
  }

  // Tiếng chém nguyệt nhận (Air blade / sword slash)
  function blade(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Tiếng đánh trúng (Impact / punch)
  function hit(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Tiếng ve sầu Xuân Thu Thiền vỗ cánh (Mystic Cicada)
  function cicada(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const mod = c.createOscillator();
    const modGain = c.createGain();
    const mainGain = c.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, now);

    mod.type = 'sine';
    mod.frequency.setValueAtTime(18, now); // 18Hz tremolo
    modGain.gain.setValueAtTime(400, now);
    mod.connect(osc.frequency);

    mainGain.gain.setValueAtTime(0.01, now);
    mainGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(mainGain);
    mainGain.connect(c.destination);

    mod.start(now);
    osc.start(now);
    mod.stop(now + 1.65);
    osc.stop(now + 1.65);
  }

  // Tiếng leng keng nguyên thạch (Coin / stone chimes)
  function coin(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    [1200, 1600].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.15, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.22);
    });
  }

  // Tiếng đột phá cảnh giới (Ascension chord)
  function levelUp(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const freqs = [330, 392, 493, 659]; // E minor chord
    freqs.forEach((freq, idx) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.12, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.65);
    });
  }

  // Tiếng sấm Lôi Quan Lang / Lang triều (Thunder roar)
  function thunder(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.7);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.85);
  }

  // Tiếng chuông thương đội (Caravan bell)
  function bell(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 1.25);
  }

  // Tiếng đập đá / mổ thạch (Stone crack)
  function crack(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Tiếng ngọc giáp Bạch Ngọc Cổ / Thiên Bồng va chạm (Jade / crystal shield resonance)
  function jadeGuard(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    [1760, 2640].forEach((freq, idx) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);
      gain.gain.setValueAtTime(0.18, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.45);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.5);
    });
  }

  // Tiếng phá vỡ thế phòng ngự / lộ sơ hở (Stagger / poise break)
  function stagger(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Tiếng lôi điện / sấm sét cao tần xé gió (Lightning crackle)
  function lightning(){
    if(muted) return;
    const c = getCtx(); if(!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  return {
    blade, hit, cicada, coin, levelUp, thunder, bell, crack,
    jadeGuard, stagger, lightning,
    isMuted, toggleMute
  };
})();
window.SFX = SFX;
