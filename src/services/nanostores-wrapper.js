/**
 * Nanostores wrapper with browser polyfills
 * This module ensures Node.js globals are available before importing nanostores
 */

// Ensure critical polyfills are available
if (typeof global === 'undefined') {
  window.global = window.globalThis || window;
}

if (typeof process === 'undefined') {
  window.process = {
    env: {},
    browser: true,
    version: '16.0.0',
    platform: 'browser',
    argv: [],
    cwd: function() { return '/'; },
    nextTick: function(callback) {
      setTimeout(callback, 0);
    },
    stdout: { write: function() {} },
    stderr: { write: function() {} }
  };
}

if (typeof Buffer === 'undefined') {
  window.Buffer = {
    isBuffer: function() { return false; },
    from: function() { return new Uint8Array(); }
  };
}

// Now safely import nanostores
export { atom, map, computed } from 'nanostores';