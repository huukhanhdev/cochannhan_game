// Nhân quả, quyết định và hậu quả xuyên chương.
// Nạp trước engine.js; các hàm luôn lấy binding S hiện tại vì newLife/startQ2/rewind thay cả object S.

(function(root){
  'use strict';

  const CONDITIONS=Object.create(null), EFFECTS=Object.create(null);

  function currentState(){
    // Global `let S` của engine không trở thành window.S. Fallback root.S giữ harness cũ chạy được.
    try{return typeof S!=='undefined'?S:root.S}catch(_){return root.S}
  }
  function migrateJournalEntry(e){
    if(!e||typeof e!=='object')return null;
    const out=Object.assign({},e);
    if(out.turn===undefined&&out.tuan!==undefined)out.turn=out.tuan;
    if(!out.choiceText&&out.text)out.choiceText=out.text;
    if(out.isLech===undefined&&out.tag==='diso')out.isLech=true;
    return out;
  }
  function initStoryState(state){
    if(!state)return;
    if(!state.story)state.story={};
    const story=state.story;
    story.version=2;
    story.outcomes=story.outcomes&&typeof story.outcomes==='object'?story.outcomes:{};
    story.pending=Array.isArray(story.pending)?story.pending:[];
    story.applied=story.applied&&typeof story.applied==='object'?story.applied:{};
    story.journal=(Array.isArray(story.journal)?story.journal:[]).map(migrateJournalEntry).filter(Boolean).slice(-100);
    return story;
  }
  function position(state){return {book:state.book||1,chap:state.chap||'',turn:state.turn||0,time:Date.now()}}
  function pushJournal(state,entry){
    initStoryState(state);
    state.story.journal.push(Object.assign(position(state),entry));
    if(state.story.journal.length>100)state.story.journal.splice(0,state.story.journal.length-100);
  }

  // details: {choiceText,note,title,evId,isLech,driftAmount,apply}. Chuỗi/hàm cũ vẫn tương thích.
  function storySetOutcome(chainId,outcomeId,details,isLech,driftAmount){
    const state=currentState();if(!state)return;
    initStoryState(state);
    let meta={},apply=null;
    if(typeof details==='function')apply=details;
    else if(typeof details==='string')meta.choiceText=details;
    else if(details&&typeof details==='object'){meta=details;if(typeof details.apply==='function')apply=details.apply}
    const lech=meta.isLech!==undefined?!!meta.isLech:!!isLech;
    const drift=meta.driftAmount!==undefined?meta.driftAmount:(driftAmount||6);
    const prev=state.story.outcomes[chainId];
    state.story.outcomes[chainId]=outcomeId;
    const key=chainId+':'+outcomeId;
    if(!state.story.applied[key]){
      state.story.applied[key]=true;
      if(apply)apply(state);
      if(lech&&typeof root.driftAdd==='function')root.driftAdd(drift,chainId);
      pushJournal(state,{
        chainId,outcomeId,evId:meta.evId||(state.sc&&state.sc.id)||'',
        title:meta.title||'',choiceText:meta.choiceText||outcomeId,note:meta.note||'',
        type:'decision',tag:lech?'diso':'canon',isLech:lech
      });
    }
    return {chainId,prev,current:outcomeId};
  }
  function storyGetOutcome(chainId){
    const state=currentState();
    return state&&state.story&&state.story.outcomes?state.story.outcomes[chainId]||null:null;
  }
  function storyHasOutcome(chainId,outcomeId){return storyGetOutcome(chainId)===outcomeId}

  function storyRegisterCondition(id,fn){if(id&&typeof fn==='function')CONDITIONS[id]=fn}
  function storyRegisterEffect(id,fn){if(id&&typeof fn==='function')EFFECTS[id]=fn}
  function storySchedulePending(def){
    const state=currentState();if(!state||!def||!def.id)return false;
    initStoryState(state);
    if(state.story.applied['pending:'+def.id])return false;
    if(state.story.pending.some(p=>p.id===def.id&&p.status==='pending'))return false;
    state.story.pending.push({
      id:def.id,chainId:def.chainId||'',targetBook:def.targetBook||state.book||1,
      targetChap:def.targetChap||'',minTurn:def.minTurn??0,maxTurn:def.maxTurn??9999,
      condId:def.condId||'',effectId:def.effectId||'',eventId:def.eventId||'',status:'pending',
      createdBook:state.book||1,createdChap:state.chap||'',createdTurn:state.turn||0
    });
    return true;
  }
  function storyCheckPending(currentBook,currentChap,currentTurn){
    const state=currentState();if(!state)return [];
    initStoryState(state);
    const book=currentBook??state.book??1,chap=currentChap??state.chap??'',turn=currentTurn??state.turn??0;
    const ready=[],remaining=[];
    for(const p of state.story.pending){
      if(p.status!=='pending')continue;
      if(p.targetBook&&p.targetBook<book){p.status='expired';continue}
      const bookMatch=!p.targetBook||p.targetBook===book;
      const chapMatch=!p.targetChap||p.targetChap===chap;
      if(!bookMatch||!chapMatch){remaining.push(p);continue}
      const condition=!p.condId||(CONDITIONS[p.condId]&&CONDITIONS[p.condId](state,p));
      if(turn>=p.minTurn&&turn<=p.maxTurn&&condition){
        p.status='resolved';state.story.applied['pending:'+p.id]=true;ready.push(p);
      }
      else if(turn>p.maxTurn)p.status='expired';
      else remaining.push(p);
    }
    state.story.pending=remaining;
    return ready;
  }
  function storyApplyPending(p){
    const state=currentState();if(!state||!p||!p.effectId||!EFFECTS[p.effectId])return false;
    EFFECTS[p.effectId](state,p);return true;
  }
  function storyAddJournal(text,type,tag,extra){
    const state=currentState();if(!state)return;
    const meta=Object.assign({},extra||{});
    const lech=meta.isLech!==undefined?meta.isLech:(tag==='diso'?true:undefined);
    pushJournal(state,Object.assign(meta,{
      choiceText:meta.choiceText||text||'',type:type||'info',tag:tag||'chung',isLech:lech
    }));
  }
  function storyResetTimeline(preserveOutcomes){
    const state=currentState();if(!state||!state.story)return;
    initStoryState(state);state.story.pending=[];
    if(!preserveOutcomes){state.story.outcomes={};state.story.applied={}}
    storyAddJournal('Xuân Thu Thiền kích hoạt: dòng thời gian được đảo ngược!','warning','xuanthu');
  }

  const StoryModule={init:initStoryState,setOutcome:storySetOutcome,getOutcome:storyGetOutcome,
    hasOutcome:storyHasOutcome,schedulePending:storySchedulePending,checkPending:storyCheckPending,
    applyPending:storyApplyPending,addJournal:storyAddJournal,resetTimeline:storyResetTimeline,
    registerCondition:storyRegisterCondition,registerEffect:storyRegisterEffect};
  if(typeof module!=='undefined'&&module.exports)module.exports=StoryModule;
  root.Story=StoryModule;
  Object.assign(root,{initStoryState,storySetOutcome,storyGetOutcome,storyHasOutcome,storySchedulePending,
    storyCheckPending,storyApplyPending,storyAddJournal,storyResetTimeline,storyRegisterCondition,storyRegisterEffect});
})(typeof window!=='undefined'?window:globalThis);
