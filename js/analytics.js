/* Azulejo — lightweight product analytics (local + optional endpoint). */
(function () {
  'use strict';
  const KEY = 'azulejo.events';
  const LIMIT = 250;

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function track(event, props) {
    const entry = {
      event,
      props: props || {},
      at: new Date().toISOString(),
      path: location.hash || '#/learn'
    };
    try {
      const events = read();
      events.push(entry);
      localStorage.setItem(KEY, JSON.stringify(events.slice(-LIMIT)));
    } catch {
      /* storage full or private mode */
    }
    const endpoint = window.AZ_CONFIG && window.AZ_CONFIG.analyticsEndpoint;
    if (endpoint && navigator.sendBeacon) {
      try {
        navigator.sendBeacon(endpoint, JSON.stringify(entry));
      } catch {
        /* analytics must never break the app */
      }
    }
  }

  window.AZ_TRACK = track;
  window.AZ_EVENTS = read;
})();
