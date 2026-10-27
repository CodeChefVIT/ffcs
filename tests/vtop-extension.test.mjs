import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sample = (id = 'a'.repeat(64)) => ({
  schemaVersion: 1,
  source: 'vtop',
  catalogueId: id,
  capturedAt: '2026-10-27T10:00:00.000Z',
  term: 'Winter 2026',
  categories: {
    'Core (PCC)': {
      'BACSE291 - Innovative Design Project': [{ slot: 'NIL', venue: 'NIL', faculty: 'ACADEMICS' }],
      'BCSE202L - Data Structures': [{ slot: 'B1+TB1', venue: 'SJT522', faculty: 'TEST FACULTY' }],
      'BCSE202P - Data Structures Lab': [
        { slot: 'L43+L44', venue: 'SJT318', faculty: 'TEST FACULTY' },
      ],
    },
  },
});
const serial = value => JSON.parse(JSON.stringify(value));
function worker() {
  const local = {},
    session = {};
  const storage = state => ({
    setAccessLevel: async () => {},
    get: async keys =>
      Object.fromEntries((Array.isArray(keys) ? keys : [keys]).map(key => [key, state[key]])),
    set: async values => Object.assign(state, serial(values)),
    remove: async keys => (Array.isArray(keys) ? keys : [keys]).forEach(key => delete state[key]),
  });
  let listener;
  const sandbox = vm.createContext({
    URL,
    crypto: webcrypto,
    console,
    chrome: {
      runtime: {
        id: 'extension-id',
        getURL: file => `chrome-extension://extension-id/${file}`,
        onMessage: {
          addListener: fn => {
            listener = fn;
          },
        },
      },
      storage: { local: storage(local), session: storage(session) },
    },
    importScripts: file => vm.runInContext(read(`extension/${file}`), sandbox),
  });
  vm.runInContext(read('extension/background.js'), sandbox);
  const send = (type, fields = {}, sender = {}) =>
    new Promise(resolve =>
      listener(
        { type, ...fields },
        {
          id: 'extension-id',
          url: 'https://vtop.vit.ac.in/vtop/content',
          frameId: 0,
          tab: { id: 1 },
          ...sender,
        },
        value => resolve(serial(value))
      )
    );
  return { send, local, session };
}
const app = { url: 'http://localhost:3000/' };
test('storage: capture, local read, failed refresh, account replacement, and deletion', async () => {
  const { send, local } = worker();
  const first = await send('VTOP_BEGIN', { contextKey: 'a'.repeat(64) });
  assert.equal(first.ok, true);
  const locked = await send('VTOP_BEGIN', { contextKey: 'b'.repeat(64) }, { tab: { id: 2 } });
  assert.equal(locked.ok, false);
  assert.equal((await send('VTOP_COMMIT', { runId: first.runId, dataset: sample() })).ok, true);
  assert.deepEqual((await send('GET_DATA', {}, app)).dataset, sample());
  const refresh = await send('VTOP_BEGIN', { contextKey: 'a'.repeat(64) });
  await send('VTOP_FAIL', { runId: refresh.runId, error: 'Session expired' });
  assert.deepEqual(local.dataset, sample());
  assert.equal((await send('GET_STATUS', {}, app)).error, 'Session expired');
  const second = await send('VTOP_BEGIN', { contextKey: 'b'.repeat(64) });
  assert.equal((await send('GET_DATA', {}, app)).dataset, null);
  assert.equal(
    (await send('VTOP_COMMIT', { runId: second.runId, dataset: sample('a'.repeat(64)) })).ok,
    false
  );
  assert.equal(
    (await send('VTOP_COMMIT', { runId: second.runId, dataset: sample('b'.repeat(64)) })).ok,
    true
  );
  await send('CLEAR_DATA', {}, app);
  assert.equal((await send('GET_DATA', {}, app)).dataset, null);
  assert.equal((await send('VTOP_COMMIT', { runId: second.runId, dataset: sample() })).ok, false);
});
test('messaging: reject other origins, other extensions, subframes, and write attempts from the app', async () => {
  const { send } = worker();
  for (const sender of [
    { url: 'https://example.com/' },
    { url: 'https://ffcs.codechefvit.com.evil.test/' },
    { id: 'another-extension' },
    { frameId: 1 },
    { url: 'https://vtop.vit.ac.in/unrelated' },
  ]) {
    assert.equal((await send('GET_STATUS', {}, sender)).ok, false);
  }
  assert.equal((await send('GET_DATA')).ok, false);
  assert.equal((await send('VTOP_BEGIN', { contextKey: 'a'.repeat(64) }, app)).ok, false);
  assert.equal((await send('GET_STATUS', {}, { url: 'https://ffcs.codechefvit.com/' })).ok, true);
});
function loadTs(file) {
  const exports = {};
  const code = ts.transpileModule(read(file), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: name => loadTs(path.posix.join(path.posix.dirname(file), `${name}.ts`)),
  });
  return exports;
}
test('app boundary: reject bad slots and strip fields outside the course schema', () => {
  const { parseVtopCatalogue } = loadTs('src/lib/vtopCatalogue.ts');
  const value = sample();
  value.cookies = 'must-not-be-copied';
  value.categories['Core (PCC)']['BCSE202L - Data Structures'][0].csrf = 'must-not-be-copied';
  assert.deepEqual(serial(parseVtopCatalogue(value)), sample());
  value.categories['Core (PCC)']['BCSE202L - Data Structures'][0].slot = 'not-a-slot';
  assert.throws(() => parseVtopCatalogue(value), /slots/);
  assert.throws(() => parseVtopCatalogue({ ...sample(), categories: {} }), /categories/);
});

