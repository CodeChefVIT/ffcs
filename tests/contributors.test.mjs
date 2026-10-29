import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { webcrypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'extension', 'FFCS-Contributors');
const read = file => fs.readFileSync(path.join(directory, file), 'utf8');
const catalogue = JSON.parse(read('catalogue.json'));
const serial = value => JSON.parse(JSON.stringify(value));
const pure = vm.createContext({ TextEncoder, Uint8Array, DataView });
vm.runInContext(read('exporter.js'), pure);
vm.runInContext(read('zip.js'), pure);
const exporter = pure.FFCSContributorExport;
const zip = pure.FFCSZip;
const destination = { school: 'SCOPE', branch: 'BCI' };
const categories = ['FC', 'DLES', 'DC', 'SPE', 'PI', 'OE', 'BC', 'NGCR'].map(code => ({
  code,
  label: code,
}));
const row = {
  slot: 'B1+TB1',
  venue: 'SJT522',
  faculty: "O'Brien \\ Faculty\n\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
};
const groups = Object.fromEntries(categories.map(item => [item.code, {}]));
groups.FC = { "BCSE202L - Compiler's Design": [row] };
groups.PI = { 'BACSE291 - Project': [{ slot: 'NIL', venue: 'NIL', faculty: 'ACADEMICS' }] };

function unzip(buffer) {
  const bytes = Buffer.from(buffer),
    result = new Map();
  let offset = 0;
  while (bytes.readUInt32LE(offset) === 0x04034b50) {
    assert.equal(bytes.readUInt16LE(offset + 8), 0);
    assert.equal(bytes.readUInt16LE(offset + 6) & 0x0800, 0x0800);
    const size = bytes.readUInt32LE(offset + 18),
      nameLength = bytes.readUInt16LE(offset + 26),
      extra = bytes.readUInt16LE(offset + 28);
    const name = bytes.subarray(offset + 30, offset + 30 + nameLength).toString('utf8');
    const begin = offset + 30 + nameLength + extra,
      data = bytes.subarray(begin, begin + size);
    assert.equal(zip.crc32(new Uint8Array(data)), bytes.readUInt32LE(offset + 14));
    result.set(name, data);
    offset = begin + size;
  }
  assert.equal(bytes.readUInt32LE(offset), 0x02014b50);
  assert.equal(bytes.readUInt32LE(bytes.length - 22), 0x06054b50);
  assert.equal(bytes.readUInt16LE(bytes.length - 12), result.size);
  return result;
}

test('school list has no branch-folder or repository-file mapping requirements', () => {
  assert.equal(catalogue.schemaVersion, 2);
  assert.ok(catalogue.schools.includes('SCOPE'));
  assert.ok(catalogue.schools.includes('SMEC'));
  assert.equal(new Set(catalogue.schools).size, catalogue.schools.length);
  assert.equal(catalogue.profiles, undefined);
});

test('every VTOP category gets its own compilable file and generated index', () => {
  const archive = unzip(zip.createZip(exporter.buildFiles(destination, categories, groups)));
  assert.deepEqual(
    [...archive.keys()],
    [...categories.map(item => `src/data/SCOPE/BCI/${item.code}.ts`), 'src/data/SCOPE/BCI/index.ts']
  );
  const modules = {};
  for (const category of categories) {
    const source = archive.get(`src/data/SCOPE/BCI/${category.code}.ts`).toString('utf8');
    const compiled = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
      reportDiagnostics: true,
    });
    assert.deepEqual(compiled.diagnostics, []);
    const exports = {};
    vm.runInNewContext(compiled.outputText, { exports });
    assert.deepEqual(serial(exports[category.code]), groups[category.code]);
    modules[`./${category.code}`] = exports;
  }
  const index = ts.transpileModule(archive.get('src/data/SCOPE/BCI/index.ts').toString('utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(index, {
    exports,
    require: name => {
      assert.ok(modules[name]);
      return modules[name];
    },
  });
  assert.deepEqual(serial(exports.SCOPE_BCI), groups);
  assert.equal(zip.crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
  assert.throws(() => zip.createZip([{ name: '../outside.ts', text: '' }]));
});

