// ESLint formatter that emits GitHub Actions annotations so a complexity or lint
// failure surfaces inline on the PR diff, naming the file, line, rule, and the
// rule's message (which for `complexity` includes the actual value and the
// threshold). Falls back to a readable summary so local runs are legible too.
// Usage: eslint ... -f ./scripts/eslint-gh-formatter.mjs
import { relative } from 'node:path';

// GitHub workflow-command escaping. Command data (the message after `::`) needs
// %, CR, and LF encoded; property values (file=, title=) additionally need `,`
// and `:`. Applied to the file path and rule id, which are untrusted — a path
// with an embedded newline could otherwise forge a `::error`/`::add-mask`/... on
// its own stdout line, which the runner parses as a real workflow command.
const escapeData = (s) =>
  String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProp = (s) => escapeData(s).replace(/:/g, '%3A').replace(/,/g, '%2C');

export default function githubFormatter(results) {
  const lines = [];
  let errors = 0;
  let warnings = 0;

  for (const result of results) {
    // Annotations map to the PR diff only with a repo-root-relative path.
    const file = relative(process.cwd(), result.filePath);
    for (const m of result.messages) {
      const severity = m.severity === 2 ? 'error' : 'warning';
      if (m.severity === 2) errors++;
      else warnings++;
      const rule = m.ruleId ?? 'eslint';
      const msg = escapeData(m.message);
      lines.push(
        `::${severity} file=${escapeProp(file)},line=${m.line ?? 1},col=${m.column ?? 1},title=${escapeProp(rule)}::${msg}`,
      );
      // Escape the path here too: this line also reaches CI stdout, where a raw
      // newline in the path would start its own `::` command.
      lines.push(`  ${severity} ${escapeData(file)}:${m.line}:${m.column}  ${m.message}  (${rule})`);
    }
  }

  if (errors + warnings === 0) {
    lines.push('ESLint: no complexity or lint violations.');
  } else {
    lines.push(`\nESLint found ${errors} error(s) and ${warnings} warning(s).`);
  }
  return lines.join('\n') + '\n';
}