const browserPath =
  process.env.FFCS_TEST_BROWSER ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
  ].find(file => fs.existsSync(file));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function openBrowser(t) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ffcs-vtop-test-'));
  const process = spawn(
    browserPath,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-sync',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' }
  );
  t.after(async () => {
    process.kill();
    await delay(500);
    // The only recursive removal target is this test's randomly allocated temp profile.
    const target = path.resolve(profile),
      parent = path.resolve(os.tmpdir());
    if (path.dirname(target) === parent && path.basename(target).startsWith('ffcs-vtop-test-')) {
      fs.rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
  });
  let port;
  for (let i = 0; i < 200; i++) {
    try {
      port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
      break;
    } catch {
      await delay(50);
    }
  }
  assert.ok(port, 'headless browser started');
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  t.after(() => socket.close());
  let id = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const value = JSON.parse(event.data);
    if (pending.has(value.id)) {
      pending.get(value.id)(value);
      pending.delete(value.id);
    }
  };
  const call = (method, params = {}) =>
    new Promise(resolve => {
      const next = ++id;
      pending.set(next, resolve);
      socket.send(JSON.stringify({ id: next, method, params }));
    });
  return Object.assign(
    async expression => {
      const response = await call('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      assert.ok(
        !response.result?.exceptionDetails,
        JSON.stringify(response.result?.exceptionDetails)
      );
      return response.result.result.value;
    },
    { cdp: call }
  );
}
test(
  'real browser DOM: parse dropdowns, labelled and legacy tables; capture only current account categories',
  { skip: !browserPath, timeout: 30000 },
  async t => {
    const evaluate = await openBrowser(t);
    await evaluate(read('extension/parser.js'));
    const parsed = await evaluate(`(() => {
    const doc = html => new DOMParser().parseFromString(html, 'text/html');
    const p = FFCSVtopParser;
    return {
      courses: p.courses(doc('<select><option value="">Select</option><option value="BCSE202L">BCSE202L - Data Structures</option><option value="BCSE202L">BCSE202L - Data Structures</option><option disabled value="BMAT101L">Unavailable</option></select>')),
      labelled: p.sections(doc('<table><tr><th>S.No</th><th>Faculty Name</th><th>Slot</th><th>Venue</th></tr><tr><td>1</td><td> Test Faculty </td><td> B1 + TB1 </td><td>SJT522</td></tr><tr><td>2</td><td>Test Faculty</td><td>B1+TB1</td><td>SJT522</td></tr></table>')),
      legacy: p.sections(doc('<table><tr><td>L43+L44</td><td>SJT318</td><td>Test Faculty</td><td>60</td></tr><tr><td>garbage</td><td>secret</td><td>ignore</td><td>0</td></tr></table>')),
    };
  })()`);
    assert.deepEqual(parsed.courses, [{ code: 'BCSE202L', name: 'BCSE202L - Data Structures' }]);
    assert.deepEqual(parsed.labelled, [
      { slot: 'B1+TB1', faculty: 'Test Faculty', venue: 'SJT522' },
    ]);
    assert.deepEqual(parsed.legacy, [
      { slot: 'L43+L44', faculty: 'Test Faculty', venue: 'SJT318' },
    ]);
    // Exercise the actual content script against private-page-shaped HTML, without contacting VTOP.
    await evaluate(`(() => {
    document.body.innerHTML = '<input name="_csrf" value="transient-token"><input id="authorizedID" value="CURRENT-ACCOUNT"><select id="semesterSubId" name="semesterSubId"><option value="TERM1">Current Term</option></select><select id="cccategory"><option value="">Select</option><option value="PCC">Core</option><option disabled value="OTHER">Other branch</option></select>';
    window.calls = []; window.saved = null; window.failure = null;
    Object.defineProperty(window, 'crypto', { value: { subtle: { digest: async () => new Uint8Array(32).fill(10).buffer } } });
    window.chrome = { runtime: {
      onMessage: { addListener: fn => { window.captureListener = fn; } },
      sendMessage: async message => {
        if (message.type === 'VTOP_BEGIN') return { ok: true, runId: 'test-run' };
        if (message.type === 'VTOP_COMMIT') window.saved = message.dataset;
        if (message.type === 'VTOP_FAIL') window.failure = message.error;
        return { ok: true };
      }
    } };
    window.fetch = async (url, options) => {
      calls.push({ url, body: Object.fromEntries(options.body), credentials: options.credentials });
      const html = url.includes('getCoursesList')
        ? '<select><option value="BCSE202L">BCSE202L - Data Structures</option></select>'
        : '<table><tr><th>Slot</th><th>Venue</th><th>Faculty</th><th>Seats</th></tr><tr><td>B1+TB1</td><td>SJT522</td><td>Test Faculty</td><td>60</td></tr></table>';
      return { ok: true, text: async () => html };
    };
  })()`);
    await evaluate(read('extension/vtop.js'));
    const result = await evaluate(`new Promise((resolve, reject) => {
    let tries = 0;
    const timer = setInterval(() => {
      if (window.saved || window.failure) { clearInterval(timer); resolve({ saved, failure, calls }); }
      if (++tries > 100) { clearInterval(timer); reject(new Error('capture timed out')); }
    }, 50);
  })`);
    assert.equal(result.failure, null);
    assert.equal(result.calls.length, 2);
    assert.equal(result.calls[0].body.cccategory, 'PCC');
    assert.ok(
      result.calls.every(
        call => call.body.authorizedID === 'CURRENT-ACCOUNT' && call.credentials === 'same-origin'
      )
    );
    assert.equal(result.saved.term, 'Current Term');
    assert.deepEqual(Object.keys(result.saved.categories), ['Core (PCC)']);
    assert.ok(!JSON.stringify(result.saved).includes('CURRENT-ACCOUNT'));
    assert.ok(!JSON.stringify(result.saved).includes('transient-token'));
    const { parseVtopCatalogue } = loadTs('src/lib/vtopCatalogue.ts');
    assert.equal(parseVtopCatalogue(result.saved).source, 'vtop');
    const nil = await evaluate(
      "FFCSVtopParser.sections(new DOMParser().parseFromString('<table><tr><td>NIL</td><td>NIL</td><td>ACADEMICS</td><td>0</td></tr></table>', 'text/html'))"
    );
    assert.deepEqual(nil, [{ slot: 'NIL', faculty: 'ACADEMICS', venue: 'NIL' }]);
    // Regression: an expired session must not become an empty successful capture.
    await evaluate(
      `window.saved = null; window.failure = null; window.fetch = async () => ({ ok: true, text: async () => '<input type="password">' }); window.captureListener({ type: 'CAPTURE_NOW' }, {}, () => {});`
    );
    const failed = await evaluate(
      `new Promise(resolve => { const timer = setInterval(() => { if (window.failure) { clearInterval(timer); resolve({ saved, failure }); } }, 25); })`
    );
    assert.equal(failed.saved, null);
    assert.match(failed.failure, /session expired/);
  }
);

