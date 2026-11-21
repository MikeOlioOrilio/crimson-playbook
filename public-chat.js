/* A public-offerings guide only. No account context or browser storage is used. */
(() => {
  'use strict';
  if (document.getElementById('rk-public-guide')) return;

  const ENDPOINT = 'https://learn.realknowledgeonline.com/api/public-site-chat';
  const ALLOWED_LINK_HOSTS = new Set(['realknowledgeonline.com', 'www.realknowledgeonline.com', 'learn.realknowledgeonline.com']);
  const MAX_QUESTION_LENGTH = 1200;
  const REQUEST_TIMEOUT_MS = 60000;
  const conversation = [];
  let busy = false;
  let isOpen = false;
  let noticeTimer;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(paths) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    for (const shape of paths) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', shape);
      svg.append(path);
    }
    return svg;
  }

  const root = element('div', 'rk-guide');
  root.id = 'rk-public-guide';
  root.dataset.open = 'false';
  const launcher = element('button', 'rk-guide-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'rk-guide-panel');
  launcher.append(icon(['M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-4 3V11.5A7.5 7.5 0 0 1 9.5 4h3a7.5 7.5 0 0 1 7.5 7.5Z', 'M7 10h8M7 14h5']), element('span', '', 'Chat with Us'));

  const panel = element('section', 'rk-guide-panel');
  panel.id = 'rk-guide-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'rk-guide-title');
  const header = element('div', 'rk-guide-header');
  const logo = element('img');
  logo.src = 'assets/logo.jpg';
  logo.alt = '';
  logo.width = 36;
  logo.height = 36;
  const heading = element('div', 'rk-guide-heading');
  const title = element('h2', 'rk-guide-title', 'Real Knowledge Guide');
  title.id = 'rk-guide-title';
  title.tabIndex = -1;
  heading.append(title, element('p', 'rk-guide-subtitle', 'AI assistant · Public website help'));
  const close = element('button', 'rk-guide-icon-button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close chat');
  close.append(icon(['M6 6l12 12M18 6 6 18']));
  header.append(logo, heading, close);

  const log = element('div', 'rk-guide-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-label', 'Conversation with the Real Knowledge Guide');
  log.setAttribute('aria-live', 'polite');
  log.setAttribute('aria-relevant', 'additions');
  log.tabIndex = 0;
  const status = element('div', 'rk-guide-status');
  status.id = 'rk-guide-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const form = element('form', 'rk-guide-composer');
  const label = element('label', 'rk-guide-label', 'Your question');
  label.htmlFor = 'rk-guide-question';
  const inputRow = element('div', 'rk-guide-input-row');
  const input = element('textarea');
  input.id = 'rk-guide-question';
  input.name = 'question';
  input.rows = 2;
  input.maxLength = MAX_QUESTION_LENGTH;
  input.placeholder = 'What would you like to know?';
  input.setAttribute('aria-describedby', 'rk-guide-hint');
  input.autocomplete = 'off';
  const send = element('button', 'rk-guide-send', 'Send');
  send.type = 'submit';
  inputRow.append(input, send);
  const hint = element('p', 'rk-guide-hint');
  hint.id = 'rk-guide-hint';
  hint.append(document.createTextNode('Keep passwords, payment details, and private files out of chat. '));
  const privacy = element('a', 'rk-guide-privacy', 'Privacy');
  privacy.href = 'privacy.html#ai';
  hint.append(privacy);
  form.append(label, inputRow, hint);

  const footer = element('div', 'rk-guide-footer');
  const contact = element('a', 'rk-guide-contact', 'Contact Us');
  contact.href = 'https://learn.realknowledgeonline.com/contact/';
  const clear = element('button', 'rk-guide-clear', 'Clear conversation');
  clear.type = 'button';
  footer.append(contact, clear);
  panel.append(header, log, status, form, footer);
  root.append(panel, launcher);
  document.body.append(root);

  function scrollToLatest() {
    log.scrollTop = log.scrollHeight;
  }

  function message(role, text, isError = false) {
    const entry = element('div', `rk-guide-message rk-guide-message-${isError ? 'error' : role}`);
    entry.append(element('p', 'rk-guide-speaker', role === 'user' ? 'You' : 'Real Knowledge Guide'), element('p', 'rk-guide-message-text', text));
    log.append(entry);
    scrollToLatest();
    return entry;
  }

  function resetConversation() {
    conversation.length = 0;
    log.replaceChildren();
    const welcome = message('assistant', 'Ask about our training, certifications, company document services, or how to get started.');
    const suggestions = element('div', 'rk-guide-suggestions');
    const questions = [
      ['Prices & subscriptions', 'How do pricing and subscriptions work?'],
      ['Certification renewals', 'How do certification purchases and renewals work?'],
      ['Where to start', 'How do I choose where to start?'],
      ['Company document Q&A', 'How does Company Knowledge Q&A work?']
    ];
    for (const [text, question] of questions) {
      const chip = element('button', 'rk-guide-suggestion', text);
      chip.type = 'button';
      chip.addEventListener('click', () => {
        if (busy) return;
        input.value = question;
        submitQuestion(question);
      });
      suggestions.append(chip);
    }
    welcome.append(suggestions);
    input.value = '';
  }

  function setOpen(open) {
    isOpen = open;
    panel.hidden = !open;
    root.dataset.open = String(open);
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      updateViewport();
      const initialFocus = window.matchMedia('(pointer: coarse)').matches ? title : input;
      initialFocus.focus({preventScroll: true});
      scrollToLatest();
    } else {
      launcher.focus({preventScroll: true});
    }
  }

  function setBusy(value) {
    busy = value;
    send.disabled = value;
    send.textContent = value ? 'Wait…' : 'Send';
    clear.disabled = value;
    input.readOnly = value;
    form.setAttribute('aria-busy', String(value));
    for (const button of log.querySelectorAll('button')) button.disabled = value;
    window.clearTimeout(noticeTimer);
    status.dataset.busy = String(value);
    status.textContent = value ? 'Checking our public guide…' : '';
  }

  function safeLink(value) {
    if (typeof value !== 'string' || value.length > 1200) return null;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || !ALLOWED_LINK_HOSTS.has(url.hostname) || url.username || url.password || (url.port && url.port !== '443')) return null;
      return url.href;
    } catch (_) {
      return null;
    }
  }

  function addLinks(entry, links) {
    if (!Array.isArray(links)) return;
    const list = element('ul', 'rk-guide-links');
    const seen = new Set();
    for (const item of links.slice(0, 5)) {
      const href = safeLink(item && item.url);
      if (!href || typeof item.label !== 'string' || !item.label.trim() || seen.has(href)) continue;
      seen.add(href);
      const row = element('li');
      const link = element('a', '', item.label.trim().slice(0, 100));
      link.href = href;
      row.append(link);
      list.append(row);
    }
    if (list.children.length) entry.append(list);
    scrollToLatest();
  }

  async function requestAnswer(question, history, retryEntry) {
    setBusy(true);
    if (retryEntry) retryEntry.remove();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question, history}),
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(response.status === 429 ? 'The guide is receiving a lot of questions. Please try again later, or use Contact Us.' : 'The guide is temporarily unavailable. Please try again, or use Contact Us.');
        error.isPublicGuideError = true;
        throw error;
      }
      if (typeof payload.answer !== 'string' || !payload.answer.trim()) throw new Error('Invalid guide response');
      const answer = payload.answer.trim().slice(0, 10000);
      const entry = message('assistant', answer);
      addLinks(entry, payload.links);
      conversation.push({role: 'user', content: question}, {role: 'assistant', content: answer.slice(0, 1800)});
      // Only a short recent context stays in this page's memory.
      if (conversation.length > 4) conversation.splice(0, conversation.length - 4);
    } catch (error) {
      const text = error.name === 'AbortError'
        ? 'The guide is taking longer than expected. Please try again, or use Contact Us.'
        : error.isPublicGuideError
          ? error.message
          : 'We could not reach the guide. Please check your connection and try again, or use Contact Us.';
      const entry = message('assistant', text, true);
      const retry = element('button', 'rk-guide-retry', 'Try again');
      retry.type = 'button';
      retry.addEventListener('click', () => { if (!busy) requestAnswer(question, history, entry); });
      entry.append(retry);
      scrollToLatest();
    } finally {
      window.clearTimeout(timer);
      setBusy(false);
    }
  }

  function submitQuestion(question) {
    const trimmed = question.trim();
    if (busy || !trimmed) return;
    if (trimmed.length > MAX_QUESTION_LENGTH) {
      status.textContent = 'Please keep your question to 1,200 characters.';
      return;
    }
    const history = conversation.slice(-4).map(item => ({role: item.role, content: item.content}));
    message('user', trimmed);
    input.value = '';
    requestAnswer(trimmed, history);
  }

  // Account for the mobile on-screen keyboard without covering the composer.
  function updateViewport() {
    const viewport = window.visualViewport;
    const height = viewport ? viewport.height : window.innerHeight;
    const keyboard = viewport ? Math.max(0, window.innerHeight - height - viewport.offsetTop) : 0;
    root.style.setProperty('--rk-guide-height', `${Math.floor(height)}px`);
    root.style.setProperty('--rk-guide-keyboard', `${Math.floor(keyboard)}px`);
    root.dataset.compact = String(height < 520);
  }

  launcher.addEventListener('click', () => setOpen(!isOpen));
  close.addEventListener('click', () => setOpen(false));
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    submitQuestion(input.value);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      submitQuestion(input.value);
    }
  });
  clear.addEventListener('click', () => {
    if (busy) return;
    resetConversation();
    status.textContent = 'Conversation cleared.';
    noticeTimer = window.setTimeout(() => { if (!busy) status.textContent = ''; }, 2500);
    input.focus({preventScroll: true});
  });
  window.addEventListener('resize', updateViewport, {passive: true});
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateViewport, {passive: true});
    window.visualViewport.addEventListener('scroll', updateViewport, {passive: true});
  }
  resetConversation();
  updateViewport();
})();
