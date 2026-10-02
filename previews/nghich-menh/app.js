/* PR-01: independent presentation prototype. No production scripts or save access. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const asset = name => `../../assets/${name}`;
  const state = { book:1, place:'wine', turn:7, ap:3, stones:128, hp:86, ess:42,
    filter:'all', gu:'moon', result:null, entries:[], enemy:100, round:1,
    fightHp:86, fightEss:42, combatOver:false, message:'Chọn cách ứng phó. Mỗi hành động là một lượt trong bản mẫu.' };
  const places = [
    {id:'academy',name:'Học đường',q2:'Phố chợ',glyph:'学',x:21,y:47,note:'Tu luyện & kiến thức',text:'Tiếng giảng bài vọng qua sân trúc. Một buổi chuyên tâm có thể giúp ngươi củng cố căn cơ.'},
    {id:'wine',name:'Hậu sơn',q2:'Ngoại thành',glyph:'洞',x:57,y:13,note:'Có manh mối',text:'Trong gió núi thoảng một mùi rượu rất nhạt. Ký ức năm trăm năm nhắc ngươi về di tàng Hoa Tửu.'},
    {id:'forest',name:'Núi rừng',q2:'Diễn võ trường',glyph:'山',x:78,y:51,note:'Có thể gặp hiểm nguy',text:'Ngoài con đường quen là lãnh địa của dã thú. Chuẩn bị cổ trùng trước khi bước vào.'},
    {id:'market',name:'Sơn trại',q2:'Cửa hiệu cổ',glyph:'市',x:46,y:88,note:'Xem bộ cổ',text:'Sắp xếp cổ trùng, xem nguồn thức ăn và chuẩn bị cho chuyến đi tiếp theo.'}
  ];
  const gus = [
    {id:'moon',name:'Nguyệt Quang Cổ',rank:'Nhất chuyển',type:'attack',label:'Công kích',file:'g_nguyetquang.jpg',food:'Nguyệt lan',cost:'6 chân nguyên',desc:'Cổ trùng trong như lam thủy tinh, nhẹ như một trang giấy. Chân nguyên ngưng tụ thành một đường nguyệt nhận sắc lạnh.',use:'Nguyệt nhận',stat:'18 sát thương · số liệu mẫu'},
    {id:'wine',name:'Tửu Trùng',rank:'Nhất chuyển',type:'support',label:'Tu luyện',file:'g_tuutrung.jpg',food:'Rượu',cost:'Thụ động',desc:'Một con sâu trắng béo tròn, say ngủ trong hương rượu. Nó tinh luyện chân nguyên, hỗ trợ bước đường tu luyện.',use:'Tinh luyện chân nguyên',stat:'Hỗ trợ tu luyện'},
    {id:'jade',name:'Ngọc Bì Cổ',rank:'Nhất chuyển',type:'guard',label:'Phòng ngự',file:'g_ngocbi.jpg',food:'Ngọc thạch vụn',cost:'8 chân nguyên',desc:'Ánh ngọc lặng lẽ phủ lên da thịt. Một lớp phòng ngự để giữ mạng khi bước vào hiểm cảnh.',use:'Ngọc bì hộ thể',stat:'Giảm sát thương nhận vào'},
    {id:'cicada',name:'Xuân Thu Thiền',rank:'Lục chuyển',type:'support',label:'Bản mệnh',file:'g_xuanthu.jpg',food:'Đặc thù',cost:'Chưa hồi phục',desc:'Con ve nằm im nơi sâu nhất trong không khiếu. Đôi cánh mỏng mang theo bí mật về dòng sông thời gian.',use:'Nghịch chuyển quang âm',stat:'Chưa thể kích hoạt'},
    {id:'boar',name:'Bạch Thỉ Cổ',rank:'Nhất chuyển',type:'support',label:'Lực đạo',file:'g_bachthi.jpg',food:'Thịt thú',cost:'Cổ tăng lực',desc:'Một phần căn cơ trên con đường lực đạo. Chỉ một con cổ nhỏ, nhưng có thể đổi sức mạnh của cả thân thể.',use:'Tăng cường sức lực',stat:'Một trư chi lực'},
    {id:'heal',name:'Trị Liệu Cổ',rank:'Nhất chuyển',type:'support',label:'Trị liệu',file:'g_trilieu.jpg',food:'Thảo dược',cost:'Theo kỹ năng',desc:'Giữa đường núi dài và những cuộc giao tranh, một khả năng hồi phục luôn là thứ đáng giữ lại.',use:'Hồi phục',stat:'Hỗ trợ sinh tồn'}
  ];
  const icon = (glyph) => `<span class="pin-icon"><i>${glyph}</i></span>`;
  const primary = (text, action) => `<button class="primary" data-action="${action}">${text}<span aria-hidden="true">↗</span></button>`;
  function journey() {
    const q2 = state.book === 2;
    const chosen = places.find(p => p.id === state.place);
    return `<section class="scene ${q2?'q2':''}" aria-labelledby="view-title">
      <div class="scene-art" aria-hidden="true"></div>
      <div class="chapter-seal" aria-hidden="true">${q2?'商家城':'青茅山'}<small>${q2?'THƯƠNG GIA THÀNH':'NAM CƯƠNG · CỔ NGUYỆT'}</small></div>
      <div class="scene-copy"><div class="book-switch" aria-label="Chọn bối cảnh mẫu"><button data-book="1" class="${q2?'':'active'}" aria-pressed="${!q2}">QUYỂN I</button><button data-book="2" class="${q2?'active':''}" aria-pressed="${q2}">QUYỂN II</button></div>
      <div class="eyebrow">${q2?'Chặng 04 · Một chỗ đứng mới':'Chặng 01 · Trở về cố thổ'}</div>
      <h1 id="view-title" class="display-title">${q2?'Thương gia<br><em>thành.</em>':'Thanh<br><em>Mao Sơn.</em>'}</h1>
      <p class="intro-copy">${q2?'Giữa phồn hoa là vô số cuộc trao đổi. Một cơ hội tốt luôn có cái giá của nó.':'Núi vẫn xanh như năm ấy.<br>Chỉ người trở về đã mang theo<br>năm trăm năm phong sương.'}</p>
      <p class="season">${q2?'Một chặng đường mới':'Sương sớm trên sơn trại'} · ${q2?'Tháng':'Tuần'} ${state.turn}</p>
      <article class="quest"><small>◇ ${q2?'KHÁM PHÁ BỐI CẢNH':'MANH MỐI ĐANG CHỜ'}</small><h2>${q2?'Giữa lòng Thương thành':'Hương rượu trong gió'}</h2><p>${q2?'Ghé cửa hiệu, xem bộ cổ trước chặng đường kế tiếp.':'Có những cơ duyên chỉ người từng trải mới nhận ra.'}</p>${primary(q2?'Xem cổ trùng':'Lần theo manh mối',q2?'inventory':'story')}</article></div>
      <div class="pins" aria-label="Địa điểm"><svg class="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M21 47 Q35 30 57 13 M21 47 Q29 76 46 88 Q70 80 78 51 Q75 22 57 13"/></svg>${places.map(p=>`<button class="pin ${state.place===p.id?'selected':''} ${p.id==='wine'?'new':''}" style="--x:${p.x}%;--y:${p.y}%" data-place="${p.id}" aria-pressed="${state.place===p.id}">${icon(p.glyph)}<span><b>${q2?p.q2:p.name}</b><small>${q2?'Khám phá địa điểm':p.note}</small></span></button>`).join('')}</div>
      <article class="location-card" aria-live="polite"><div class="eyebrow">Địa điểm đang chọn</div><h3>${q2?chosen.q2:chosen.name}</h3><p>${q2?'Một góc Thương gia thành. Bản mẫu cho phép xem kho cổ, hội thoại và trận chiến qua thanh điều hướng.':chosen.text}</p><footer><span>${state.place==='market'||q2?'Không tốn việc':'1 việc · bản mẫu'}</span>${primary(q2?'Xem bộ cổ':state.place==='forest'?'Chuẩn bị':'Đi tới',q2?'inventory':'travel')}</footer></article>
      <div class="turn-control"><span class="dots" aria-label="${state.ap} trên 3 việc còn lại">${[0,1,2].map(i=>`<i class="${i<state.ap?'filled':''}"></i>`).join('')}</span><span>${state.ap}/3 việc còn lại</span><button data-action="next-turn">Qua ${q2?'tháng':'tuần'} →</button></div>
      <div class="scene-coordinate">SƠN THỦY HỮU TẬN · NHÂN TÂM VÔ CÙNG</div>
    </section>`;
  }
  function story() {
    return `<section class="story-page" aria-labelledby="view-title"><div class="story-backdrop" aria-hidden="true"></div><img class="story-portrait" src="${asset('art/p_hero_q1.jpg')}" alt="Phương Nguyên"><div class="story-calligraphy" aria-hidden="true">酒香引路</div><div class="story-caption">Phương Nguyên<small>NĂM TRĂM NĂM KÝ ỨC</small></div>
    <div class="story-content"><div class="eyebrow">Quyển I · Hậu sơn</div><h1 id="view-title">Hương rượu<br>trong gió.</h1><div class="story-meta">DI TÀNG HOA TỬU · CẢNH CHUYỂN THỂ MẪU</div>
    <div class="story-text"><b>NGƯỜI KỂ CHUYỆN</b><p>Sương phủ lối mòn. Bên một khe đá, mùi rượu thoảng qua rồi tan trong gió núi.</p><p>Ngươi dừng bước. Trong trí nhớ của kẻ đã sống năm trăm năm, có một di tàng vẫn chưa được tìm thấy.</p></div>
    ${state.result?`<div class="result" role="status"><small>DẤU VẾT MỘT LỰA CHỌN</small><h2>${state.result.title}</h2><p>${state.result.text}</p><button class="secondary" data-action="return">Trở lại hành trình →</button></div><button class="text-button" data-action="replay" style="color:#d6c599">Thử lựa chọn khác</button>`:`<div class="choices"><button class="choice" data-choice="follow"><span class="choice-index">01</span><span><strong>Lần theo hương rượu vào khe núi</strong><small>Thăm dò · Tốn 1 việc · Có thể gặp hiểm nguy</small></span><span>↗</span></button><button class="choice" data-choice="wait"><span class="choice-index">02</span><span><strong>Ghi nhớ nơi này, trở về chuẩn bị</strong><small>Thận trọng · Giữ nguyên việc còn lại</small></span><span>↗</span></button></div>`}
    <p class="demo-label">Lời dẫn chuyển thể cho prototype · Lựa chọn chỉ thay đổi phiên xem thử.</p></div></section>`;
  }
  function inventory() {
    const selected = gus.find(g=>g.id===state.gu);
    const list = gus.filter(g=>state.filter==='all'||g.type===state.filter);
    return `<section class="dark-page" aria-labelledby="view-title"><header class="page-heading"><div><div class="eyebrow">Không khiếu · Bộ sưu tập mẫu</div><h1 id="view-title" class="display-title">Vạn vật là cổ.</h1><p>Mỗi con cổ là một khả năng.<br>Cách dùng chúng mới quyết định con đường.</p></div><span class="page-number">06 <small>/ CỔ TRÙNG</small></span></header>
    <div class="filters" aria-label="Lọc cổ trùng">${[['all','Tất cả · 6'],['attack','Công kích'],['guard','Phòng ngự'],['support','Hỗ trợ']].map(([id,n])=>`<button data-filter="${id}" class="${state.filter===id?'active':''}" aria-pressed="${state.filter===id}">${n}</button>`).join('')}</div>
    <div class="gu-layout"><div class="gu-grid">${list.map(g=>`<button class="gu-card ${state.gu===g.id?'selected':''}" data-gu="${g.id}" aria-pressed="${state.gu===g.id}"><span class="gu-art"><img src="${asset('gu/'+g.file)}" alt="" loading="lazy"></span><span class="gu-rank">${g.rank}</span><h3>${g.name}</h3><small>${g.label} · ${g.id==='cicada'?'Đang hồi phục':'Đã nhận biết'}</small></button>`).join('')}</div>
    <aside class="gu-detail" aria-label="Chi tiết cổ trùng" aria-live="polite"><img src="${asset('gu/'+selected.file)}" alt="${selected.name}"><div class="eyebrow">${selected.rank} · ${selected.label}</div><h2>${selected.name}</h2><p>${selected.desc}</p><div class="detail-stat"><span>Khả năng</span><b>${selected.use}</b></div><div class="detail-stat"><span>Thức ăn</span><b>${selected.food}</b></div><div class="detail-stat"><span>Tiêu hao</span><b>${selected.cost}</b></div>${primary(selected.type==='attack'||selected.type==='guard'?'Thử trong trận mẫu':'Xem công dụng','gu-demo')}<p class="hint">Dữ liệu minh họa để so sánh giao diện; không phải kho cổ trong save của bạn.</p></aside></div></section>`;
  }
  function journal() {
    return `<section class="dark-page" aria-labelledby="view-title"><div class="journal-layout"><div><div class="eyebrow">Dấu vết của những lựa chọn</div><h1 id="view-title" class="display-title">Nhân<br>quả lục.</h1><p class="journal-intro">Một ý niệm khởi lên.<br>Một con đường đổi khác.<br><br>Những gì ngươi đã chọn sẽ để lại dấu vết trên hành trình này.</p><p class="demo-label">Các mốc minh họa và lựa chọn của phiên preview.</p></div><div class="timeline-list">${state.entries.map(e=>`<article class="journal-entry"><small>VỪA XẢY RA · TUẦN ${e.turn}</small><h2>${e.title}</h2><p>${e.text}</p><span class="consequence">${e.effect}</span></article>`).join('')}
    <article class="journal-entry"><small>MỐC MINH HỌA · KHỞI ĐẦU QUYỂN I</small><h2>Trở về cố thổ</h2><p>Xuân Thu Thiền đưa Phương Nguyên trở lại thời niên thiếu. Núi cũ, người cũ, nhưng lựa chọn lần này nằm trong tay ngươi.</p><span class="consequence">Bắt đầu một hành trình mới</span></article><article class="journal-entry pending"><small>CHƯA ĐỊNH ĐOẠT</small><h2>Phía sau màn sương</h2><p>Hương rượu nơi hậu sơn vẫn còn đó. Một lựa chọn đang chờ được viết tiếp.</p><a class="text-button" href="#story">Đi tới câu chuyện →</a></article></div></div></section>`;
  }
  function combat() {
    return `<section class="arena" aria-labelledby="view-title"><header class="arena-heading"><div><div class="eyebrow">Núi rừng · Thử cảm giác chiến đấu</div><h1 id="view-title">Nguyệt nhận giữa rừng.</h1><div class="intent">${state.combatOver?'Trận mô phỏng đã kết thúc':`Lượt ${state.round} · Ý đồ địch: ${state.round%3===0?'Lao tới mạnh · 22 sát thương':'Cắn xé · 12 sát thương'}`}</div></div><button class="secondary" data-action="reset-combat">Bắt đầu lại ↻</button></header>
    <div class="fighters"><article class="fighter"><img src="${asset('art/p_hero_q1.jpg')}" alt="Phương Nguyên"><h2>Phương Nguyên</h2><small>${state.fightHp}/100 khí huyết · ${state.fightEss}/60 chân nguyên</small><div class="meter"><i style="width:${state.fightHp}%"></i></div></article><span class="versus" aria-hidden="true">vs.</span><article class="fighter"><img src="${asset('art/p_wolf.jpg')}" alt="Sói rừng"><h2>Sói rừng</h2><small>${state.enemy}/100 khí huyết</small><div class="meter"><i style="width:${state.enemy}%"></i></div></article></div>
    <p class="combat-log" role="status">${state.message}</p><div class="skills"><button class="skill" data-skill="attack" ${state.combatOver||state.fightEss<6?'disabled':''}><b>☽ Nguyệt nhận</b><small>−6 chân nguyên · 28 sát thương mẫu</small></button><button class="skill" data-skill="guard" ${state.combatOver||state.fightEss<8?'disabled':''}><b>◇ Ngọc bì hộ thể</b><small>−8 chân nguyên · Giảm 75% đòn tới</small></button><button class="skill" data-skill="recover" ${state.combatOver?'disabled':''}><b>↟ Điều tức</b><small>+18 chân nguyên · Chịu đòn thường</small></button></div><p class="combat-note">Combat theo lượt mô phỏng cho PR-01 · Chưa dùng engine hoặc cân bằng của game chính.</p></section>`;
  }
  const screens = {journey,story,gu:inventory,journal,combat};
  function currentView(){return Object.hasOwn(screens,location.hash.slice(1)) ? location.hash.slice(1) : 'journey'}
  function render(focus=false){
    const view=currentView();
    $('#main').innerHTML=screens[view]();
    document.querySelectorAll('[data-view]').forEach(a=>{const active=a.dataset.view===view;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    $('#stone-value').textContent=state.stones;
    const hp=view==='combat'?state.fightHp:state.hp,ess=view==='combat'?state.fightEss:state.ess;
    $('#hp-value').textContent=`${hp} / 100`;$('#ess-value').textContent=`${ess} / 60`;
    $('#hp-bar').style.width=hp+'%';$('#ess-bar').style.width=ess/60*100+'%';
    if(focus){$('#main').focus({preventScroll:true});window.scrollTo(0,0)}
  }
  function go(view){if(currentView()===view)render(true);else location.hash=view}
  let statusTimer;
  function notify(text){clearTimeout(statusTimer);$('#status').textContent=text;$('#status').classList.add('visible');statusTimer=setTimeout(()=>$('#status').classList.remove('visible'),4500)}
  let opener;
  function dialog(title,body,actions=''){
    opener=document.activeElement;
    $('#dialog').innerHTML=`<div class="eyebrow">Nghịch Mệnh · Bản B</div><h2 id="dialog-title">${title}</h2>${body}<div class="dialog-actions"><button class="secondary" data-action="close-dialog">Đóng</button>${actions}</div>`;
    $('#dialog').showModal();
  }
  function closeDialog(){$('#dialog').close()}
  $('#dialog').addEventListener('close',()=>{if(opener?.isConnected)opener.focus()});
  function choose(choice){
    if(state.result)return;
    if(choice==='follow'&&state.ap<1){notify('Đã hết việc trong tuần. Trở lại hành trình và qua tuần để tiếp tục.');return}
    state.result=choice==='follow'?{title:'Một lối đi mở ra',text:'Ngươi lần theo mùi rượu và nhận ra một khe đá kín. Manh mối được ghi lại, chờ lần thăm dò kế tiếp.'}:{title:'Lùi một bước để chuẩn bị',text:'Ngươi ghi nhớ vị trí rồi trở về. Có những cơ duyên cần sự kiên nhẫn hơn là vội vã.'};
    if(choice==='follow')state.ap--;
    state.entries.unshift({...state.result,turn:state.turn,effect:choice==='follow'?'−1 việc · Đã ghi nhận manh mối':'Giữ nguyên số việc · Đã ghi nhớ địa điểm'});
    render();$('.result').focus?.();
  }
  function skill(action){
    if(state.combatOver)return;
    const hit=state.round%3===0?22:12;let taken=hit;
    if(action==='attack'){if(state.fightEss<6)return;state.fightEss-=6;state.enemy=Math.max(0,state.enemy-28);state.message='Nguyệt nhận xé qua sương rừng. Sói mất 28 khí huyết.'}
    if(action==='guard'){if(state.fightEss<8)return;state.fightEss-=8;taken=Math.ceil(hit*.25);state.message='Ánh ngọc phủ lên da thịt. Ngươi giảm được phần lớn đòn đánh.'}
    if(action==='recover'){state.fightEss=Math.min(60,state.fightEss+18);state.message='Ngươi điều tức, hồi tối đa 18 chân nguyên.'}
    if(state.enemy>0){state.fightHp=Math.max(0,state.fightHp-taken);state.message+=` Nhận ${taken} sát thương.`}
    state.round++;
    if(state.enemy===0){state.combatOver=true;state.message='Sói rừng gục xuống. Trận mẫu hoàn tất — không cộng thưởng vào game chính.'}
    else if(state.fightHp===0){state.combatOver=true;state.message='Ngươi đã gục ngã trong trận mẫu. Bấm Bắt đầu lại để thử cách khác.'}
    render();const next=$(`[data-skill="${action}"]:not(:disabled)`);(next||$('[data-action="reset-combat"]')).focus({preventScroll:true});
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    const d=button.dataset;
    if(d.book){state.book=Number(d.book);render();$(`[data-book="${d.book}"]`).focus({preventScroll:true});return}
    if(d.place){state.place=d.place;render();$(`[data-place="${d.place}"]`).focus({preventScroll:true});return}
    if(d.gu){state.gu=d.gu;render();$(`[data-gu="${d.gu}"]`).focus({preventScroll:true});return}
    if(d.filter){state.filter=d.filter;const first=gus.find(g=>d.filter==='all'||g.type===d.filter);if(first)state.gu=first.id;render();$(`[data-filter="${d.filter}"]`).focus({preventScroll:true});return}
    if(d.choice){choose(d.choice);return}if(d.skill){skill(d.skill);return}
    switch(d.action){
      case 'settings':dialog('Một khoảng tĩnh.',`<p>Đây là prototype độc lập để thử bố cục, lựa chọn và phản hồi. Tải lại trang để đặt lại phiên mẫu; save game chính không được đọc hoặc ghi.</p><label><input type="checkbox" id="motion" ${document.body.classList.contains('reduce-motion')?'checked':''}> Giảm chuyển động</label><p><a href="../../ui_v2_preview.html" target="_blank" rel="noopener">Mở bản A trong tab khác ↗</a></p><p>Art dùng lại từ assets/art và assets/gu trong project. Không tải manifest ảnh cá nhân.</p>`);break;
      case 'close-dialog':closeDialog();break;
      case 'story':state.book=1;go('story');break;
      case 'inventory':go('gu');break;
      case 'return':go('journey');break;
      case 'replay':state.result=null;render();break;
      case 'travel':
        if(state.place==='market')go('gu');
        else if(state.place==='forest')go('combat');
        else if(state.place==='wine')go('story');
        else if(state.ap>0){state.ap--;state.ess=Math.min(60,state.ess+10);render();notify('Chuyên tâm học tập · −1 việc, +10 chân nguyên trong bản mẫu.')}else notify('Đã hết việc. Qua tuần để tiếp tục.');
        break;
      case 'next-turn':dialog('Khép lại một lượt.',`<p>Bản mẫu còn ${state.ap} việc. Sang lượt mới sẽ đặt lại thành 3 việc; bản demo này chưa mô phỏng chi phí nuôi cổ.</p>`,primary('Sang lượt mới','confirm-turn'));break;
      case 'confirm-turn':state.turn++;state.ap=3;state.result=null;closeDialog();render();notify('Một lượt mới bắt đầu. Ngươi có 3 việc.');break;
      case 'gu-demo':{const g=gus.find(g=>g.id===state.gu);if(g.type==='attack'||g.type==='guard')go('combat');else dialog(g.name,`<p>${g.desc}</p><p><b>${g.stat}</b></p><p>Thông tin minh họa; thao tác dùng cổ sẽ được nối với engine ở PR tiếp theo.</p>`);break}
      case 'reset-combat':Object.assign(state,{enemy:100,round:1,fightHp:86,fightEss:42,combatOver:false,message:'Trận mẫu đã đặt lại. Đọc ý đồ địch trước khi chọn kỹ năng.'});render();$('[data-action="reset-combat"]').focus();break;
    }
  });
  document.addEventListener('change',event=>{if(event.target.id==='motion')document.body.classList.toggle('reduce-motion',event.target.checked)});
  window.addEventListener('hashchange',()=>render(true));
  render();
})();
