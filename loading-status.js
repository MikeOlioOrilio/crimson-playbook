/* Shared visual feedback. No requests, timers, or changes to account/access state. */
(() => {
  'use strict';
  if (window.RKLoading) return;

  const ignored = 'script,style,template,noscript,svg,textarea,input,select,option,pre,code,' +
    '[contenteditable]:not([contenteditable="false"]),[role="log"],.rk-guide,.resource-chat-state,[data-rk-loading-ignore]';
  const beginning = /^(?:(?:file uploaded|scanned pages read)\.\s*)?(?:loading|checking|confirming|verifying|signing (?:in|out)|saving|sending|preparing|processing|connecting|creating|generating|reading|updating|opening|reviewing|finding|comparing|weighing|looking|scoring|grading|uploading|assigning|requesting|posting|cancelling|canceling|reconnecting|resetting|resuming|calculating|starting|adding|publishing|refreshing|removing|scheduling|submitting|filtering|granting|keeping|discarding|copying|working|wait|waiting to (?:reconnect|prepare))\b/i;
  const ending = /(?:\u2026|\.{3})$/;
  const stopped = /\b(?:failed|paused|canceled|cancelled|expired|unavailable|unable|cannot|could not|timed out)\b/i;

  function automatic(element) {
    // Only decorate a short message, never a container of lessons, answers, or controls.
    if (element.childElementCount || !element.textContent) return false;
    const text = element.textContent.trim();
    return text.length <= 300 && beginning.test(text) && ending.test(text) && !stopped.test(text);
  }

  function update(element) {
    if (!(element instanceof HTMLElement)) return;
    const explicit = element.getAttribute('data-rk-loading');
    const busy = !element.closest(ignored) &&
      (explicit === 'true' || explicit !== 'false' && automatic(element));
    element.classList.toggle('rk-is-loading', busy);
  }

  function scan(root) {
    if (root.nodeType === Node.TEXT_NODE) root = root.parentElement;
    if (!(root instanceof HTMLElement) || !root.isConnected || root.closest(ignored)) return;
    update(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode(element) {
        if (element.matches(ignored)) return NodeFilter.FILTER_REJECT;
        update(element);
        return NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) { /* Work is done by the filter, which skips ignored subtrees. */ }
  }

  const pending = new Set();
  let queued = false;
  function queue(root) {
    if (root.nodeType === Node.TEXT_NODE) root = root.parentElement;
    if (!(root instanceof HTMLElement)) return;
    pending.add(root);
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      const roots = new Set(pending);
      pending.clear();
      for (const item of roots) {
        // A larger changed fragment already includes its children.
        let parent = item.parentElement;
        while (parent && !roots.has(parent)) parent = parent.parentElement;
        if (!parent) scan(item);
      }
    });
  }

  window.RKLoading = Object.freeze({
    setBusy(element, busy) {
      if (!(element instanceof HTMLElement)) return;
      if (typeof busy === 'boolean') element.setAttribute('data-rk-loading', String(busy));
      else element.removeAttribute('data-rk-loading');
      update(element);
    },
    refresh: queue
  });

  function start() {
    scan(document.body);
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'childList') {
          queue(record.target);
          for (const added of record.addedNodes) queue(added);
        } else queue(record.target);
      }
    }).observe(document.body, {
      subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ['data-rk-loading', 'data-rk-loading-ignore']
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