test('school/branch and category names are safe, and rows omit unrelated fields', () => {
  assert.equal(
    exporter.destinationPath({ school: 'scope', branch: 'bci 2025' }),
    'src/data/SCOPE/BCI_2025'
  );
  for (const branch of ['', '../BCI', 'BCI/OTHER', 'CON'])
    assert.throws(() => exporter.buildFiles({ school: 'SCOPE', branch }, categories, groups));
  assert.throws(() => exporter.buildFiles(destination, [{ code: '../FC' }], groups));
  assert.throws(
    () => exporter.buildFiles(destination, [categories[0], categories[0]], groups),
    /repeated/
  );
  assert.throws(() => exporter.buildFiles(destination, categories, {}), /Missing/);
  assert.throws(() =>
    exporter.serializeGroup('FC', { 'BCSE202L - Test': [{ ...row, slot: 'garbage' }] })
  );
  assert.ok(
    !exporter
      .serializeGroup('FC', { 'BCSE202L - Test': [{ ...row, csrf: 'do-not-export' }] })
      .includes('do-not-export')
  );
});

test('extension ZIP is self-contained, updated and limited to VTOP access', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.equal(manifest.version, '1.1.0');
  assert.deepEqual(manifest.permissions, ['storage', 'downloads']);
  assert.deepEqual(manifest.host_permissions, ['https://vtop.vit.ac.in/vtop/*']);
  assert.equal(manifest.content_scripts.length, 1);
  const archive = unzip(
    fs.readFileSync(path.join(root, 'public/extensions/FFCS-Contributors.zip'))
  );
  assert.ok(archive.has('manifest.json'));
  assert.ok(archive.has('contributor.html'));
  assert.ok(!archive.has('app-bridge.js'));
  for (const [name, bytes] of archive)
    assert.deepEqual(bytes, fs.readFileSync(path.join(directory, name)));
});
function worker(
  sendToVtop = async (_id, message) =>
    message.type === 'ADMIN_INSPECT'
      ? {
          ok: true,
          contextKey: 'a'.repeat(64),
          term: 'Current term',
          categories: [
            { code: 'UCC', label: 'University Core' },
            { code: 'FCON', label: 'Concentration' },
          ],
        }
      : { ok: true }
) {
  const local = {},
    listeners = {},
    opened = [];
  let receiver;
  const sandbox = vm.createContext({
    URL,
    crypto: webcrypto,
    console,
    fetch: async () => ({ json: async () => catalogue }),
    chrome: {
      runtime: {
        id: 'contributors-id',
        getURL: file => `chrome-extension://contributors-id/${file}`,
        onMessage: {
          addListener: fn => {
            receiver = fn;
          },
        },
        onInstalled: {
          addListener: fn => {
            listeners.install = fn;
          },
        },
      },
      storage: {
        local: {
          setAccessLevel: async () => {},
          get: async keys =>
            Object.fromEntries((Array.isArray(keys) ? keys : [keys]).map(key => [key, local[key]])),
          set: async values => Object.assign(local, serial(values)),
          remove: async keys =>
            (Array.isArray(keys) ? keys : [keys]).forEach(key => delete local[key]),
        },
      },
      tabs: {
        get: async id => ({ id, url: 'https://vtop.vit.ac.in/vtop/content' }),
        query: async () => [{ id: 7, title: 'VTOP', lastAccessed: 1 }],
        sendMessage: sendToVtop,
        create: async data => {
          opened.push(data.url);
        },
        onRemoved: {
          addListener: fn => {
            listeners.removed = fn;
          },
        },
      },
      action: {
        onClicked: {
          addListener: fn => {
            listeners.action = fn;
          },
        },
      },
    },
    importScripts: name => vm.runInContext(read(name), sandbox),
  });
  vm.runInContext(read('background.js'), sandbox);
  const dashboard = {
    id: 'contributors-id',
    url: 'chrome-extension://contributors-id/contributor.html',
    frameId: 0,
  };
  const vtop = {
    id: 'contributors-id',
    url: 'https://vtop.vit.ac.in/vtop/content',
    frameId: 0,
    tab: { id: 7 },
  };
  const send = (type, data = {}, sender = dashboard) =>
    new Promise(resolve => receiver({ type, ...data }, sender, value => resolve(serial(value))));
  return { local, listeners, opened, send, dashboard, vtop };
}

