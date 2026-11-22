const login = document.querySelector('.nav-login');
if (login) {
  const learnerOrigin = 'https://learn.realknowledgeonline.com';
  const dashboardUrl = learnerOrigin + '/learner/';
  const channel = 'rk-learner-session';
  const dashboard = document.createElement('a');
  dashboard.className = 'nav-dashboard';
  dashboard.href = dashboardUrl;
  dashboard.textContent = 'My Dashboard';
  dashboard.hidden = true;
  login.before(dashboard);
  const frame = document.createElement('iframe');
  frame.title = 'Real Knowledge sign-in status';
  frame.hidden = true;
  frame.tabIndex = -1;
  frame.src = learnerOrigin + '/session/?v=2&parent=' + encodeURIComponent(location.origin);
  let signedIn = false;
  let signingOut = false;
  let timeout;
  const status = document.createElement('span');
  status.className = 'account-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  login.after(status);

  const request = type => frame.contentWindow?.postMessage({channel, type}, learnerOrigin);
  function render(active) {
    signedIn = active;
    signingOut = false;
    clearTimeout(timeout);
    dashboard.hidden = !active;
    login.textContent = active ? 'Sign Out' : 'Login';
    login.href = dashboardUrl;
    login.removeAttribute('aria-disabled');
    login.dataset.rkLoading = 'false';
    if (!active) status.textContent = '';
  }

  window.addEventListener('message', event => {
    if (event.origin !== learnerOrigin || event.source !== frame.contentWindow || event.data?.channel !== channel) return;
    if (event.data.type === 'status' && typeof event.data.signedIn === 'boolean') render(event.data.signedIn);
    if (event.data.type === 'sign-out-error') {
      render(signedIn);
      status.textContent = 'Open My Dashboard to finish signing out.';
    }
  });
  login.addEventListener('click', event => {
    if (!signedIn) return;
    event.preventDefault();
    if (signingOut) return;
    signingOut = true;
    login.setAttribute('aria-disabled', 'true');
    login.textContent = 'Signing out…';
    login.dataset.rkLoading = 'true';
    status.textContent = '';
    request('sign-out');
    timeout = setTimeout(() => {
      render(signedIn);
      status.textContent = 'Open My Dashboard to finish signing out.';
    }, 15000);
  });
  frame.addEventListener('load', () => request('status'));
  window.addEventListener('pageshow', () => request('status'));
  window.addEventListener('focus', () => request('status'));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') request('status');
  });
  document.body.append(frame);
}
