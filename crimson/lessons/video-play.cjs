function videoPlayBody(play, category, escape) {
  const title = escape(play.title);
  const watchUrl = `https://www.youtube.com/watch?v=${play.youtubeId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${play.youtubeId}?playsinline=1`;
  return `
<section id="play-access-status" class="page access-status" role="status">
  <p>Loading this play…</p><noscript>Enable JavaScript to load your team’s playbook.</noscript>
</section>
<main class="page" id="main" hidden>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="../index.html">Playbook</a><span>/</span>
    <a href="../index.html#${play.category}">${escape(category)}</a><span>/</span><span>${title}</span>
  </nav>
  <header class="play-heading">
    <div>
      <div class="eyebrow">${escape(category)} / ${escape(play.level)}</div>
      <h1>${title}</h1>
      <p>${escape(play.description)}</p>
    </div>
    <div class="actions"><button type="button" data-print-video-lesson>Print lesson</button></div>
  </header>
  <div class="board-layout">
    <section class="board-panel" aria-labelledby="video-heading">
      <div class="board-top">
        <h2 id="video-heading">Drill demonstration</h2>
        <p class="video-credit">FIBA Basketball</p>
      </div>
      <div data-coach-video hidden></div>
      <template id="coach-video">
        <iframe class="video-player" src="${embedUrl}" title="FIBA Basketball — ${title}"
          referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen></iframe>
      </template>
      <div class="video-actions">
        <a class="button" href="${watchUrl}" target="_blank" rel="noopener">Watch on YouTube ↗</a>
      </div>
    </section>
    <aside class="coach-panel" aria-label="Coaching notes">
      <section class="info-panel"><h2>Set it up</h2><p>${escape(play.setup)}</p></section>
      <section class="info-panel"><h2>Coaching cues</h2>
        <ol>${play.cues.map(cue => `<li>${escape(cue)}</li>`).join('')}</ol>
      </section>
      <section class="info-panel">
        <h2>Run it at practice</h2><p>${escape(play.practice)}</p>
        <a class="video-related" href="../defensive-stance/index.html">On-ball defense fundamentals →</a>
      </section>
    </aside>
  </div>
  <nav class="next-prev" aria-label="More plays"></nav>
</main>`;
}

module.exports = videoPlayBody;
