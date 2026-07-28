// ESLint formatter that emits GitHub Actions annotations so a complexity or lint
// failure surfaces inline on the PR diff, naming the file, line, rule, and the
// rule's message (which for `complexity` includes the actual value and the
// threshold). Falls back to a readable summary so local runs are legible too.
// Usage: eslint ... -f ./scripts/eslint-gh-formatter.mjs
import { relative } from 'node:path';

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
      // Escape per GitHub workflow-command rules (single-line messages here).
      const msg = String(m.message).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
      lines.push(
        `::${severity} file=${file},line=${m.line ?? 1},col=${m.column ?? 1},title=${rule}::${msg}`,
      );
      lines.push(`  ${severity} ${file}:${m.line}:${m.column}  ${m.message}  (${rule})`);
    }
  }

  if (errors + warnings === 0) {
    lines.push('ESLint: no complexity or lint violations.');
  } else {
    lines.push(`\nESLint found ${errors} error(s) and ${warnings} warning(s).`);
  }
  return lines.join('\n') + '\n';
}
