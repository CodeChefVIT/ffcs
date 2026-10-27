# FFCS Contributors - standalone VTOP exporter

This is a separate contributor/admin extension. It does not need the personal My VTOP extension or a running FFCS-inator app.

## Install and export

1. Download `FFCS-Contributors.zip`, extract it, and load the extracted folder through Chrome/Edge Extensions > Developer mode > Load unpacked. Select the folder containing `manifest.json`.
2. Refresh VTOP after installing, then log in normally at https://vtop.vit.ac.in/vtop/.
3. Click the extension's toolbar action to open the contributor page. Choose the signed-in VTOP tab and click **Connect to VTOP**. The tool reads the allocation view in the background; you do not have to navigate there.
4. Choose the matching repository branch/batch folder. Review each available category's destination file. Recognized categories are suggested automatically; choose a file for unmatched categories or uncheck them. Each selected category needs a different file.
5. Click **Fetch & download ZIP**. Progress shows category/course requests. Keep the VTOP tab open until capture finishes. The contributor page can be closed and reopened; a completed export can be downloaded using **Download ZIP again**.
6. Extract the downloaded **data ZIP over this existing repository root**, so its `src/data/<folder>/...` paths replace the selected data files. Review the diff before contributing it.

## Exact repository format

The extension ships a catalogue generated from the current `src/data/*/index.ts` imports and exports. It preserves folder names, filenames, named export identifiers and category labels, including existing spellings such as `DiscliplineCore.ts`. For example, `SCOPE_F/FCON.ts` correctly exports `CON`.

A data archive contains:

```text
src/data/<selected-folder>/<selected-category>.ts
src/data/<selected-folder>/index.ts     # existing source, unchanged; optional
```

Category files use the existing structure:

```ts
export const UCC = {
  'BCSE202L - Data Structures': [{ slot: 'B1+TB1', venue: 'SJT522', faculty: 'FACULTY NAME' }],
};
```

Apostrophes, backslashes, Unicode and line breaks are escaped as TypeScript strings. NIL/project slots and theory/lab sections are retained. Duplicate identical rows are deduplicated. The layout and exported values match the repository format; formatting is generated and is not intended to be a byte-for-byte copy of old course data.

The archive is a **drop-in update for the existing repository**, not a full standalone replacement for all branch folders. Only selected categories are fetched and refreshed. The optional `index.ts` is copied unchanged from this repository; its other imports continue using files already in your data folder. Existing `faculty.ts`, FAQ data and unselected branch/category files are not replaced. A category with no offered course sections produces an empty exported object, reflecting VTOP's current availability.

The empty `MTech_SCORE` index has no configured category files and is shown disabled rather than inventing a new layout. Repackage the extension after adding or changing repository folders/index mappings.

## Scope, storage and cancellation

Selecting a folder chooses a destination for contributions; it does not impersonate another VTOP account or unlock all branches. Only categories offered to the selected signed-in account are requested. To collect another branch, use a legitimate session for that branch and export its matching folder. The VTOP account/semester/category scope is checked again when fetching starts, and account changes interrupt the capture.

All requests use the browser's existing VTOP session on the VTOP origin. No passwords, cookies, CSRF tokens, raw registration IDs, fetched HTML or executed remote scripts are saved or exported. No registration/enrolment operation runs, and no app/server upload occurs.

The last complete export and progress are stored in extension-local storage so the contributor page can be reopened. **Clear captured data** removes this local result and session metadata. Already-downloaded files stay in your browser's Downloads folder. **Cancel capture** stops the job and does not produce a partial ZIP. Failed requests, expired sessions, closed VTOP tabs and unrecognized responses produce an error rather than a successful partial export.

Only the extension's contributor page can start jobs or read output. VTOP content scripts can report progress/results only for the assigned tab and active job. The manifest requests VTOP-only site access, local storage and downloads; it has no FFCS/Perry app bridge.

## Build and verify

From the repository root:

```bash
npm run contributors:package
npm run contributors:test
```

The package command regenerates `catalogue.json` from repository indexes, copies the course HTML parser into this standalone bundle and rebuilds `public/extentions/FFCS-Contributors/FFCS-Contributors.zip`. The extension ZIP has `manifest.json` at its root. Course ZIPs have `src/data/...` at their root.

Automated tests cover repository naming, compilable exports, ZIP CRC/UTF-8 paths/content, contributor-only message access, capture/cancellation, and browser fixtures of signed-in VTOP. Private VTOP HTML can change independently; a live account smoke test is still needed after installation.
