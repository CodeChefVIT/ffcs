/* global chrome */
(() => {
  const { clean, courses, sections } = globalThis.FFCSVtopParser;
  const APP_URL = 'https://ffcs.codechefvit.com/#start';
  const CATEGORY_SELECTOR = 'select#cccategory, select[name="cccategory"]';
  const TERM_SELECTOR =
    'select#semesterSubId, select[name="semesterSubId"], select#semesterId, select[name="semesterId"], input#semesterSubId, input[name="semesterSubId"], input#semesterId, input[name="semesterId"]';
  let running = false;
  let attemptedSession = '';
  let timer;
  let banner;

  async function message(type, data = {}) {
    const result = await chrome.runtime.sendMessage({ type, ...data });
    if (!result?.ok) throw new Error(result?.error || 'Extension was updated. Refresh VTOP.');
    return result;
  }
  function session() {
    const csrf =
      document.querySelector('input[name="_csrf"]')?.value ||
      document.querySelector('meta[name="_csrf"]')?.content;
    const authorizedID = document.querySelector(
      'input#authorizedID, input[name="authorizedID"]'
    )?.value;
    return csrf && authorizedID ? { csrf, authorizedID } : null;
  }
  function sessionKey(auth) {
    // Session fields remain in memory, never in the catalogue or banner.
    return JSON.stringify([
      auth.authorizedID,
      auth.csrf,
      document.querySelector(CATEGORY_SELECTOR)
        ? document.querySelector(TERM_SELECTOR)?.value || ''
        : '',
    ]);
  }
  function showBanner(state, detail, completed = 0, total = 0) {
    if (!banner) {
      const host = document.createElement('div');
      host.id = 'ffcs-inator-banner';
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = `<style>
        :host { all: initial; position: fixed; bottom: 22px; right: 22px; width: min(380px, calc(100vw - 44px)); z-index: 2147483647; color-scheme: light; }
        section { font: 14px/1.5 system-ui,sans-serif; color: #17242c; background: #e9f6f2; border: 3px solid #17242c; border-radius: 18px; padding: 18px; box-shadow: 5px 5px 0 #17242c; }
        small { font-weight: 750; letter-spacing: .04em; } h2 { font-size: 22px; margin: 5px 24px 7px 0; } p { margin: 0 0 12px; }
        progress { width: 100%; height: 12px; accent-color: #6fa83d; margin: 0 0 10px; }
        a,button { font: inherit; font-weight: 700; color: inherit; cursor: pointer; } a,button.retry { display: inline-block; text-decoration: none; border: 2px solid #17242c; border-radius: 10px; background: #c1ff83; padding: 9px 14px; }
        button.close { position: absolute; right: 14px; top: 12px; background: transparent; border: 0; font-size: 22px; padding: 4px; }
        [hidden] { display: none !important; }
      </style><section role="status" aria-live="polite"><small>FFCS-INATOR</small><button class="close" aria-label="Dismiss FFCS-inator banner">×</button><h2></h2><p></p><progress aria-label="Course capture progress" max="100"></progress><a target="_blank" rel="noopener noreferrer" hidden>Go to Inator →</a><button class="retry" hidden>Retry</button></section>`;
      shadow.querySelector('a').href = APP_URL;
      shadow.querySelector('.close').addEventListener('click', () => {
        host.style.display = 'none';
      });
      shadow.querySelector('.retry').addEventListener('click', () => {
        void capture().catch(() => {});
      });
      document.documentElement.appendChild(host);
      banner = { host, shadow };
    }
    const { host, shadow } = banner;
    host.style.display = '';
    shadow.querySelector('h2').textContent =
      state === 'ready'
        ? 'Inator ready!'
        : state === 'error'
          ? 'Could not fetch courses'
          : 'Getting Inator ready…';
    shadow.querySelector('p').textContent = detail;
    const progress = shadow.querySelector('progress');
    progress.hidden = state !== 'working';
    if (total) progress.value = Math.min(100, (completed / total) * 100);
    else progress.removeAttribute('value');
    shadow.querySelector('a').hidden = state !== 'ready';
    shadow.querySelector('.retry').hidden = state !== 'error';
    shadow.querySelector('section').setAttribute('aria-busy', String(state === 'working'));
  }
  function checkSession(auth) {
    if (session()?.authorizedID !== auth.authorizedID)
      throw new Error('Your VTOP session changed. Log in again to restart capture.');
  }
  async function post(route, fields, auth) {
    checkSession(auth);
    // Routes come from the signed-in menu or fixed read-only downloader endpoints.
    if (!/^academics\/[a-z0-9/_-]+$/i.test(route))
      throw new Error('VTOP returned an unsupported course view.');
    const body = new URLSearchParams({
      _csrf: session().csrf,
      authorizedID: auth.authorizedID,
      x: new Date().toUTCString(),
      ...fields,
    });
    const response = await fetch(`/vtop/${route}`, {
      method: 'POST',
      credentials: 'same-origin',
      body,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok)
      throw new Error(`VTOP request failed (${response.status}). Retry or log in again.`);
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    if (
      doc.querySelector('input[type="password"], input[name="captchaStr"]') ||
      /session\s+(?:has\s+)?expired|invalid csrf|access denied|not authorized/i.test(
        doc.body.textContent
      )
    ) {
      throw new Error('Your VTOP session expired or access was denied. Log in again to retry.');
    }
    checkSession(auth);
    await new Promise(resolve => setTimeout(resolve, 150));
    return doc;
  }
  function termFrom(doc) {
    const field = doc.querySelector(TERM_SELECTOR);
    if (!field) return { name: '', value: '', label: '' };
    if (field.tagName !== 'SELECT')
      return { name: field.name || field.id, value: field.value, label: field.value };
    const valid = [...field.options].filter(
      option =>
        !option.disabled &&
        !option.hidden &&
        clean(option.value) &&
        !/^(0|-1)$/.test(option.value) &&
        !/^select\b/i.test(clean(option.textContent))
    );
    const option =
      valid.find(item => item.value === field.value) ||
      valid.find(item => /\bcurrent\b/i.test(item.textContent)) ||
      valid[0];
    return {
      name: field.name || field.id,
      value: option?.value || '',
      label: clean(option?.textContent),
    };
  }
  function categoriesFrom(doc) {
    const field =
      doc.querySelector(CATEGORY_SELECTOR) ||
      [...doc.querySelectorAll('select')].find(select =>
        /curricul.*category|category.*curricul/i.test(select.id + select.name)
      );
    return field
      ? [...field.options]
          .filter(
            option =>
              !option.disabled &&
              !option.hidden &&
              clean(option.value) &&
              !/^(0|-1|select|all)$/i.test(clean(option.value)) &&
              !/^select\b/i.test(clean(option.textContent))
          )
          .map(option => ({
            code: clean(option.value),
            label: clean(option.textContent) || clean(option.value),
          }))
      : [];
  }
  function allocationRoute() {
    for (const item of document.querySelectorAll('[data-url], a[href], [onclick]')) {
      const label = clean(item.textContent);
      const raw = [
        item.getAttribute('data-url'),
        item.getAttribute('href'),
        item.getAttribute('onclick'),
      ]
        .filter(Boolean)
        .join(' ');
      if (
        !/course\s*(?:registration\s*)?allocation|course\s*offering/i.test(label) &&
        !/course\w*allocation|registration\w*allocation/i.test(raw)
      )
        continue;
      const route = raw.match(/(?:\/vtop\/)?(academics\/[a-z0-9/_-]+)/i)?.[1];
      if (route) return route;
    }
    return null;
  }
  async function offeringContext(auth) {
    let doc = document;
    let categories = categoriesFrom(doc);
    if (!categories.length) {
      const route = allocationRoute();
      if (!route)
        throw new Error(
          'Could not find the course-allocation link in your VTOP menu. Refresh VTOP and retry.'
        );
      doc = await post(route, {}, auth);
      categories = categoriesFrom(doc);
      if (!categories.length) {
        // Some VTOP views load their category dropdown after the default semester is selected.
        // Follow only a read endpoint named by that response; never evaluate its scripts.
        const term = termFrom(doc);
        const script = [...doc.querySelectorAll('script')].map(item => item.textContent).join('\n');
        const route = [...script.matchAll(/["'](academics\/[a-z0-9/_-]+)["']/gi)]
          .map(match => match[1])
          .find(
            path =>
              /\/get[^/]*(?:curricul|categor)/i.test(path) &&
              !/getCoursesListForCurriculmCategory/i.test(path)
          );
        if (route && term.name && term.value) {
          const fragment = await post(route, { [term.name]: term.value }, auth);
          categories = categoriesFrom(fragment);
        }
      }
    }
    if (!categories.length)
      throw new Error(
        'VTOP is not showing course offerings for your account right now. Use Retry when they are available.'
      );
    const semester = termFrom(doc);
    const key = JSON.stringify([
      auth.authorizedID,
      semester.value,
      categories.map(item => item.code).sort(),
    ]);
    return { categories, semester, key };
  }
  async function hash(value) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  async function capture() {
    if (running) throw new Error('Capture is already running.');
    const auth = session();
    if (!auth) throw new Error('Log in to VTOP first. Capture starts automatically after login.');
    running = true;
    attemptedSession = sessionKey(auth);
    let runId;
    let completed = 0;
    let total = 0;
    let stage = 'categories';
    const progress = () => message('VTOP_PROGRESS', { runId, completed, total, stage });
    showBanner('working', 'You are signed in. Finding your available courses…');
    try {
      const current = await offeringContext(auth);
      const catalogueId = await hash(current.key);
      ({ runId } = await message('VTOP_BEGIN', { contextKey: catalogueId }));
      const fields =
        current.semester.name && current.semester.value
          ? { [current.semester.name]: current.semester.value }
          : {};
      const read = async (endpoint, data) => {
        await progress();
        return post(`academics/common/${endpoint}`, { ...fields, ...data }, auth);
      };
      const lists = [];
      total = current.categories.length;
      for (const category of current.categories) {
        showBanner(
          'working',
          `Finding courses · category ${completed + 1} of ${total}`,
          completed,
          total
        );
        const doc = await read('getCoursesListForCurriculmCategory', { cccategory: category.code });
        const list = courses(doc);
        if (
          !doc.querySelector('select, option') &&
          !/no\s+(?:courses?|records?|data)/i.test(doc.body.textContent)
        )
          throw new Error('VTOP returned an unfamiliar course list. Retry to capture again.');
        lists.push({ category, courses: list });
        completed++;
      }
      const unique = new Map(
        lists.flatMap(list => list.courses.map(course => [course.code, course]))
      );
      stage = 'courses';
      total = unique.size;
      completed = 0;
      const details = new Map();
      for (const course of unique.values()) {
        showBanner(
          'working',
          `Fetching course ${completed + 1} of ${total} · ${course.code}`,
          completed,
          total
        );
        const doc = await read('getCoursesDetailForRegistration', { courseCode: course.code });
        const entries = sections(doc);
        if (
          !entries.length &&
          !/no\s+(?:courses?|records?|data|details?|slots?|facult(?:y|ies))|not\s+(?:offered|available)/i.test(
            doc.body.textContent
          )
        )
          throw new Error(
            `Could not read slots for ${course.code}. Retry to capture a complete catalogue.`
          );
        details.set(course.code, entries);
        completed++;
        await progress();
      }
      const categories = Object.create(null);
      for (const list of lists) {
        const group = Object.create(null);
        for (const course of list.courses)
          if (details.get(course.code)?.length) group[course.name] = details.get(course.code);
        if (Object.keys(group).length)
          categories[`${list.category.label} (${list.category.code})`] = group;
      }
      if (!Object.keys(categories).length)
        throw new Error(
          'No offered courses with slots were found. Retry when VTOP makes your courses available.'
        );
      checkSession(auth);
      await message('VTOP_COMMIT', {
        runId,
        dataset: {
          schemaVersion: 1,
          source: 'vtop',
          catalogueId,
          capturedAt: new Date().toISOString(),
          term: current.semester.label,
          categories,
        },
      });
      const count = new Set(Object.values(categories).flatMap(group => Object.keys(group))).size;
      showBanner('ready', `${count} courses saved in this browser. Your planner is ready to use.`);
      return { ok: true };
    } catch (error) {
      if (runId) await message('VTOP_FAIL', { runId, error: error.message }).catch(() => {});
      showBanner('error', error.message);
      throw error;
    } finally {
      running = false;
      schedule();
    }
  }
  chrome.runtime.onMessage.addListener((request, _sender, respond) => {
    if (request.type !== 'CAPTURE_NOW') return;
    if (running || !session()) {
      respond({
        ok: false,
        error: running
          ? 'Capture is already running.'
          : 'Log in to VTOP first. Courses are fetched automatically after login.',
      });
      return;
    }
    respond({ ok: true });
    void capture().catch(() => {});
  });
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const auth = session();
      if (!auth) {
        attemptedSession = '';
        return;
      }
      if (
        !running &&
        sessionKey(auth) !== attemptedSession &&
        (categoriesFrom(document).length || allocationRoute())
      )
        void capture().catch(() => {});
    }, 600);
  }
  new MutationObserver(records => {
    if (records.some(record => !banner?.host.contains(record.target))) schedule();
  }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('change', schedule);
  schedule();
})();
