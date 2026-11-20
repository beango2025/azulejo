/* Azulejo — optional Supabase account + progress sync (no SDK). */
(function () {
  'use strict';

  const SESSION_KEY = 'azulejo.cloud.session';
  const TABLE = 'azulejo_progress';
  let pushTimer = null;

  function config() {
    return window.AZ_CONFIG || {};
  }

  function configured() {
    const c = config();
    return Boolean(c.supabaseUrl && c.supabaseAnonKey && /^https:\/\//.test(c.supabaseUrl));
  }

  function session() {
    if (!configured()) return null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveSession(value) {
    if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else localStorage.removeItem(SESSION_KEY);
  }

  function endpoint(path) {
    return `${String(config().supabaseUrl).replace(/\/$/, '')}${path}`;
  }

  function headers(token) {
    return {
      apikey: config().supabaseAnonKey,
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {})
    };
  }

  async function authRequest(path, body) {
    const response = await fetch(endpoint(path), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body || {})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error_description || data.msg || data.message || `Auth ${response.status}`);
    return data;
  }

  function normaliseAuth(data) {
    if (!data || !data.access_token || !data.user) return null;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + Number(data.expires_in || 3600) * 1000,
      user: { id: data.user.id, email: data.user.email }
    };
  }

  async function signUp(email, password) {
    if (!configured()) throw new Error('Supabase não configurado.');
    const data = await authRequest('/auth/v1/signup', { email, password });
    const auth = normaliseAuth(data);
    if (auth) saveSession(auth);
    return { auth, needsConfirmation: !auth };
  }

  async function signIn(email, password) {
    if (!configured()) throw new Error('Supabase não configurado.');
    const data = await authRequest('/auth/v1/token?grant_type=password', { email, password });
    const auth = normaliseAuth(data);
    if (!auth) throw new Error('Resposta de autenticação inválida.');
    saveSession(auth);
    return auth;
  }

  async function refresh() {
    const current = session();
    if (!current || !current.refresh_token) return null;
    const data = await authRequest('/auth/v1/token?grant_type=refresh_token', { refresh_token: current.refresh_token });
    const auth = normaliseAuth(data);
    if (auth) saveSession(auth);
    return auth;
  }

  async function validSession() {
    const current = session();
    if (!current) return null;
    if (Number(current.expires_at) > Date.now() + 30000) return current;
    return refresh();
  }

  async function request(path, options = {}, retried = false) {
    const current = await validSession();
    if (!current) throw new Error('Precisas de iniciar sessão.');
    const response = await fetch(endpoint(path), {
      ...options,
      headers: { ...headers(current.access_token), ...(options.headers || {}) }
    });
    if (response.status === 401 && !retried) {
      const refreshed = await refresh();
      if (refreshed) return request(path, options, true);
    }
    if (response.status === 406) return null;
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || data.hint || `Sync ${response.status}`);
    }
    return response.status === 204 ? null : response.json().catch(() => null);
  }

  async function pull() {
    const current = await validSession();
    if (!current) throw new Error('Precisas de iniciar sessão.');
    const rows = await request(`/rest/v1/${TABLE}?user_id=eq.${encodeURIComponent(current.user.id)}&select=state,updated_at`, {
      headers: { accept: 'application/vnd.pgrst.object+json' }
    });
    if (!rows) return null;
    return { state: rows.state, updatedAt: rows.updated_at };
  }

  async function push(state) {
    const current = await validSession();
    if (!current) return { skipped: true };
    await request(`/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: { prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        user_id: current.user.id,
        state,
        updated_at: new Date().toISOString()
      })
    });
    return { ok: true };
  }

  function schedulePush(state) {
    if (!session()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      push(state).catch(error => console.warn('Cloud sync failed.', error.message));
    }, 1800);
  }

  function signOut() {
    clearTimeout(pushTimer);
    saveSession(null);
  }

  window.AZ_CLOUD = {
    configured,
    session,
    signUp,
    signIn,
    signOut,
    pull,
    push,
    schedulePush
  };
})();
