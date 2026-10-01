// Chế độ theo lượt chiến thuật: dùng resolver gốc, chỉ bổ sung nhịp vòng,
// chân nguyên tuần hoàn, thủ thế và cửa sổ sơ hở. Nạp trước engine.js.
(function(window){
  'use strict';

  const TacticalBattle={
    VERSION:1,
    state:null,
    resumeTimer:null,
    // Mốc đầu tiên cố ý rất nhỏ: simulator seed cố định cho thấy +4/+6/+8/+10
    // làm tỷ lệ thắng chiến dịch tăng hơn gấp đôi trước khi BATTLE-03 có pattern gây áp lực.
    ESS_REGEN:{1:1,2:1,3:1,4:1},

    isEnabled(){
      if(typeof META!=='undefined'&&META&&META.opt&&META.opt.fightMode==='tactical')return true;
      return !!(typeof window!=='undefined'&&window.__FORCE_TACTICAL_MODE__);
    },

    init(c){
      const max=typeof maxEss==='function'?maxEss():Math.max(1,Math.floor(S.ess));
      c.tactical={
        v:this.VERSION,round:(c.turn||0)+1,phase:'select',waiting:true,
        essCycleCap:Math.min(max,Math.max(0,Math.floor(S.ess))),
        regenPerRound:this.ESS_REGEN[S.chuyen||1]||1,
        regenPending:false,guardStance:false,stagger:0,
        lastSummary:'Đọc ý đồ, chọn một hành động. Đối thủ sẽ đáp trả.',
        intentForecast:null
      };
      this.state=c.tactical;
      this.updateEnemyIntentForecast(c);
      return this.state;
    },

    ensure(c){
      if(!c)return null;
      if(!c.tactical||c.tactical.v!==this.VERSION)this.init(c);
      else{
        this.state=c.tactical;
        const s=this.state;
        s.round=(c.turn||0)+1;
        s.regenPerRound=this.ESS_REGEN[S.chuyen||1]||1;
        s.essCycleCap=Math.min(maxEss(),Math.max(0,Number(s.essCycleCap)||Math.floor(S.ess)));
        s.stagger=Math.max(0,Number(s.stagger)||0);
        s.guardStance=!!s.guardStance;s.regenPending=!!s.regenPending;
        if(!s.phase)s.phase='select';
        if(s.waiting===undefined)s.waiting=s.phase==='select';
        this.updateEnemyIntentForecast(c);
      }
      if(this.state.phase==='resolving'&&this.state.regenPending)this.queueNextRound(c);
      return this.state;
    },

    updateEnemyIntentForecast(c){
      if(!c||!this.state)return;
      const stun=(c.stun||0)>0,it=c.intent||'atk';
      if(stun){this.state.intentForecast={type:'stun',title:'Đang choáng',desc:'Đối thủ bỏ qua hành động này.',threat:'none',estDmg:'0',icon:'晕'};return}
      const range=typeof enemyIntentRange==='function'?enemyIntentRange(c,false):null;
      const est=range?`${range[0]}–${range[1]}`:'0';
      if(it==='heavy')this.state.intentForecast={type:it,title:'Đòn toàn lực',desc:'Sát thương gấp đôi. Hộ thể hoặc Thủ thế sẽ giảm rủi ro.',threat:'high',estDmg:est,icon:'猛'};
      else if(it==='guard')this.state.intentForecast={type:it,title:'Thế thủ phản kích',desc:'Tấn công trực diện sẽ bị phản kích ngay.',threat:'medium',estDmg:'Phản kích',icon:'守'};
      else if(it==='skill'&&c.sk&&typeof SK!=='undefined'&&SK[c.sk])this.state.intentForecast={type:it,title:SK[c.sk].n,desc:SK[c.sk].i||'Kỹ năng đặc biệt.',threat:'high',estDmg:range?est:'Không gây sát thương',icon:'技'};
      else this.state.intentForecast={type:'atk',title:'Tấn công',desc:'Đòn trực tiếp thông thường.',threat:'normal',estDmg:est,icon:'攻'};
    },

    canAct(type,arg,c){
      if(!this.state||!c||!this.state.waiting||this.state.phase!=='select'||(typeof FX!=='undefined'&&FX.busy))return false;
      if(type==='strike'||type==='guard_stance')return true;
      if(type==='gu'){
        const owned=S.gu[arg],g=owned&&GU[owned.k];
        return !!(g&&guReady(owned.k)&&S.ess>=guCostIdx(arg));
      }
      if(type==='combo'){
        const cb=COMBOS.find(x=>x.id===arg);
        return !!(cb&&guReady(cb.id)&&S.ess>=costOf(cb.cost));
      }
      if(type==='herb')return S.herbs>0&&guReady('herb');
      if(type==='absorb')return S.stones>=5&&(S.ess<this.state.essCycleCap||this.state.essCycleCap<maxEss());
      if(type==='flee')return !!c.flee;
      return false;
    },

    executeTacticalTurn(type,arg){
      const c=typeof S!=='undefined'&&S.combat;
      this.ensure(c);
      if(!this.canAct(type,arg,c))return false;
      const s=this.state,before={hp:S.hp,ess:S.ess,foe:c.hp,turn:c.turn,stones:S.stones};
      const intent=c.intent,stunned=(c.stun||0)>0,opening=s.stagger>0;
      s.waiting=false;s.phase='resolving';s.regenPending=true;

      // phase=resolving cho playerAct biết đây là lần gọi resolver thật, tránh gọi vòng lại.
      playerAct(type,arg);

      if(S.combat!==c)return true;
      const parts=[];
      const dealt=Math.max(0,before.foe-c.hp),hurt=Math.max(0,before.hp-S.hp),spent=Math.max(0,before.ess-S.ess);
      if(type==='guard_stance')parts.push('Thủ thế');
      else if(type==='absorb')parts.push(`Hấp thu ${before.stones-S.stones} thạch`);
      else if(dealt)parts.push(`gây ${dealt} sát thương`);
      else parts.push('đã thi triển');
      if(spent)parts.push(`tốn ${spent} chân nguyên`);
      if(hurt)parts.push(`nhận ${hurt} sát thương`);
      else if(c.turn>before.turn)parts.push('không mất khí huyết');

      // Cửa sổ cũ được dùng bởi hành động vừa rồi; đòn nặng vừa thực hiện mở cửa sổ mới.
      if(opening)s.stagger=0;
      if(intent==='heavy'&&!stunned&&c.turn>before.turn&&c.hp>0){
        s.stagger=1;parts.push('địch lộ sơ hở');
      }
      s.lastSummary=`Vòng ${before.turn+1}: ${parts.join(' · ')}.`;
      if(typeof saveAll==='function')saveAll();
      this.queueNextRound(c);
      return true;
    },

    queueNextRound(c){
      if(this.resumeTimer||!c||!c.tactical||c.tactical.phase!=='resolving')return;
      this.resumeTimer='queued';
      const timer=setTimeout(()=>{
        this.resumeTimer=null;
        if(typeof S==='undefined'||S.combat!==c||!c.tactical||c.tactical.phase!=='resolving')return;
        this.startNewRound(c);
      },typeof RM!=='undefined'&&RM?0:420);
      if(this.resumeTimer==='queued')this.resumeTimer=timer||'queued';
    },

    startNewRound(c){
      const s=c&&c.tactical;if(!s)return;this.state=s;
      if(s.regenPending){
        const add=Math.min(s.regenPerRound,Math.max(0,s.essCycleCap-S.ess));
        if(add>0){S.ess+=add;if(typeof FX!=='undefined'&&FX.q)FX.q({type:'text',on:'p',t:`+${add} chân nguyên`})}
        s.regenPending=false;
      }
      s.round=(c.turn||0)+1;s.guardStance=false;s.phase='select';s.waiting=true;
      this.updateEnemyIntentForecast(c);
      if(typeof saveAll==='function')saveAll();
      if(typeof render==='function')render();
    },

    energyHint(cost){
      if(!this.state||S.ess>=cost)return '';
      const miss=cost-S.ess,regen=this.state.regenPerRound||4;
      if(S.ess>=this.state.essCycleCap)return `Thiếu ${miss} chân nguyên · cần hấp thu nguyên thạch`;
      return `Thiếu ${miss} chân nguyên · hồi đủ sau ${Math.ceil(miss/regen)} vòng`;
    },

    renderTacticalBar(){
      const c=typeof S!=='undefined'&&S.combat,s=this.ensure(c);if(!s)return '';
      const f=s.intentForecast||{},threat=f.threat==='high'?'threat-high':f.threat==='medium'?'threat-medium':'threat-norm';
      return `<section class="tactical-hud" id="tacticalHud" aria-label="Thông tin vòng chiến đấu">
        <div class="tac-head"><span class="tac-badge">Vòng ${s.round}</span><span class="tac-phase ${s.phase}">${s.phase==='select'?'Chờ ngươi quyết định':'Đang giải quyết'}</span></div>
        <div class="tac-grid">
          <div class="tac-energy"><span>Chân nguyên tuần hoàn</span><b>${Math.floor(S.ess)} / ${s.essCycleCap}</b><small>+${s.regenPerRound} đầu vòng sau</small></div>
          <div class="tac-intent ${threat}"><i>${f.icon||'攻'}</i><span><small>Ý đồ địch</small><b>${esc(f.title||'Tấn công')} · ${esc(f.estDmg||'')}</b><em>${esc(f.desc||'')}</em></span></div>
          ${s.stagger>0?'<div class="tac-opening"><i>破</i><span><b>Địch lộ sơ hở</b><small>Hành động công kích kế tiếp: giáp còn một nửa, sát thương ×1,3</small></span></div>':''}
        </div>
        <div class="tac-summary"><span>Kết quả vòng trước</span><b>${esc(s.lastSummary)}</b></div>
      </section>`;
    }
  };
  window.TacticalBattle=TacticalBattle;
})(window);
