// Không Khiếu Hải: Mô phỏng không gian không khiếu và biển chân nguyên cho Thiên Ngoại Chi Ma
const Aperture = (function(){
  let cv = null, ctx = null;
  let animId = null;
  let waveStep = 0;

  const COLORS = {
    1: { name: 'Thanh Đồng', dark: '#143828', mid: '#2c7752', light: '#4fa87c', foam: '#90e4b7', aura: 'rgba(79,168,124,0.35)' },
    2: { name: 'Xích Thiết', dark: '#4c1910', mid: '#8b3421', light: '#bd5b43', foam: '#f29881', aura: 'rgba(189,91,67,0.35)' },
    3: { name: 'Bạch Ngân', dark: '#2b3c44', mid: '#5b7985', light: '#b5c2c6', foam: '#ffffff', aura: 'rgba(181,194,198,0.45)' },
  };

  const GU_ORB = {
    dihon: { icon: '🌌', color: '#a55eea', name: 'Dị Hồn Ấn' },
    kiemquang: { icon: '🗡️', color: '#00d2d3', name: 'Kiếm Quang' },
    kimcham: { icon: '🪡', color: '#feca57', name: 'Kim Châm' },
    toannhan: { icon: '⚙️', color: '#ff9ff3', name: 'Toàn Nhận' },
    kimthieng: { icon: '✨', color: '#ffd32a', name: 'Kim Quang' },
    truluc: { icon: '🐗', color: '#c8d6e5', name: 'Trư Lực' },
    hungluc: { icon: '🐻', color: '#8395a7', name: 'Hùng Lực' },
    thietcot: { icon: '🦴', color: '#a4b0be', name: 'Thiết Cốt' },
    nguuluc: { icon: '🐂', color: '#ff6b6b', name: 'Ngưu Lực' },
    dienlang: { icon: '⚡', color: '#54a0ff', name: 'Điện Lang' },
    tatphong: { icon: '🌪️', color: '#1dd1a1', name: 'Tật Phong' },
    loidinh: { icon: '🌩️', color: '#48dbfb', name: 'Lôi Đinh' },
    hanbang: { icon: '❄️', color: '#70a1ff', name: 'Hàn Băng' },
    banggiap: { icon: '🛡️', color: '#2ed573', name: 'Băng Giáp' },
    tuutrung: { icon: '🍶', color: '#eccc68', name: 'Tửu Trùng' },
    trilieu: { icon: '🌿', color: '#7bed9f', name: 'Trị Liệu' },
    ngocbi: { icon: '💎', color: '#2ed573', name: 'Ngọc Bì' },
    xaloi1: { icon: '🟡', color: '#ffa502', name: 'Xá Lợi' },
    xaloi2: { icon: '🔴', color: '#ff4757', name: 'Xá Lợi' },
  };

  function init(){
    cv = document.getElementById('apertureCanvas');
    if(!cv) return;
    ctx = cv.getContext('2d');
    resize();
    draw();
    if(!animId) loop();
  }

  function resize(){
    if(!cv || !ctx) return;
    const rect = cv.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if(w <= 0 || h <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function loop(){
    animId = requestAnimationFrame(loop);
    draw();
  }

  function draw(){
    if(!ctx || !cv) return;
    const rect = cv.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if(w <= 0 || h <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    if(cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)){
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    ctx.clearRect(0, 0, w, h);
    waveStep += 0.035;

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 8;

    const state = (typeof S !== 'undefined' && S) ? S : (window.S || null);

    if(!state){
      drawUnawakened(cx, cy, r, w, h);
    } else {
      drawAwakened(state, cx, cy, r, w, h);
    }
  }

  // 1. Trạng thái Chưa Khai Khiếu (Hư Không Dị Giới)
  function drawUnawakened(cx, cy, r, w, h){
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Nền hư không vũ trụ đan điền
    const bgGrad = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);
    bgGrad.addColorStop(0, '#151024');
    bgGrad.addColorStop(0.5, '#0a0d18');
    bgGrad.addColorStop(1, '#030508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Bụi tinh vân lấp lánh tím & lam
    for(let i = 0; i < 18; i++){
      const ang = (i * 20 + waveStep * 6) * Math.PI / 180;
      const dist = (r * 0.2) + (i % 5) * (r * 0.15);
      const sx = cx + Math.cos(ang) * dist;
      const sy = cy + Math.sin(ang * 0.9) * dist * 0.7;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#00cec9' : '#a55eea';
      ctx.globalAlpha = 0.5 + Math.sin(waveStep * 2 + i) * 0.3;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Vòng sóng xung kích nhịp thở của Dị Hồn Ấn
    const pulseR = (r * 0.35) + Math.sin(waveStep * 2) * 6;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(165,94,234,0.4)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#a55eea';
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Biểu tượng Dị Hồn Ấn ở trung tâm
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00cec9';
    ctx.shadowBlur = 10;
    ctx.fillText('🌌', cx, cy - 2);

    // Text trạng thái
    ctx.font = '600 11px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = 'rgba(240,236,216,0.85)';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText('HƯ KHÔNG DỊ GIỚI', cx, cy + 34);

    ctx.restore(); // end clip

    // Viền bích khiếu mờ ảo sơ khai
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(165,94,234,0.6)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00cec9';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  }

  // 2. Trạng thái Đã Khai Khiếu (Biển Chân Nguyên & Cổ Trùng)
  function drawAwakened(S, cx, cy, r, w, h){
    const rank = S.chuyen || 1;
    const col = COLORS[rank] || COLORS[1];
    const maxE = typeof maxEss === 'function' ? maxEss() : 60;
    const fillRatio = Math.max(0.05, Math.min(1, (S.ess || 0) / (maxE || 1)));
    const talent = S.tuchat || 55;

    // 1. Vỏ Bích Khiếu
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Nền hư không không khiếu
    const bgGrad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
    bgGrad.addColorStop(0, '#0e161c');
    bgGrad.addColorStop(0.7, '#070b0f');
    bgGrad.addColorStop(1, '#020406');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Bụi tinh vân lấp lánh (Dị giới tinh trần)
    for(let i = 0; i < 14; i++){
      const ang = (i * 26 + waveStep * 4) * Math.PI / 180;
      const dist = (r * 0.22) + (i % 4) * (r * 0.17);
      const sx = cx + Math.cos(ang) * dist;
      const sy = cy + Math.sin(ang * 0.8) * dist * 0.7 - (1 - fillRatio) * (r * 0.2);
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? col.foam : '#b892ff';
      ctx.globalAlpha = 0.6 + Math.sin(waveStep * 2 + i) * 0.3;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 2. Cổ trùng bay lượn trong không khiếu
    const activeGu = (S.gu || []).slice(0, 5);
    activeGu.forEach((g, idx) => {
      const gInfo = GU_ORB[g.k] || { icon: '✨', color: '#ffd700', name: g.k };
      const floatAng = waveStep * 0.8 + idx * (Math.PI * 2 / Math.max(1, activeGu.length));
      const floatR = r * 0.4 + Math.sin(waveStep * 1.5 + idx) * 7;
      const gx = cx + Math.cos(floatAng) * floatR;
      const gy = cy - r * 0.14 + Math.sin(floatAng * 1.2) * (r * 0.22);

      // Quầng hào quang
      ctx.save();
      ctx.beginPath();
      ctx.arc(gx, gy, 14, 0, Math.PI * 2);
      ctx.fillStyle = gInfo.color;
      ctx.globalAlpha = 0.25 + Math.sin(waveStep * 2 + idx) * 0.1;
      ctx.shadowColor = gInfo.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // Icon biểu tượng cổ trùng
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(gInfo.icon, gx, gy);
    });

    // 3. Biển Chân Nguyên (Primeval Sea Waves)
    const seaY = cy + r - (r * 2 * fillRatio * 0.92);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, seaY);

    for(let x = 0; x <= w; x += 4){
      const y = seaY + Math.sin(x * 0.045 + waveStep * 2.2) * 5 + Math.cos(x * 0.02 + waveStep) * 3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();

    const seaGrad = ctx.createLinearGradient(0, seaY, 0, h);
    seaGrad.addColorStop(0, col.light);
    seaGrad.addColorStop(0.35, col.mid);
    seaGrad.addColorStop(1, col.dark);
    ctx.fillStyle = seaGrad;
    ctx.fill();

    // Bọt sóng phát sáng trên mặt biển
    ctx.beginPath();
    for(let x = 0; x <= w; x += 4){
      const y = seaY + Math.sin(x * 0.045 + waveStep * 2.2) * 5 + Math.cos(x * 0.02 + waveStep) * 3;
      if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = col.foam;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = col.foam;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    // Sóng phụ mờ bên dưới
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, seaY + 2);
    for(let x = 0; x <= w; x += 4){
      const y = seaY + 2 + Math.sin(x * 0.035 - waveStep * 1.8) * 4;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = col.light;
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.restore();

    // Hiển thị phần trăm chân nguyên giữa biển
    ctx.font = '600 13px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(`${Math.round(fillRatio * 100)}%`, cx, Math.max(cy + 6, seaY + 18));

    ctx.restore(); // end clip

    // 4. Viền quang mạc bích khiếu bên ngoài
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = col.light;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = col.light;
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Vành đai tư chất thiên phú
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (talent / 100)));
    ctx.strokeStyle = talent >= 85 ? '#ffd700' : talent >= 65 ? '#2ecc71' : '#e67e22';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  const api = { init, resize, draw };
  window.Aperture = api;
  return api;
})();
