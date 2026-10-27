# FFCS-inator: My VTOP courses

Install in desktop Chrome or Edge:

1. In FFCS-inator, click the highlighted **My VTOP** button beside the branch buttons. If the extension is missing, an alert explains installation and provides the ZIP download.
2. Extract the ZIP. Open `chrome://extensions` (Edge: `edge://extensions`), enable **Developer mode**, click **Load unpacked**, and select the extracted folder containing `manifest.json`.
3. Refresh existing VTOP and FFCS-inator tabs. Use the same browser profile for both.
4. Log in at https://vtop.vit.ac.in/vtop/. Capture starts automatically when the signed-in session and course-allocation menu appear. You do not need to open the allocation page. Keep the VTOP tab open until capture finishes; you can continue viewing other VTOP pages during capture.
5. The VTOP banner shows category/course progress, then **Inator ready!** with **Go to Inator**. If capture fails, the banner explains the problem and offers **Retry**.
6. Click **My VTOP** in the updated app to use your personal categories and courses. All other branch buttons remain available. If capture is still running, the app shows progress and switches to My VTOP when it finishes while that modal remains open.

The app changes must be running locally or deployed before the production site can read the extension. The extension also supports localhost and 127.0.0.1 development servers. After upgrading this unpacked extension, click **Reload** in the browser's Extensions page and refresh VTOP and FFCS-inator.

This ZIP is an unpacked extension, not a Chrome Web Store listing. Mobile browsers without desktop extension support are not supported.

## Automatic capture and privacy

The extension detects the signed-in account/session fields and reads the course-allocation menu link from the authenticated dashboard. It fetches that view in the background to discover the account's available curriculum categories and default/current semester. It parses responses without inserting the view into the page or executing returned scripts. If a semester picker has no selection, it uses the option labelled current, otherwise the first available semester in VTOP's ordering.

It then uses the downloader's two read endpoints:

- `academics/common/getCoursesListForCurriculmCategory`
- `academics/common/getCoursesDetailForRegistration`

Only categories returned by that view are requested. The extension never enumerates branches or substitutes another account's ID. Course-detail requests run sequentially with a short delay. No course registration or enrolment action is performed.

Only course names/codes, slots, venues, faculty names, selected term label, capture time and a hashed account/term identifier are saved. Passwords, cookies, CSRF tokens and raw registration IDs are never persisted or sent to FFCS-inator. The browser sends its existing session cookie only to VTOP in same-origin requests.

The catalogue uses extension `chrome.storage.local`, never sync storage or an app API. FFCS-inator keeps a validated localStorage copy. An origin-checked content-script bridge connects the two; unpacked-extension IDs need no configuration. Changed accounts/terms replace the snapshot; earlier captures are never merged. A failed refresh preserves the last complete capture for that same context. There is no automatic retry loop.

Under the selected My VTOP button, use **Refresh My VTOP** to read the latest extension snapshot or **Delete VTOP data** to clear both copies and personal planner selections. The extension popup can retry or stop/delete a capture. If the extension was already uninstalled, clear this app's site storage to remove its retained local copy. Existing saved/shared timetables retain the app's explicit save/share behavior.

A capture is a snapshot, not a live seat-count feed. To fetch again while signed in, use the extension popup's **Sync from VTOP** or the banner's **Retry**. Keep only the VTOP account you intend to capture open during sync.

## Development and checks

Run `npm run extension:package` after extension changes to regenerate `public/extensions/ffcs-vtop.zip`. The manifest permits only VTOP Vellore, the production app, and localhost/127.0.0.1 development origins. For another app origin, update both the manifest's content-script matches and `background.js` APP_ORIGINS, repackage, and reload the extension.

`npm run extension:test` covers storage and origin boundaries, schema validation, the DOM parser, automatic login/dashboard capture, progress and readiness banners. Set `FFCS_TEST_APP_URL` to a running app URL to include the planner UI tests for branch preservation, installation detection, progress, personal selections and deletion. DOM tests use installed Chrome/Edge or `FFCS_TEST_BROWSER` and skip if no browser is found.

Project courses with `NIL` slots and course types absent from the legacy map are supported. Unrecognized responses stop capture instead of silently saving an incomplete catalogue. The authenticated menu/HTML can change independently of this repository; a live signed-in check is needed after installation.
