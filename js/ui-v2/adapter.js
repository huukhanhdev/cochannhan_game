// Presentation adapter. Reads a mock (later: S) and never awards, spends, or rolls.
(function (root) {
  function getPresentationState(source) {
    if (!source) return null;
    return {
      id: source.id,
      modeHint: 'journey',
      theme: source.theme,
      book: source.book,
      chapter: source.chapter,
      chapterName: source.chapterName,
      title: source.title,
      sub: source.sub,
      mapArt: source.mapArt,
      mapFocus: source.mapFocus,
      hero: { ...source.hero },
      pending: { ...source.pending },
      locations: (source.locations || []).map((l) => ({ ...l })),
      narrative: source.narrative
        ? {
            ...source.narrative,
            lines: source.narrative.lines.slice(),
            choices: source.narrative.choices.map((c) => ({ ...c }))
          }
        : null,
      combat: source.combat
        ? { ...source.combat, skills: source.combat.skills.map((s) => ({ ...s })) }
        : null,
      inventory: (source.inventory || []).map((g) => ({ ...g })),
      people: (source.people || []).map((p) => ({ ...p })),
      karma: (source.karma || []).map((k) => ({ ...k })),
      receipt: source.receipt ? { ...source.receipt } : null
    };
  }

  root.UI_V2_PRESENT = { getPresentationState };
})(window);
