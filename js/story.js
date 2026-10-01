// js/story.js - Hệ thống quản lý Nhân Quả, Quyết Định và Lịch Trình Sự Kiện Xuyên Chương
// Dùng cho Big Update Quyển 1 & Quyển 2 theo kế hoạch PR-01 / PR-02.

(function(root) {
  'use strict';

  // Khởi tạo hoặc migrate state S.story
  function initStoryState(state) {
    if (!state) return;
    if (!state.story) {
      state.story = {
        version: 1,
        outcomes: {},  // chainId -> outcomeId (vd: 'kimsinh': 'kill')
        pending: [],   // danh sách hậu quả chờ kích hoạt
        applied: {},   // marker chống lặp phần thưởng/kết quả
        journal: []    // nhật ký ghi nhận các quyết định quan trọng
      };
    } else {
      state.story.outcomes = state.story.outcomes || {};
      state.story.pending = Array.isArray(state.story.pending) ? state.story.pending : [];
      state.story.applied = state.story.applied || {};
      state.story.journal = Array.isArray(state.story.journal) ? state.story.journal : [];
      state.story.version = state.story.version || 1;
    }
    return state.story;
  }

  // Ghi nhận một kết quả quyết định
  function storySetOutcome(chainId, outcomeId, payload, isLech, driftAmount) {
    if (!root.S) return;
    initStoryState(root.S);
    const prev = root.S.story.outcomes[chainId];
    root.S.story.outcomes[chainId] = outcomeId;

    const key = chainId + ':' + outcomeId;
    if (payload && !root.S.story.applied[key]) {
      root.S.story.applied[key] = true;
      if (typeof payload === 'function') {
        payload(root.S);
      }
    }

    // Kết nối cánh bướm butterfly: nếu là nhánh làm lệch canon, tăng dị số
    if (isLech && typeof root.driftAdd === 'function') {
      root.driftAdd(driftAmount || 6, chainId);
      storyAddJournal(`Quyết định lệch nguyên tác: thiên cơ xoay chuyển (${chainId} -> ${outcomeId})!`, 'warning', 'diso');
    }

    return { chainId, prev, current: outcomeId };
  }

  // Lấy kết quả của một chuỗi quyết định
  function storyGetOutcome(chainId) {
    if (!root.S || !root.S.story || !root.S.story.outcomes) return null;
    return root.S.story.outcomes[chainId] || null;
  }

  // Kiểm tra xem một chuỗi có đạt kết quả mong muốn không
  function storyHasOutcome(chainId, outcomeId) {
    return storyGetOutcome(chainId) === outcomeId;
  }

  // Lên lịch cho một hậu quả trong tương lai (pending event)
  function storySchedulePending(pendingDef) {
    if (!root.S) return false;
    initStoryState(root.S);
    if (!pendingDef || !pendingDef.id) return false;

    // Tránh trùng lặp ID pending
    const exists = root.S.story.pending.some(p => p.id === pendingDef.id);
    if (exists) return false;

    const item = {
      id: pendingDef.id,
      chainId: pendingDef.chainId || '',
      targetBook: pendingDef.targetBook || (root.S.book || 1),
      targetChap: pendingDef.targetChap || '',
      minTurn: pendingDef.minTurn || 0,
      maxTurn: pendingDef.maxTurn || 9999,
      condId: pendingDef.condId || null,
      eventId: pendingDef.eventId || null,
      payload: pendingDef.payload || null,
      status: 'pending',
      createdAt: root.S.tuan || 0
    };

    root.S.story.pending.push(item);
    return true;
  }

  // Quét và kích hoạt các hậu quả pending hợp lệ theo bối cảnh hiện tại
  function storyCheckPending(currentBook, currentChap, currentTurn) {
    if (!root.S || !root.S.story || !root.S.story.pending) return [];
    initStoryState(root.S);

    const book = currentBook !== undefined ? currentBook : (root.S.book || 1);
    const turn = currentTurn !== undefined ? currentTurn : (root.S.tuan || 0);
    const ready = [];
    const remaining = [];

    for (let i = 0; i < root.S.story.pending.length; i++) {
      const p = root.S.story.pending[i];
      if (p.status !== 'pending') continue;

      const bookMatch = !p.targetBook || p.targetBook === book;
      const chapMatch = !p.targetChap || p.targetChap === currentChap;
      const turnMatch = turn >= p.minTurn && turn <= p.maxTurn;

      if (bookMatch && chapMatch && turnMatch) {
        ready.push(p);
      } else if (turn <= p.maxTurn) {
        remaining.push(p);
      } else {
        // Đã quá hạn (expired)
        p.status = 'expired';
      }
    }

    root.S.story.pending = remaining;
    return ready;
  }

  // Ghi nhật ký nhân quả (Journal)
  function storyAddJournal(text, type, tag) {
    if (!root.S) return;
    initStoryState(root.S);
    const entry = {
      tuan: root.S.tuan || 0,
      book: root.S.book || 1,
      text: text || '',
      type: type || 'info', // 'decision', 'consequence', 'warning', 'info'
      tag: tag || 'chung',
      time: Date.now()
    };
    root.S.story.journal.push(entry);
    // Giới hạn 100 mục gần nhất tránh phình to save
    if (root.S.story.journal.length > 100) {
      root.S.story.journal.shift();
    }
  }

  // Hỗ trợ Xuân Thu Thiền quay ngược thời gian: xóa các hậu quả pending thuộc dòng thời gian bị hủy
  function storyResetTimeline(preserveOutcomes) {
    if (!root.S || !root.S.story) return;
    initStoryState(root.S);
    root.S.story.pending = [];
    if (!preserveOutcomes) {
      root.S.story.outcomes = {};
      root.S.story.applied = {};
    }
    storyAddJournal('Xuân Thu Thiền kích hoạt: dòng thời gian được đảo ngược!', 'warning', 'xuanthu');
  }

  // Xuất API ra global window hoặc module exports
  const StoryModule = {
    init: initStoryState,
    setOutcome: storySetOutcome,
    getOutcome: storyGetOutcome,
    hasOutcome: storyHasOutcome,
    schedulePending: storySchedulePending,
    checkPending: storyCheckPending,
    addJournal: storyAddJournal,
    resetTimeline: storyResetTimeline
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryModule;
  }
  root.Story = StoryModule;
  root.initStoryState = initStoryState;
  root.storySetOutcome = storySetOutcome;
  root.storyGetOutcome = storyGetOutcome;
  root.storyHasOutcome = storyHasOutcome;
  root.storySchedulePending = storySchedulePending;
  root.storyCheckPending = storyCheckPending;
  root.storyAddJournal = storyAddJournal;
  root.storyResetTimeline = storyResetTimeline;

})(typeof window !== 'undefined' ? window : global);