const appUrl = process.env.FFCS_TEST_APP_URL;
test(
  'planner UI: import, select a personal course, isolate bundled choices, and delete',
  { skip: !browserPath || !appUrl, timeout: 30000 },
  async t => {
    const evaluate = await openBrowser(t);
    await evaluate.cdp('Page.enable');
    await evaluate.cdp('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate.cdp('Page.addScriptToEvaluateOnNewDocument', {
      source: `
    window.fixtureCatalogue = ${JSON.stringify(sample())};
    window.catalogueRequests = [];
    window.fixtureStatus = { running: true, stage: 'courses', completed: 1, total: 3, capturedAt: null };
    window.addEventListener('message', event => {
      const request = event.data;
      if (event.source !== window || request?.channel !== 'ffcs-vtop-v1' || request.direction !== 'request') return;
      catalogueRequests.push(request.type);
      if (request.type === 'CLEAR_DATA') fixtureCatalogue = null;
      window.postMessage({ channel: request.channel, direction: 'response', requestId: request.requestId, ok: true,
        dataset: fixtureCatalogue, ...fixtureStatus }, location.origin);
    });
  `,
    });
    await evaluate.cdp('Page.navigate', { url: appUrl });
    const waitFor = async expression => {
      for (let i = 0; i < 120; i++) {
        try {
          if (await evaluate(expression)) return;
        } catch {
          /* navigation swaps execution contexts */
        }
        await delay(100);
      }
      assert.fail(`UI did not become ready: ${expression}`);
    };
    await waitFor(`document.querySelector('button[aria-label="My VTOP"]') !== null`);
    assert.equal(await evaluate('catalogueRequests.length'), 0);
    assert.equal(
      await evaluate(`document.body.textContent.includes('Your courses from VTOP')`),
      false
    );
    await evaluate(`document.querySelector('button[aria-label="My VTOP"]').click()`);
    await waitFor(
      `document.querySelector('[role="dialog"][aria-label="Preparing My VTOP"]') !== null`
    );
    assert.equal(
      await evaluate(`document.querySelector('[aria-label="VTOP capture progress"]').value`),
      1
    );
    await evaluate(`fixtureStatus = { running: false, capturedAt: fixtureCatalogue.capturedAt };`);
    await waitFor(
      `document.querySelector('button[aria-label="My VTOP"]')?.getAttribute('aria-pressed') === 'true'`
    );
    for (const branch of ['SCOPE', 'SCORE', 'SMEC', 'SENSE'])
      assert.equal(
        await evaluate(`document.querySelector('button[aria-label="${branch}"]') !== null`),
        true
      );
    assert.equal(
      await evaluate(`JSON.parse(localStorage.getItem('ffcs:vtop:catalogue:v1')).catalogueId`),
      'a'.repeat(64)
    );
    // Exercise the real picker with the captured category, then theory/lab faculty selection.
    for (const [placeholder, label] of [
      ['Domain', 'Core (PCC)'],
      ['Subject', 'BCSE202L - Data Structures'],
      ['Slot', 'B1+TB1'],
    ]) {
      await evaluate(`document.querySelector('input[placeholder="${placeholder}"]').click()`);
      await waitFor(
        `[...document.querySelectorAll('li')].some(item => item.textContent === ${JSON.stringify(label)})`
      );
      await evaluate(
        `[...document.querySelectorAll('li')].find(item => item.textContent === ${JSON.stringify(label)}).click()`
      );
    }
    await waitFor(`document.querySelector('[aria-label="Select faculty TEST FACULTY"]') !== null`);
    await evaluate(
      `document.querySelector('[aria-label="Select faculty TEST FACULTY"]').parentElement.parentElement.click()`
    );
    await evaluate(
      `[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Confirm').click()`
    );
    await waitFor(
      `JSON.parse(localStorage.getItem('selectedCourses:vtop:${'a'.repeat(64)}') || '[]').length === 1`
    );
    const saved = await evaluate(
      `JSON.parse(localStorage.getItem('selectedCourses:vtop:${'a'.repeat(64)}'))[0]`
    );
    assert.equal(saved.courseType, 'both');
    assert.equal(saved.courseSlots[0].slotFaculties[0].facultyLabSlot, 'L43+L44');
    for (const [placeholder, label] of [
      ['Subject', 'BACSE291 - Innovative Design Project'],
      ['Slot', 'NIL'],
    ]) {
      await evaluate(
        `document.querySelector('input[placeholder="${placeholder}"]').parentElement.querySelector('button[aria-label="Clear"]')?.click()`
      );
      await evaluate(`document.querySelector('input[placeholder="${placeholder}"]').click()`);
      await waitFor(
        `[...document.querySelectorAll('li')].some(item => item.textContent === ${JSON.stringify(label)})`
      );
      await evaluate(
        `[...document.querySelectorAll('li')].find(item => item.textContent === ${JSON.stringify(label)}).click()`
      );
    }
    await waitFor(`document.querySelector('[aria-label="Select faculty ACADEMICS"]') !== null`);
    await evaluate(
      `document.querySelector('[aria-label="Select faculty ACADEMICS"]').parentElement.parentElement.click()`
    );
    await evaluate(
      `[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Confirm').click()`
    );
    await waitFor(
      `JSON.parse(localStorage.getItem('selectedCourses:vtop:${'a'.repeat(64)}') || '[]').length === 2`
    );
    const project = await evaluate(
      `JSON.parse(localStorage.getItem('selectedCourses:vtop:${'a'.repeat(64)}'))[1]`
    );
    assert.equal(project.courseType, 'th');
    assert.equal(project.courseSlots[0].slotName, 'NIL');
    await evaluate(`document.querySelector('button[aria-label="SCOPE"]').click()`);
    await waitFor(
      `document.querySelector('button[aria-label="SCOPE"]').getAttribute('aria-pressed') === 'true'`
    );
    assert.equal(
      await evaluate(`JSON.parse(localStorage.getItem('selectedCourses') || '[]').length`),
      0
    );
    await evaluate(`document.querySelector('button[aria-label="My VTOP"]').click()`);
    await waitFor(
      `document.querySelector('button[aria-label="My VTOP"]').getAttribute('aria-pressed') === 'true'`
    );
    await evaluate(
      `[...document.querySelectorAll('button')].find(button => button.textContent === 'Delete VTOP data').click()`
    );
    await waitFor(
      `document.querySelector('button[aria-label="SCOPE"]').getAttribute('aria-pressed') === 'true'`
    );
    assert.equal(await evaluate(`localStorage.getItem('ffcs:vtop:catalogue:v1')`), null);
    assert.equal(
      await evaluate(`localStorage.getItem('selectedCourses:vtop:${'a'.repeat(64)}')`),
      null
    );
    assert.ok((await evaluate('catalogueRequests')).includes('CLEAR_DATA'));
  }
);

