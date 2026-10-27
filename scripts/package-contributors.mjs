import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public', 'extentions', 'FFCS-Contributors');
const dataRoot = path.join(root, 'src', 'data');
const exported = node =>
  node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
function parse(file) {
  return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}
const profiles = [];
for (const folder of fs
  .readdirSync(dataRoot, { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(item => item.name)
  .sort()) {
  const indexPath = path.join(dataRoot, folder, 'index.ts');
  if (!fs.existsSync(indexPath)) continue;
  const index = parse(indexPath),
    imports = new Map(),
    files = [];
  let symbol;
  for (const node of index.statements) {
    if (
      ts.isImportDeclaration(node) &&
      node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings)
    ) {
      for (const entry of node.importClause.namedBindings.elements)
        imports.set(entry.name.text, {
          symbol: entry.propertyName?.text || entry.name.text,
          module: node.moduleSpecifier.text,
        });
    }
  }
  for (const node of index.statements) {
    if (!ts.isVariableStatement(node) || !exported(node)) continue;
    for (const declaration of node.declarationList.declarations) {
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer))
        continue;
      if (symbol) throw new Error(`Multiple exported index objects in ${folder}`);
      symbol = declaration.name.getText(index);
      for (const property of declaration.initializer.properties) {
        if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.initializer))
          throw new Error(`Unsupported index property in ${folder}`);
        const imported = imports.get(property.initializer.text);
        if (!imported || !/^\.\/[A-Za-z0-9_]+$/.test(imported.module))
          throw new Error(`Unknown category import in ${folder}`);
        const file = imported.module.slice(2) + '.ts';
        const source = parse(path.join(dataRoot, folder, file));
        const hasExport = source.statements.some(
          statement =>
            ts.isVariableStatement(statement) &&
            exported(statement) &&
            statement.declarationList.declarations.some(
              item => item.name.getText(source) === imported.symbol
            )
        );
        if (!hasExport) throw new Error(`Export ${imported.symbol} not found in ${folder}/${file}`);
        if (files.some(entry => entry.file === file))
          throw new Error(`Duplicate category module in ${folder}`);
        files.push({
          file,
          symbol: imported.symbol,
          category: ts.isStringLiteral(property.name)
            ? property.name.text
            : property.name.getText(index),
        });
      }
    }
  }
  profiles.push({
    folder,
    symbol,
    label: folder,
    files,
    indexSource: fs.readFileSync(indexPath, 'utf8'),
  });
}
const faculty = parse(path.join(dataRoot, 'faculty.ts'));
for (const node of faculty.statements) {
  if (!ts.isVariableStatement(node)) continue;
  for (const declaration of node.declarationList.declarations) {
    if (
      declaration.name.getText(faculty) !== 'data' ||
      !ts.isObjectLiteralExpression(declaration.initializer)
    )
      continue;
    for (const property of declaration.initializer.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const profile = profiles.find(item => item.symbol === property.initializer.getText(faculty));
      if (profile)
        profile.label = ts.isStringLiteral(property.name)
          ? property.name.text
          : property.name.getText(faculty);
    }
  }
}
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(
  path.join(target, 'catalogue.json'),
  JSON.stringify({ schemaVersion: 1, profiles }, null, 2) + '\n'
);
fs.copyFileSync(path.join(root, 'extension', 'parser.js'), path.join(target, 'parser.js'));
const files = [
  'manifest.json',
  'background.js',
  'vtop.js',
  'parser.js',
  'exporter.js',
  'zip.js',
  'catalogue.json',
  'contributor.html',
  'contributor.css',
  'contributor.js',
  'README.md',
];
const sandbox = vm.createContext({ TextEncoder, Uint8Array, DataView });
vm.runInContext(fs.readFileSync(path.join(target, 'zip.js'), 'utf8'), sandbox);
const archive = sandbox.FFCSZip.createZip(
  files.map(name => ({ name, bytes: new Uint8Array(fs.readFileSync(path.join(target, name))) }))
);
fs.writeFileSync(path.join(target, 'FFCS-Contributors.zip'), archive);
console.log(
  `Packaged standalone contributor extension (${profiles.filter(profile => profile.files.length).length} configured folders, ${files.length} extension files).`
);
console.log('public/extentions/FFCS-Contributors/FFCS-Contributors.zip');
