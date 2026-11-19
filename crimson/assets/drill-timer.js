const drillSeconds = 7 * 60;

export function addDrillTimer(printButton) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./drill-timer.css', import.meta.url);
  document.head.append(stylesheet);

  const start = document.createElement('button');
  start.type = 'button';
  start.textContent = 'Start Drill';
  start.setAttribute('aria-haspopup', 'dialog');
  const actions = document.createElement('span');
  actions.className = 'drill-timer-actions';
  printButton.before(actions);
  actions.append(start, printButton);

  const dialog = document.createElement('dialog');
  dialog.className = 'drill-timer-dialog';
  dialog.setAttribute('aria-labelledby', 'drill-timer-title');
  dialog.innerHTML = `
    <div class="drill-timer-header">
      <h2 id="drill-timer-title">Drill timer</h2>
      <form method="dialog"><button type="submit" autofocus>Close timer</button></form>
    </div>
    <iframe title="Drill countdown" tabindex="-1"></iframe>
    <p class="drill-timer-status" role="status"></p>
  `;
  const frame = dialog.querySelector('iframe');
  const status = dialog.querySelector('[role="status"]');
  printButton.closest('main').append(dialog);

  let drill = null;
  let audio = null;
  let seconds = drillSeconds;

  function drawClock() {
    const clock = frame.contentDocument?.getElementById('drill-clock');
    if (!clock) return;
    const minutes = Math.floor(seconds / 60);
    const remainder = String(seconds % 60).padStart(2, '0');
    clock.value = `${minutes}:${remainder}`;
    clock.toggleAttribute('data-finished', seconds === 0);
  }

  function unlockAudio() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      audio ??= new Audio();
      audio.resume().catch(() => {});
    } catch {
      // The visual countdown remains available when audio is blocked.
    }
  }

  async function buzz(current) {
    if (!audio) return;
    try {
      if (audio.state !== 'running') await audio.resume();
      if (drill !== current || !dialog.open) return;
      const tone = audio.createOscillator();
      const volume = audio.createGain();
      tone.type = 'sawtooth';
      tone.frequency.value = 185;
      tone.connect(volume).connect(audio.destination);
      const now = audio.currentTime;
      for (const delay of [0, .4]) {
        const pulse = now + delay;
        volume.gain.setValueAtTime(0, pulse);
        volume.gain.linearRampToValueAtTime(.22, pulse + .02);
        volume.gain.setValueAtTime(.22, pulse + .25);
        volume.gain.linearRampToValueAtTime(0, pulse + .32);
      }
      tone.onended = () => {
        tone.disconnect();
        volume.disconnect();
      };
      tone.start(now);
      tone.stop(now + .72);
    } catch {
      // Leave the finished state visible if the browser cannot play sound.
    }
  }

  function releaseScreen(current) {
    if (!current.screenLock?.released) current.screenLock?.release().catch(() => {});
  }

  async function keepScreenOn(current) {
    if (!navigator.wakeLock || document.hidden || current.lockPending ||
        (current.screenLock && !current.screenLock.released)) return;
    current.lockPending = true;
    try {
      const lock = await navigator.wakeLock.request('screen');
      current.screenLock = lock;
      if (drill !== current || current.finished) releaseScreen(current);
    } catch {
      // The OS can refuse or revoke a wake lock. Time still follows the deadline.
    } finally {
      current.lockPending = false;
    }
  }

  function refresh() {
    if (!drill || drill.finished) return;
    clearTimeout(drill.tick);
    const remaining = Math.max(0, drill.end - Date.now());
    seconds = Math.ceil(remaining / 1000);
    drawClock();
    if (remaining > 0) {
      drill.tick = setTimeout(refresh, remaining % 1000 || 1000);
      return;
    }
    drill.finished = true;
    releaseScreen(drill);
    status.textContent = 'Time’s up';
    void buzz(drill);
  }

  function stop() {
    if (!drill) return;
    clearTimeout(drill.tick);
    releaseScreen(drill);
    drill = null;
  }

  frame.addEventListener('load', drawClock);
  start.addEventListener('click', () => {
    unlockAudio();
    stop();
    status.textContent = '';
    drill = {end: Date.now() + drillSeconds * 1000};
    if (!frame.hasAttribute('src')) frame.src = new URL('./drill-timer.html', import.meta.url);
    dialog.showModal();
    refresh();
    void keepScreenOn(drill);
  });
  dialog.addEventListener('close', () => {
    if (!dialog.open) stop();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    refresh();
    if (drill && !drill.finished) void keepScreenOn(drill);
  });
  window.addEventListener('pagehide', () => {
    stop();
    dialog.close();
  });
}