test('only the dashboard can export, and all inspected categories are captured automatically', async () => {
  const w = worker();
  for (const sender of [
    { ...w.dashboard, id: 'another-extension' },
    { ...w.dashboard, frameId: 1 },
    { ...w.dashboard, url: 'https://ffcs.codechefvit.com/' },
    w.vtop,
  ])
    assert.equal((await w.send('ADMIN_CONFIG', {}, sender)).ok, false);
  w.listeners.action();
  assert.deepEqual(w.opened, ['chrome-extension://contributors-id/contributor.html']);
  await w.send('ADMIN_INSPECT_TAB', { tabId: 7 });
  assert.equal(
    (await w.send('ADMIN_START', { tabId: 7, school: 'OTHER', branch: 'BCI' })).ok,
    false
  );
  const started = await w.send('ADMIN_START', { tabId: 7, ...destination });
  assert.equal(started.ok, true);
  assert.deepEqual(
    started.job.categories.map(item => item.code),
    ['UCC', 'FCON']
  );
  const data = { UCC: groups.FC, FCON: groups.PI };
  assert.equal(
    (
      await w.send(
        'ADMIN_COMPLETE',
        { jobId: started.job.id, groups: data },
        { ...w.vtop, tab: { id: 8 } }
      )
    ).ok,
    false
  );
  assert.equal(
    (await w.send('ADMIN_COMPLETE', { jobId: started.job.id, groups: data }, w.vtop)).ok,
    true
  );
  assert.equal((await w.send('ADMIN_EXPORT', {}, w.vtop)).ok, false);
  const output = await w.send('ADMIN_EXPORT');
  assert.equal(output.ok, true);
  assert.equal(output.result.files.length, 3);
  assert.ok(output.result.files[1].name.endsWith('/FCON.ts'));
  assert.ok(output.result.files[1].text.startsWith('export const FCON ='));
  assert.ok(!JSON.stringify(output.result).includes('contextKey'));
});

