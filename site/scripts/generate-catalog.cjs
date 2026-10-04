const fs = require('node:fs');
const prettier = require('prettier');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'site/src/demos.tsx'), 'utf8');
const snippets = {};
const demoAst = ts.createSourceFile(
  'demos.tsx',
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const cases = [];
function visit(node) {
  if (ts.isCaseClause(node) && ts.isStringLiteral(node.expression)) {
    const statement = node.statements.find(ts.isReturnStatement);
    if (statement?.expression)
      cases.push([
        null,
        node.expression.text,
        statement.expression.getText(demoAst),
      ]);
  }
  ts.forEachChild(node, visit);
}
visit(demoAst);
if (cases.length !== 50)
  throw new Error(`Expected 50 demos, found ${cases.length}`);
for (const [, name, jsx] of cases) {
  const declarations = [];
  if (/\bid\b/.test(jsx)) declarations.push('const id = useId();');
  const states = {
    checked: ['false', 'setChecked'],
    value: ["'paper'", 'setValue'],
    input: ["''", 'setInput'],
    number: [name === 'Pagination' ? '1' : '40', 'setNumber'],
    open: ['false', 'setOpen'],
    date: ["''", 'setDate'],
    many: ['[]', 'setMany'],
  };
  for (const [v, [initial, setter]] of Object.entries(states)) {
    if (new RegExp(`\\b${v}\\b(?![=:])|\\b${setter}\\b`).test(jsx))
      declarations.push(
        `const [${v}, ${setter}] = useState${
          v === 'many' ? '<readonly string[]>' : ''
        }(${initial});`,
      );
  }
  if (jsx.includes('toast.')) declarations.push('const toast = W.useToast();');
  if (jsx.includes('options'))
    declarations.push(
      "const options = [{value: 'paper', label: 'Paper'}, {value: 'ink', label: 'Ink'}, {value: 'ember', label: 'Ember'}];",
    );
  snippets[name] = `${
    declarations.some(d => d.includes('useId') || d.includes('useState'))
      ? `import {${[
          declarations.some(d => d.includes('useId')) ? 'useId' : null,
          declarations.some(d => d.includes('useState')) ? 'useState' : null,
        ]
          .filter(Boolean)
          .join(', ')}} from 'react';\n`
      : ''
  }import * as W from 'woosign-system';\n\n// ThemeProvider와 ToastProvider 안에서 렌더링하세요.\nexport function Example() {\n${declarations
    .map(d => '  ' + d)
    .join('\n')}${declarations.length ? '\n' : ''}  return (${jsx
    .replace(/disabled={disabled}/g, 'disabled={false}')
    .replace('variant={variant}', 'variant="default"')});\n}`;
}
for (const key of Object.keys(snippets))
  snippets[key] = prettier.format(snippets[key], {
    parser: 'typescript',
    singleQuote: true,
  });
const props = {};
for (const name of Object.keys(snippets)) {
  const file = path.join(root, 'src/components', name, 'types.ts');
  const content = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  const list = [];
  for (const node of ast.statements) {
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.text === name + 'BaseProps'
    ) {
      for (const member of node.members) {
        if (!ts.isPropertySignature(member)) continue;
        const key = member.name.getText(ast).replace(/['"]/g, '');
        if (key === 'testID') continue;
        list.push({
          name: key,
          type: member.type?.getText(ast) || 'unknown',
          required: !member.questionToken,
          description: ts
            .getJSDocCommentsAndTags(member)
            .map(j => (typeof j.comment === 'string' ? j.comment : ''))
            .join(' '),
        });
      }
    }
  }
  props[name] = list;
}
props.Textarea = props.Input.filter(
  p => !['type', 'multiline'].includes(p.name),
);
fs.writeFileSync(
  path.join(root, 'site/src/catalog.json'),
  JSON.stringify({snippets, props}, null, 2) + '\n',
);
console.log(`Generated ${Object.keys(snippets).length} demos and API tables.`);
