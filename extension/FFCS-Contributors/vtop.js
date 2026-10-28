/* global chrome */
(() => {
  const { clean, courses, sections } = globalThis.FFCSVtopParser;
  const CATEGORY = 'select#cccategory, select[name="cccategory"]';
  const TERM =
    'select#semesterSubId, select[name="semesterSubId"], select#semesterId, select[name="semesterId"], input#semesterSubId, input[name="semesterSubId"], input#semesterId, input[name="semesterId"]';
  let running = null;
  let inspecting = false;
  function session() {
    const csrf =
      document.querySelector('input[name="_csrf"]')?.value ||
      document.querySelector('meta[name="_csrf"]')?.content;
    const authorizedID = document.querySelector(
      'input#authorizedID, input[name="authorizedID"]'
    )?.value;
    if (!csrf || !authorizedID) throw new Error('Log in to VTOP in this tab, then reconnect.');
    return { csrf, authorizedID };
  }
  function check(auth, controller) {
    if (controller.signal.aborted)
      throw new Error('Capture was cancelled or the VTOP request timed out.');
    if (session().authorizedID !== auth.authorizedID)
      throw new Error('The VTOP account changed. Reconnect before exporting.');
  }
  async function post(route, fields, auth, controller) {
    check(auth, controller);
    if (!/^academics\/[a-z0-9/_-]+$/i.test(route)) throw new Error('Unsupported VTOP course view.');
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(`/vtop/${route}`, {
        method: 'POST',
        credentials: 'same-origin',
        signal: controller.signal,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: new URLSearchParams({
          _csrf: session().csrf,
          authorizedID: auth.authorizedID,
          x: new Date().toUTCString(),
          ...fields,
        }),
      });
      if (!response.ok)
        throw new Error(`VTOP returned HTTP ${response.status}. Reconnect and try again.`);
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (
        doc.querySelector('input[type="password"], input[name="captchaStr"]') ||
        /session\s+(?:has\s+)?expired|invalid csrf|access denied|not authorized/i.test(
          doc.body.textContent
        )
      )
        throw new Error('Your VTOP session expired or access was denied. Log in again.');
      check(auth, controller);
      await new Promise(resolve => setTimeout(resolve, 150));
      return doc;
    } finally {
      clearTimeout(timeout);
    }
  }
  function categoriesFrom(doc) {
    const field =
      doc.querySelector(CATEGORY) ||
      [...doc.querySelectorAll('select')].find(item =>
        /curricul.*category|category.*curricul/i.test(item.id + item.name)
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
  function termFrom(doc) {
    const field = doc.querySelector(TERM);
    if (!field) return { name: '', value: '', label: '' };
    if (field.tagName !== 'SELECT')
      return { name: field.name || field.id, value: field.value, label: field.value };
    const options = [...field.options].filter(
      option =>
        !option.disabled &&
        !option.hidden &&
        clean(option.value) &&
        !/^(0|-1)$/.test(option.value) &&
        !/^select\b/i.test(clean(option.textContent))
    );
    const option =
      options.find(item => item.value === field.value) ||
      options.find(item => /\bcurrent\b/i.test(item.textContent)) ||
      options[0];
    return {
      name: field.name || field.id,
      value: option?.value || '',
      label: clean(option?.textContent),
    };
  }
  function allocationRoute() {
    for (const item of document.querySelectorAll('[data-url], a[href], [onclick]')) {
      const raw = [
        item.getAttribute('data-url'),
        item.getAttribute('href'),
        item.getAttribute('onclick'),
      ]
        .filter(Boolean)
        .join(' ');
      if (
        !/course\s*(?:registration\s*)?allocation|course\s*offering/i.test(
          clean(item.textContent)
        ) &&
        !/course\w*allocation|registration\w*allocation/i.test(raw)
      )
        continue;
      const route = raw.match(/(?:\/vtop\/)?(academics\/[a-z0-9/_-]+)/i)?.[1];
      if (route) return route;
    }
    throw new Error(
      'The course-allocation menu is unavailable in this VTOP session. Refresh VTOP and reconnect.'
    );
  }
  async function context(auth, controller) {
    let doc = document,
      categories = categoriesFrom(doc);
    if (!categories.length) {
      doc = await post(allocationRoute(), {}, auth, controller);
      categories = categoriesFrom(doc);
      if (!categories.length) {
        const term = termFrom(doc);
        const scripts = [...doc.querySelectorAll('script')]
          .map(item => item.textContent)
          .join('\n');
        const route = [...scripts.matchAll(/["'](?:\/vtop\/)?(academics\/[a-z0-9/_-]+)["']/gi)]
          .map(match => match[1])
          .find(
            path =>
              /\/get[^/]*(?:curricul|categor)/i.test(path) &&
              !/getCoursesListForCurriculmCategory/i.test(path)
          );
        if (route && term.name && term.value)
          categories = categoriesFrom(
            await post(route, { [term.name]: term.value }, auth, controller)
          );
      }
    }
    if (!categories.length)
      throw new Error('VTOP is not showing course offerings for this account right now.');
    const semester = termFrom(doc);
    const bytes = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(
        JSON.stringify([
          auth.authorizedID,
          semester.value,
          categories.map(item => item.code).sort(),
        ])
      )
    );
    const contextKey = [...new Uint8Array(bytes)]
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    return { categories, semester, contextKey };
  }
  async function inspect() {
    if (running || inspecting) throw new Error('Wait for the current VTOP request to finish.');
    inspecting = true;
    try {
      const current = await context(session(), new AbortController());
      return {
        categories: current.categories,
        term: current.semester.label,
        contextKey: current.contextKey,
      };
    } finally {
      inspecting = false;
    }
  }
  async function notify(type, data) {
    const result = await chrome.runtime.sendMessage({ type, ...data });
    if (!result?.ok)
      throw new Error(result?.error || 'The export was stopped. Reconnect and retry.');
  }
  async function capture(request) {
    const controller = new AbortController();
    running = { id: request.jobId, controller };
    const update = (stage, completed, total, detail) =>
      notify('ADMIN_PROGRESS', { jobId: request.jobId, stage, completed, total, detail });
    try {
      const auth = session();
      await update('preparing', 0, 0, 'Checking the signed-in VTOP session');
      const current = await context(auth, controller);
      if (current.contextKey !== request.contextKey)
        throw new Error(
          'The VTOP account, semester or available categories changed. Reconnect before exporting.'
        );
      if (
        !Array.isArray(request.codes) ||
        !request.codes.length ||
        request.codes.some(code => !current.categories.some(item => item.code === code))
      )
        throw new Error('A selected category is no longer available. Reconnect.');
      const fields =
        current.semester.name && current.semester.value
          ? { [current.semester.name]: current.semester.value }
          : {};
      const lists = [];
      for (const code of request.codes) {
        await update('categories', lists.length, request.codes.length, `Reading ${code}`);
        const doc = await post(
          'academics/common/getCoursesListForCurriculmCategory',
          { ...fields, cccategory: code },
          auth,
          controller
        );
        if (
          !doc.querySelector('select, option') &&
          !/no\s+(?:courses?|records?|data)/i.test(doc.body.textContent)
        )
          throw new Error(`Unrecognized course list for ${code}. No files were exported.`);
        lists.push({ code, courses: courses(doc) });
      }
      const unique = new Map(
          lists.flatMap(list => list.courses.map(course => [course.code, course]))
        ),
        details = new Map();
      for (const course of unique.values()) {
        await update('courses', details.size, unique.size, `Fetching ${course.code}`);
        const doc = await post(
          'academics/common/getCoursesDetailForRegistration',
          { ...fields, courseCode: course.code },
          auth,
          controller
        );
        const rows = sections(doc);
        if (
          !rows.length &&
          !/no\s+(?:courses?|records?|data|details?|slots?|facult(?:y|ies))|not\s+(?:offered|available)/i.test(
            doc.body.textContent
          )
        )
          throw new Error(`Unrecognized slots for ${course.code}. No files were exported.`);
        details.set(course.code, rows);
      }
      const groups = Object.create(null);
      for (const list of lists) {
        const group = Object.create(null);
        for (const course of list.courses)
          if (details.get(course.code)?.length) group[course.name] = details.get(course.code);
        groups[list.code] = group;
      }
      check(auth, controller);
      await update('courses', unique.size, unique.size, 'Preparing repository files');
      await notify('ADMIN_COMPLETE', { jobId: request.jobId, groups });
    } catch (error) {
      await notify('ADMIN_FAILED', {
        jobId: request.jobId,
        error: controller.signal.aborted
          ? 'Capture cancelled or VTOP timed out. No partial ZIP was created.'
          : error.message,
      }).catch(() => {});
    } finally {
      running = null;
    }
  }
  chrome.runtime.onMessage.addListener((request, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (request.type === 'ADMIN_INSPECT') {
      inspect().then(
        data => respond({ ok: true, ...data }),
        error => respond({ ok: false, error: error.message })
      );
      return true;
    }
    if (request.type === 'ADMIN_CAPTURE') {
      if (running || inspecting) {
        respond({ ok: false, error: 'This VTOP tab is already busy.' });
        return;
      }
      respond({ ok: true });
      void capture(request);
    }
    if (request.type === 'ADMIN_CANCEL' && running?.id === request.jobId) {
      running.controller.abort();
      respond({ ok: true });
    }
  });
})();