test(
  'VTOP login: fetch allocation in background and show progress then ready banner',
  { skip: !browserPath, timeout: 20000 },
  async t => {
    const evaluate = await openBrowser(t);
    await evaluate(read('extension/parser.js'));
    await evaluate(`(() => {
    document.body.innerHTML = '<form><input type="password"></form>';
    window.calls = []; window.events = []; window.saved = null; window.failure = null;
    Object.defineProperty(window, 'crypto', { value: { subtle: { digest: async () => new Uint8Array(32).fill(10).buffer } } });
    window.chrome = { runtime: { onMessage: { addListener: fn => { window.captureListener = fn; } }, sendMessage: async message => {
      events.push(message.type);
      if (message.type === 'VTOP_BEGIN') return { ok: true, runId: 'login-run' };
      if (message.type === 'VTOP_COMMIT') window.saved = message.dataset;
      if (message.type === 'VTOP_FAIL') window.failure = message.error;
      return { ok: true };
    } } };
    window.fetch = async (url, options) => {
      calls.push({ url, body: Object.fromEntries(options.body) });
      await new Promise(resolve => setTimeout(resolve, 250));
      let html;
      if (url.endsWith('/StudentCourseAllocation')) html = '<select id="semesterSubId" name="semesterSubId"><option value="">Select</option><option value="CURRENT">Current Term</option></select><select id="cccategory"><option value="PCC">Core</option><option disabled value="OTHER">Other branch</option></select><script>window.untrustedScriptRan=true</script>';
      else if (url.endsWith('/getCoursesListForCurriculmCategory')) html = '<select><option value="BCSE202L">BCSE202L - Data Structures</option></select>';
      else html = '<table><tr><th>Slot</th><th>Venue</th><th>Faculty</th><th>Seats</th></tr><tr><td>B1+TB1</td><td>SJT522</td><td>Test Faculty</td><td>60</td></tr></table>';
      return { ok: true, text: async () => html };
    };
  })()`);
    await evaluate(read('extension/vtop.js'));
    await delay(800);
    assert.equal(await evaluate('calls.length'), 0);
    await evaluate(
      `document.body.innerHTML = '<input name="_csrf" value="ephemeral"><input id="authorizedID" value="MY-ACCOUNT"><nav><a data-url="academics/common/StudentCourseAllocation" href="javascript:void(0)">Course Registration Allocation</a></nav><main id="dashboard">My dashboard</main>';`
    );
    await delay(850);
    assert.equal(
      await evaluate(
        `document.querySelector('#ffcs-inator-banner').shadowRoot.querySelector('section').getAttribute('aria-busy')`
      ),
      'true'
    );
    assert.equal(
      await evaluate(
        `document.querySelector('#ffcs-inator-banner').shadowRoot.querySelector('a').hidden`
      ),
      true
    );
    const result =
      await evaluate(`new Promise((resolve, reject) => { let tries=0; const timer=setInterval(() => {
    if (saved || failure) { clearInterval(timer); resolve({saved,failure,calls,events}); }
    else if (++tries>100) { clearInterval(timer); reject(new Error('Automatic capture timed out')); }
  },50); })`);
    assert.equal(result.failure, null);
    assert.equal(result.calls.length, 3);
    assert.ok(result.calls[0].url.endsWith('/StudentCourseAllocation'));
    assert.equal(result.calls[1].body.cccategory, 'PCC');
    assert.equal(result.calls[1].body.semesterSubId, 'CURRENT');
    assert.equal(result.saved.term, 'Current Term');
    assert.equal(await evaluate(`document.querySelector('#cccategory')`), null);
    assert.equal(
      await evaluate(`document.querySelector('#dashboard').textContent`),
      'My dashboard'
    );
    assert.equal(await evaluate('Boolean(window.untrustedScriptRan)'), false);
    assert.equal(
      await evaluate(
        `document.querySelector('#ffcs-inator-banner').shadowRoot.querySelector('h2').textContent`
      ),
      'Inator ready!'
    );
    assert.equal(
      await evaluate(
        `document.querySelector('#ffcs-inator-banner').shadowRoot.querySelector('a').hidden`
      ),
      false
    );
    assert.equal(
      await evaluate(
        `document.querySelector('#ffcs-inator-banner').shadowRoot.querySelector('a').href`
      ),
      'https://ffcs.codechefvit.com/#start'
    );
    assert.ok(result.events.includes('VTOP_PROGRESS'));
  }
);

