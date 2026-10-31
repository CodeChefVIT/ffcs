# FFCS Contributors

Standalone VTOP course-data exporter. It does not need the personal My VTOP extension or a running FFCS-inator app.

## Use

1. Download `public/extensions/FFCS-Contributors.zip`, extract it, and load its folder through Chrome/Edge Extensions > Developer mode > Load unpacked. When upgrading, replace the extracted files and reload the extension.
2. Refresh VTOP after installation and log in normally. Click the extension toolbar action to open FFCS Contributors.
3. Choose the signed-in VTOP tab and click **Connect to VTOP**. The allocation view is fetched in the background.
4. Choose your **School** and enter your **Branch** (for example SCOPE and BCI).
5. Click **Fetch & download ZIP**. Every category offered by VTOP is included automatically. Keep VTOP open until capture finishes.

There are no repository-file mappings or category selection checkboxes. The category list is a read-only preview. Your school and branch identify the export; they do not change the account's available courses.

## Files

Category filenames and exported constants use VTOP's category codes. For SCOPE / BCI:

```text
src/data/SCOPE/BCI/FC.ts
src/data/SCOPE/BCI/DLES.ts
src/data/SCOPE/BCI/DC.ts
src/data/SCOPE/BCI/SPE.ts
src/data/SCOPE/BCI/PI.ts
src/data/SCOPE/BCI/OE.ts
src/data/SCOPE/BCI/BC.ts
src/data/SCOPE/BCI/NGCR.ts
src/data/SCOPE/BCI/index.ts
```

Each file keeps the course data format:

```ts
export const FC = {
  'BCSE202L - Data Structures': [{ slot: 'B1+TB1', venue: 'SJT522', faculty: 'FACULTY NAME' }],
};
```

`index.ts` is generated to import these category files and export `SCOPE_BCI`, with VTOP category codes as keys. It is not copied from the legacy repository index. This category-based layout follows school/branch folders; it does not replace legacy `FoundationCore.ts` files automatically. Import the generated branch index where needed when integrating the data into the app.

School and branch folder names are uppercase; spaces and hyphens become underscores. A category with no offered sections still gets a file exporting an empty object. NIL/project slots, theory/lab rows, Unicode and escaped apostrophes are supported. Identical rows are deduplicated.

## Capture and privacy

All courses are read from the selected signed-in account. No other branches/accounts are enumerated. The account, semester and available category scope are checked again when a fetch begins, and account changes interrupt the job.

Password, cookie, CSRF token, raw registration ID and fetched HTML are not persisted or included in the ZIP. Requests use the browser's VTOP session and the downloader's read endpoints; no course enrolment or app/server upload occurs.

The latest complete export and progress use extension-local storage. You can close and reopen the contributor page and use **Download ZIP again**. **Clear captured data** removes stored results and session metadata; downloaded files remain in Downloads. **Cancel capture**, failed sessions and closed VTOP tabs do not produce partial ZIPs. Updating from the old file-mapping version clears its stored jobs/settings so they cannot be mistaken for the new export format.

Only the contributor page can start jobs or download output. VTOP content scripts can report results only for the assigned active tab/job. Site access is limited to VTOP, plus local storage/download permissions. This extension has no FFCS/Perry app bridge.

## Development

```bash
npm run contributors:package
npm run contributors:test
```

Source: `extension/FFCS-Contributors`. Download: `public/extensions/FFCS-Contributors.zip`.

Packaging regenerates the school list from the repository's data folders and bundles the parser. Tests cover category-based exports, index imports, TypeScript string escaping, ZIP contents, origin/job boundaries, cancellation and the complete browser fetch/download flow using VTOP fixtures. A private signed-in VTOP smoke test is still needed after installation.
