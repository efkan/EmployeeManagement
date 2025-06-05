/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  nodeResolve: true,
  preserveSymlinks: false,
  // Enable history API fallback for client-side routing
  appIndex: 'index.html',
  port: 8000,
  plugins: [
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
  middleware: [
    function polyfillsMiddleware(context, next) {
      if (context.path === '/' || context.path.endsWith('.html')) {
        return next();
      }
      if (context.path.endsWith('.js')) {
        // Inject comprehensive polyfills for Node.js globals
        context.set('Content-Type', 'application/javascript');
        const originalBody = context.body || '';
        if (
          typeof originalBody === 'string' &&
          (originalBody.includes('process') || originalBody.includes('global'))
        ) {
          context.body = `
// Polyfills for Node.js globals in browser environment
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
  window.Buffer = { isBuffer: function() { return false; } };
}
${originalBody}`;
        }
      }
      return next();
    },
  ],
};
