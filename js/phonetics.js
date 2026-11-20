/* Azulejo — a light European Portuguese pronunciation guide.
   This is a readable respelling, not a narrow IPA transcription. */
(function () {
  'use strict';

  function respell(raw) {
    let s = String(raw || '').toLowerCase().trim();
    if (!s) return '';
    s = s.replace(/[.,!?;:«»"']/g, '');
    s = s.replace(/ch/g, 'sh')
      .replace(/lh/g, 'ly')
      .replace(/nh/g, 'ny')
      .replace(/rr/g, 'R')
      .replace(/ss/g, 's')
      .replace(/qu(?=[ei])/g, 'k')
      .replace(/gu(?=[ei])/g, 'g')
      .replace(/c(?=[ei])/g, 's')
      .replace(/g(?=[ei])/g, 'zh')
      .replace(/x/g, 'sh')
      .replace(/z$/g, 'sh')
      .replace(/s$/g, 'sh')
      .replace(/ão/g, 'owng')
      .replace(/ãe/g, 'uyng')
      .replace(/õe/g, 'oyng')
      .replace(/á/g, 'AH')
      .replace(/é/g, 'EH')
      .replace(/í/g, 'EE')
      .replace(/ó/g, 'OH')
      .replace(/ú/g, 'OO')
      .replace(/â/g, 'AH')
      .replace(/ê/g, 'EH')
      .replace(/ô/g, 'OH')
      .replace(/à/g, 'AH')
      .replace(/a/g, 'ah')
      .replace(/e/g, 'eh')
      .replace(/i/g, 'ee')
      .replace(/o/g, 'oh')
      .replace(/u/g, 'oo')
      .replace(/R/g, 'H');
    // A light stress cue: uppercase the last strong vowel group.
    const groups = s.split(/(?=[aeiouy])/);
    if (groups.length > 1) {
      const at = Math.max(0, groups.length - 2);
      groups[at] = groups[at].toUpperCase();
    }
    return groups.join('').replace(/--+/g, '-');
  }

  window.AZ_PHONETIC = respell;
})();
