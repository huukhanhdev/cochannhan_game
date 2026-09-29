// Không Khiếu Hải: Mô phỏng không gian không khiếu và biển chân nguyên (Web Canvas Animation)
const Aperture = (function(){
  let cv = null, ctx = null;
  let animId = null;
  let waveStep = 0;

  const COLORS = {
    1: { name: 'Thanh Đồng', dark: '#1b4d37', mid: '#358a62', light: '#5fae8a', foam: '#9be3be', aura: 'rgba(95,174,138,0.3)' },
    2: { name: 'Xích Thiết', dark: '#5e2317', mid: '#9c3f2b', light: '#c8664e', foam: '#f79f88', aura: 'rgba(200,102,78,0.3)' },
    3: { name: 'Bạch Ngân', dark: '#374b54', mid: '#6f8b96', light: '#c9d3d6', foam: '#ffffff', aura: 'rgba(201,211,214,0.4)' },
  };

  const GU_ORB = {
    xuanthu: { icon: '蝉', color: '#ffd700', name: 'Xuân Thu Thiền' },
    nguyetquang: { icon: '月', color: '#8ad8ff', name: 'Nguyệt Quang' },
    nguyetmang: { icon: '芒', color: '#5ce1e6', name: 'Nguyệt Mang' },
    tuutrung: { icon: '酒', color: '#e6bf70', name: 'Tửu Trùng' },
    tuvi: { icon: '味', color: '#d87093', name: 'Tứ Vị Tửu Trùng' },
    bachthi: { icon: '猪', color: '#d2ab82', name: 'Bạch Thỉ' },
    hacthi: { icon: '黑', color: '#7a6857', name: 'Hắc Thỉ' },
    thietbi: { icon: '铁', color: '#8899a6', name: 'Thiết Bì' },
    ngocbi: { icon: '玉', color: '#7fe0b0', name: 'Ngọc Bì' },
    thienbong: { icon: '蓬', color: '#ffd24d', name: 'Thiên Bồng' },
    trilieu: { icon: '愈', color: '#8ee085', name: 'Trị Liệu' },
    huyetnguyet: { icon: '血', color: '#ff6655', name: 'Huyết Nguyệt' },
    huyetlo: { icon: '炉', color: '#ff4422', name: 'Huyết Lô' },
    diathinh: { icon: '耳', color: '#d8b08c', name: 'Địa Thính' },
    cuongnham: { icon: '岩', color: '#9e9e9e', name: 'Cương Nham' },
    xaloi1: { icon: '舍', color: '#ffcc00', name: 'Xá Lợi' },
    xaloi2: { icon: '利', color: '#ff5533', name: 'Xá Lợi' },
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
    if(!cv) return;
    const rect = cv.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    cv.width = rect.width * dpr;
    cv.height = rect.height * dpr;
    if(ctx) ctx.scale(dpr, dpr);
  }

  function loop(){
    animId = requestAnimationFrame(loop);
    draw();
  }

  function draw(){
    if(!ctx || !cv || typeof S==='undefined' || !S) return;
    const w = cv.getBoundingClientRect().width;
    const h = cv.getBoundingClientRect().height;
    if(w <= 0 || h <= 0) return;

    ctx.clearRect(0, 0, w, h);
    waveStep += 0.035;

    const rank = S.chuyen || 1;
    const col = COLORS[rank] || COLORS[1];
    const fillRatio = clamp((S.ess || 0) / (maxEss() || 1), 0.05, 1);
    const talent = S.tuchat || 44;

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 8;

    // 1. Vỏ Bích Khiếu (Quang mạc / Thủy mạc)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Nền hư không không khiếu (Aperture void)
    const bgGrad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
    bgGrad.addColorStop(0, '#0c1317');
    bgGrad.addColorStop(0.7, '#070b0d');
    bgGrad.addColorStop(1, '#020405');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Bụi tinh vân lấp lánh (Nebula star dust)
    for(let i = 0; i < 12; i++){
      const ang = (i * 30 + waveStep * 5) * Math.PI / 180;
      const dist = (r * 0.25) + (i % 4) * (r * 0.16);
      const sx = cx + Math.cos(ang) * dist;
      const sy = cy + Math.sin(ang * 0.7) * dist * 0.6 - (1 - fillRatio) * (r * 0.2);
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? col.foam : 'rgba(236,232,207,0.7)';
      ctx.fill();
    }

    // 2. Các Cổ trùng đang bay lơ lửng trong không khiếu
    const activeGu = (S.gu || []).slice(0, 5);
    activeGu.forEach((g, idx) => {
      const gInfo = GU_ORB[g.k] || { icon: '蛊', color: '#fff' };
      const floatAng = waveStep * 0.8 + idx * (Math.PI * 2 / Math.max(1, activeGu.length));
      const floatR = r * 0.38 + Math.sin(waveStep * 1.5 + idx) * 8;
      const gx = cx + Math.cos(floatAng) * floatR;
      const gy = cy - r * 0.15 + Math.sin(floatAng * 1.2) * (r * 0.25);

      // Quầng sáng quanh cổ trùng
      ctx.save();
      ctx.beginPath();
      ctx.arc(gx, gy, 14, 0, Math.PI * 2);
      ctx.fillStyle = gInfo.color;
      ctx.globalAlpha = 0.2 + Math.sin(waveStep * 2 + idx) * 0.1;
      ctx.shadowColor = gInfo.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // Icon cổ trùng
      ctx.font = '16px "Ma Shan Zheng", "KaiTi", serif'; ctx.fillStyle = '#ece8cf';
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

    // Sóng lớp trước
    for(let x = 0; x <= w; x += 4){
      const y = seaY + Math.sin(x * 0.045 + waveStep * 2.2) * 5 + Math.cos(x * 0.02 + waveStep) * 3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();

    const seaGrad = ctx.createLinearGradient(0, seaY, 0, h);
    seaGrad.addColorStop(0, col.light);
    seaGrad.addColorStop(0.3, col.mid);
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

    // Sóng thứ hai (nổi sau mờ hơn)
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

    // Text phần trăm chân nguyên giữa biển
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

    // Khuyên vàng thiên phú (Tư chất)
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (talent / 100)));
    ctx.strokeStyle = talent >= 85 ? '#ffd700' : talent >= 65 ? '#80b99b' : '#c8664e';
    ctx.lineWidth = 2;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();
  }

  window.addEventListener('resize', resize);

  const api = { init, resize, draw };
  window.Aperture = api;
  return api;
})();