test(
  'planner UI without extension: My VTOP opens an installation alert and preserves branch buttons',
  { skip: !browserPath || !appUrl, timeout: 20000 },
  async t => {
    const evaluate = await openBrowser(t);
    await evaluate.cdp('Page.enable');
    await evaluate.cdp('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate.cdp('Page.addScriptToEvaluateOnNewDocument', {
      source: `
      window.hydrationWarnings = [];
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.map(arg => String(arg)).join(' ');
        if (/hydrat|server rendered|didn't match/i.test(message)) hydrationWarnings.push(message);
        originalConsoleError.apply(console, args);
      };
      const injectGrammarly = () => {
        if (!document.body) return;
        document.body.setAttribute('data-new-gr-c-s-check-loaded', '14.1342.0');
        document.body.setAttribute('data-gr-ext-installed', '');
        observer.disconnect();
      };
      const observer = new MutationObserver(injectGrammarly);
      observer.observe(document, { childList: true, subtree: true });
      injectGrammarly();
    `,
    });
    await evaluate.cdp('Page.navigate', { url: appUrl });
    const waitFor = async expression => {
      for (let i = 0; i < 100; i++) {
        try {
          if (await evaluate(expression)) return;
        } catch {
          /* navigation */
        }
        await delay(100);
      }
      assert.fail(`Missing UI: ${expression}`);
    };
    await waitFor(`document.querySelector('button[aria-label="My VTOP"]') !== null`);
    assert.equal(
      await evaluate(`document.body.getAttribute('data-new-gr-c-s-check-loaded')`),
      '14.1342.0'
    );
    assert.deepEqual(await evaluate('hydrationWarnings'), []);
    assert.equal(await evaluate(`document.querySelector('[role="dialog"]')`), null);
    assert.equal(await evaluate(`document.querySelector('a[download]')`), null);
    await evaluate(`document.querySelector('button[aria-label="My VTOP"]').click()`);
    await waitFor(`document.querySelector('[role="dialog"][aria-label="Get My VTOP"]') !== null`);
    assert.equal(
      await evaluate(`document.querySelector('[role="dialog"] a[download]').getAttribute('href')`),
      '/extensions/ffcs-vtop.zip'
    );
    assert.equal(
      await evaluate(
        `document.querySelector('[role="dialog"]').textContent.includes('Developer mode')`
      ),
      true
    );
    assert.equal(
      await evaluate(
        `document.querySelector('button[aria-label="SCOPE"]').getAttribute('aria-pressed')`
      ),
      'true'
    );
    assert.equal(
      await evaluate(`document.querySelector('button[aria-label="SCORE"]') !== null`),
      true
    );
    await evaluate(
      `[...document.querySelectorAll('[role="dialog"] button')].find(button => button.textContent.trim() === 'OK').click()`
    );
    await waitFor(`!document.querySelector('[role="dialog"]')`);
    await evaluate(`document.querySelector('button[aria-label="SCORE"]').click()`);
    await waitFor(
      `document.querySelector('button[aria-label="SCORE"]').getAttribute('aria-pressed') === 'true'`
    );
  }
);
