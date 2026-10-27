import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function compile(file) {
  return ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
}

test('development and production have separate Next.js output folders', () => {
  const exports = {};
  vm.runInNewContext(compile('../next.config.ts'), { exports, require });
  const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
    PHASE_PRODUCTION_SERVER,
  } = require('next/constants');
  assert.equal(exports.default(PHASE_DEVELOPMENT_SERVER).distDir, '.next-dev');
  assert.equal(exports.default(PHASE_PRODUCTION_BUILD).distDir, '.next');
  assert.equal(exports.default(PHASE_PRODUCTION_SERVER).distDir, '.next');
});

async function exercise(mode, scriptURL = 'http://localhost:3000/service-worker.js') {
  const calls = { registered: [], deleted: [], unregistered: 0, reloaded: 0 };
  let effect;
  const exports = {};
  const cache = {
    keys: async () => ['FFCS-CodeChefVIT_v1.1.1', 'unrelated-cache'],
    delete: async key => {
      calls.deleted.push(key);
      return true;
    },
  };
  const worker = { scriptURL };
  const serviceWorker = {
    controller: worker,
    getRegistration: async () => ({
      active: worker,
      unregister: async () => {
        calls.unregistered++;
        return true;
      },
    }),
    register: async url => {
      calls.registered.push(url);
    },
  };
  vm.runInNewContext(compile('../src/components/ServiceWorkerRegister/ServiceWorkerRegister.tsx'), {
    exports,
    URL,
    process: { env: { NODE_ENV: mode } },
    navigator: { serviceWorker },
    caches: cache,
    window: {
      caches: cache,
      location: {
        origin: 'http://localhost:3000',
        reload: () => {
          calls.reloaded++;
        },
      },
    },
    require: name => {
      assert.equal(name, 'react');
      return {
        useEffect: fn => {
          effect = fn;
        },
      };
    },
  });
  exports.default();
  effect();
  await new Promise(resolve => setImmediate(resolve));
  return calls;
}

test('development removes only the app offline cache and reloads after unregistering its controller', async () => {
  const calls = await exercise('development');
  assert.deepEqual(calls.registered, []);
  assert.deepEqual(calls.deleted, ['FFCS-CodeChefVIT_v1.1.1']);
  assert.equal(calls.unregistered, 1);
  assert.equal(calls.reloaded, 1);
});

test('development preserves unrelated service-worker registrations', async () => {
  const calls = await exercise('development', 'http://localhost:3000/unrelated-worker.js');
  assert.equal(calls.unregistered, 0);
  assert.equal(calls.reloaded, 0);
});

test('production continues registering the offline worker', async () => {
  const calls = await exercise('production');
  assert.deepEqual(calls.registered, ['/service-worker.js']);
  assert.deepEqual(calls.deleted, []);
  assert.equal(calls.unregistered, 0);
  assert.equal(calls.reloaded, 0);
});