test('cancelled/failed/closed-tab captures cannot produce a partial ZIP', async () => {
  const w = worker();
  await w.send('ADMIN_INSPECT_TAB', { tabId: 7 });
  const start = () => w.send('ADMIN_START', { tabId: 7, ...destination });
  let run = await start();
  await w.send('ADMIN_CANCEL');
  assert.equal(
    (
      await w.send(
        'ADMIN_COMPLETE',
        { jobId: run.job.id, groups: { UCC: groups.FC, FCON: {} } },
        w.vtop
      )
    ).ok,
    false
  );
  assert.equal((await w.send('ADMIN_EXPORT')).ok, false);
  run = await start();
  await w.send('ADMIN_FAILED', { jobId: run.job.id, error: 'Session expired' }, w.vtop);
  assert.equal((await w.send('ADMIN_STATE')).job.state, 'error');
  assert.equal((await w.send('ADMIN_EXPORT')).ok, false);
  await start();
  w.listeners.removed(7);
  assert.equal((await w.send('ADMIN_STATE')).job.state, 'error');
  assert.equal((await w.send('ADMIN_EXPORT')).ok, false);
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
async function browser(t) {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ffcs-contributors-test-'));
  const process = spawn(
    browserPath,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-component-update',
      '--disable-sync',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileDir}`,
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' }
  );
  t.after(async () => {
    process.kill();
    await delay(500);
    const target = path.resolve(profileDir),
      parent = path.resolve(os.tmpdir());
    if (
      path.dirname(target) === parent &&
      path.basename(target).startsWith('ffcs-contributors-test-')
    )
      fs.rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  });
  let port;
  for (let i = 0; i < 200; i++) {
    try {
      port = fs.readFileSync(path.join(profileDir, 'DevToolsActivePort'), 'utf8').split('\n')[0];
      break;
    } catch {
      await delay(50);
    }
  }
  assert.ok(port, 'Headless browser started');
  return async function newPage(dispatch) {
    const target = await (
      await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
    ).json();
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.onopen = resolve;
      socket.onerror = reject;
    });
    t.after(() => socket.close());
    let sequence = 0;
    const pending = new Map();
    const call = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++sequence;
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }, 15000);
        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params }));
      });
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      const item = pending.get(message.id);
      if (item) {
        clearTimeout(item.timer);
        pending.delete(message.id);
        if (message.error) item.reject(new Error(JSON.stringify(message.error)));
        else item.resolve(message.result);
      }
      if (message.method === 'Runtime.bindingCalled' && message.params.name === '__ffcsTestCall') {
        const request = JSON.parse(message.params.payload);
        Promise.resolve()
          .then(() => dispatch(request.message))
          .catch(error => ({ ok: false, error: error.message }))
          .then(result =>
            call('Runtime.evaluate', {
              expression: `window.__resolveTestCall(${request.id}, ${JSON.stringify(result)})`,
            })
          )
          .catch(() => {});
      }
    };
    await call('Page.enable');
    await call('Runtime.enable');
    await call('Runtime.addBinding', { name: '__ffcsTestCall' });
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await call('Page.addScriptToEvaluateOnNewDocument', {
      source: `
      window.__requests = new Map(); window.__requestId = 0;
      window.__resolveTestCall = (id, result) => { window.__requests.get(id)?.(result); window.__requests.delete(id); };
      const rpc = message => new Promise(resolve => { const id=++window.__requestId; window.__requests.set(id,resolve); window.__ffcsTestCall(JSON.stringify({id,message})); });
      const listeners = new Set();
      window.chrome = {
        runtime: { id: 'contributors-id', sendMessage: rpc, onMessage: { addListener: fn => { window.__contributorListener=fn; } } },
        downloads: { download: async ({url,filename}) => {
          const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
          let binary=''; for(const byte of bytes) binary+=String.fromCharCode(byte);
          await rpc({type:'TEST_DOWNLOAD',filename,base64:btoa(binary)});
          setTimeout(() => { for(const listener of listeners) listener({id:1,state:{current:'complete'}}); },25);
          return 1;
        }, onChanged: { addListener: fn=>listeners.add(fn), removeListener: fn=>listeners.delete(fn) } }
      };
    `,
    });
    return {
      call,
      evaluate,
      navigate: async url => {
        await call('Page.navigate', { url });
      },
    };
  };
}

test(
  'browser: school and branch export all VTOP categories without mapping choices',
  { skip: !browserPath, timeout: 45000 },
  async t => {
    const newPage = await browser(t);
    const calls = [],
      downloads = [];
    let account = 'CURRENT-ACCOUNT';
    const server = http.createServer(async (request, response) => {
      const url = new URL(request.url, 'http://fixture');
      response.setHeader('Cache-Control', 'no-store');
      if (url.pathname === '/vtop/content') {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(
          `<html><body><input name="_csrf" value="ephemeral-token"><input id="authorizedID" value="${account}"><nav><a data-url="academics/common/StudentCourseAllocation">Course Registration Allocation</a></nav><main id="dashboard">VTOP dashboard</main></body></html>`
        );
        return;
      }
      if (url.pathname.startsWith('/vtop/academics/')) {
        const parts = [];
        for await (const chunk of request) parts.push(chunk);
        const body = Object.fromEntries(new URLSearchParams(Buffer.concat(parts).toString()));
        calls.push({ path: url.pathname, body });
        assert.equal(body.authorizedID, account);
        assert.equal(body._csrf, 'ephemeral-token');
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        let html;
        if (url.pathname.endsWith('/StudentCourseAllocation'))
          html =
            '<select id="semesterSubId" name="semesterSubId"><option value="CURRENT">Current Term</option></select><select id="cccategory"><option value="FC">FC - Foundation Core</option><option value="DLES">DLES - Discipline-linked Engineering Sciences</option><option value="DC">DC - Discipline Core</option><option value="SPE">SPE - Specialization Elective</option><option value="PI">PI - Projects and Internship</option><option value="OE">OE - Open Elective</option><option value="BC">BC - Bridge Course</option><option value="NGCR">NGCR - Non-graded Core Requirement</option><option disabled value="OTHER">Other branch</option></select>';
        else if (url.pathname.endsWith('/getCoursesListForCurriculmCategory')) {
          const options = {
            FC: '<option value="BCSE202L">BCSE202L - Compiler&#39;s Design</option><option value="BCSE202P">BCSE202P - Compiler Lab</option>',
            DLES: '<option value="BCSE202L">BCSE202L - Compiler&#39;s Design</option>',
            PI: '<option value="BACSE291">BACSE291 - Design Project</option>',
            OE: '<option value="">No courses</option>',
            DC: '<option value="BCSE202L">BCSE202L - Compiler&#39;s Design</option>',
            SPE: '<option value="BCSE202P">BCSE202P - Compiler Lab</option>',
            BC: '<option value="">No courses</option>',
            NGCR: '<option value="">No courses</option>',
          };
          assert.ok(Object.prototype.hasOwnProperty.call(options, body.cccategory));
          html = `<select>${options[body.cccategory]}</select>`;
        } else {
          const slot =
            body.courseCode === 'BCSE202P'
              ? 'L43+L44'
              : body.courseCode === 'BACSE291'
                ? 'NIL'
                : 'B1+TB1';
          html = `<table><tr><th>Slot</th><th>Venue</th><th>Faculty</th><th>Seats</th></tr><tr><td>${slot}</td><td>${slot === 'NIL' ? 'NIL' : 'SJT522'}</td><td>O&#39;Brien Faculty</td><td>60</td></tr></table>`;
        }
        response.end(html);
        return;
      }
      const file = url.pathname === '/' ? 'contributor.html' : url.pathname.slice(1);
      if (
        ![
          'contributor.html',
          'contributor.css',
          'contributor.js',
          'exporter.js',
          'zip.js',
        ].includes(file)
      ) {
        response.writeHead(404).end();
        return;
      }
      response.setHeader(
        'Content-Type',
        file.endsWith('.js')
          ? 'text/javascript; charset=utf-8'
          : file.endsWith('.css')
            ? 'text/css'
            : 'text/html; charset=utf-8'
      );
      response.end(read(file));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(() => {
      server.closeAllConnections();
      server.close();
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    let w;
    const vtop = await newPage(message => w.send(message.type, message, w.vtop));
    await vtop.navigate(origin + '/vtop/content');
    const waitFor = async (page, expression) => {
      for (let i = 0; i < 300; i++) {
        try {
          if (await page.evaluate(expression)) return;
        } catch {
          /* Navigation changes the execution context. */
        }
        await delay(50);
      }
      const state = await page.evaluate(
        `JSON.stringify({error:document.querySelector("#error")?.textContent,status:document.querySelector("#job-status")?.textContent})`
      );
      assert.fail(`Browser condition did not become true: ${expression}; ${state}`);
    };
    await waitFor(vtop, 'Boolean(document.querySelector("#authorizedID"))');
    await vtop.evaluate(read('parser.js'));
    await vtop.evaluate(read('vtop.js'));
    w = worker(async (_id, message) =>
      vtop.evaluate(
        `new Promise(resolve => window.__contributorListener(${JSON.stringify(message)}, {id:'contributors-id'}, resolve))`
      )
    );
    const ui = await newPage(message => {
      if (message.type === 'TEST_DOWNLOAD') {
        downloads.push({
          filename: message.filename,
          bytes: Buffer.from(message.base64, 'base64'),
        });
        return { ok: true };
      }
      return w.send(message.type, message);
    });
    await ui.call('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 1050,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await ui.navigate(origin);
    await waitFor(ui, 'document.querySelector("#vtop-tab")?.value === "7"');
    await ui.evaluate('document.querySelector("#connect").click()');
    await waitFor(ui, 'document.querySelectorAll("#categories tr").length === 8');
    assert.equal(
      await ui.evaluate(
        'document.querySelectorAll("#categories select, #categories input").length'
      ),
      0
    );
    assert.equal(await ui.evaluate('Boolean(document.querySelector("#folder"))'), false);
    await ui.evaluate(
      `document.querySelector('#school').value='SCOPE'; document.querySelector('#school').dispatchEvent(new Event('change',{bubbles:true})); document.querySelector('#branch').value='BCI'; document.querySelector('#branch').dispatchEvent(new Event('input',{bubbles:true}));`
    );
    await waitFor(ui, '!document.querySelector("#start").disabled');
    assert.ok(
      (await ui.evaluate('document.querySelector("#destination").textContent')).includes(
        'src/data/SCOPE/BCI/'
      )
    );
    await ui.evaluate('document.querySelector("#start").click()');
    await waitFor(ui, '!document.querySelector("#progress").hidden');
    await waitFor(ui, '!document.querySelector("#download").hidden');
    for (let i = 0; i < 100 && !downloads.length; i++) await delay(50);
    assert.equal(downloads.length, 1);
    const archive = unzip(downloads[0].bytes);
    assert.deepEqual(
      [...archive.keys()],
      [
        ...categories.map(item => `src/data/SCOPE/BCI/${item.code}.ts`),
        'src/data/SCOPE/BCI/index.ts',
      ]
    );
    assert.match(
      archive.get('src/data/SCOPE/BCI/index.ts').toString(),
      /import { SPE } from '.\/SPE'/
    );
    assert.match(archive.get('src/data/SCOPE/BCI/SPE.ts').toString(), /^export const SPE =/);
    assert.match(archive.get('src/data/SCOPE/BCI/PI.ts').toString(), /slot: 'NIL'/);
    for (const code of ['OE', 'BC', 'NGCR'])
      assert.equal(
        archive.get(`src/data/SCOPE/BCI/${code}.ts`).toString(),
        `export const ${code} = {\n};\n`
      );
    assert.deepEqual(
      calls.filter(call => call.body.cccategory).map(call => call.body.cccategory),
      categories.map(item => item.code)
    );
    assert.equal(calls.filter(call => call.body.courseCode === 'BCSE202L').length, 1);
    for (const bytes of archive.values()) {
      assert.ok(!bytes.toString().includes('CURRENT-ACCOUNT'));
      assert.ok(!bytes.toString().includes('ephemeral-token'));
    }
    assert.equal(await vtop.evaluate('Boolean(document.querySelector("#cccategory"))'), false);
    assert.equal(
      await vtop.evaluate('document.querySelector("#dashboard").textContent'),
      'VTOP dashboard'
    );
    if (process.env.FFCS_CONTRIBUTOR_SCREENSHOT) {
      const screenshot = await ui.call('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        process.env.FFCS_CONTRIBUTOR_SCREENSHOT,
        Buffer.from(screenshot.data, 'base64')
      );
    }
    // A different signed-in account must not reuse the previous inspection.
    account = 'OTHER-ACCOUNT';
    await vtop.evaluate('document.querySelector("#authorizedID").value="OTHER-ACCOUNT"');
    await ui.evaluate('document.querySelector("#start").click()');
    await waitFor(
      ui,
      'document.querySelector("#job-status").textContent.includes("account, semester")'
    );
    assert.equal((await w.send('ADMIN_EXPORT')).ok, false);
    assert.equal(downloads.length, 1);
  }
);
