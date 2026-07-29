import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import githubFormatter from '../scripts/eslint-gh-formatter.mjs';

const cwd = process.cwd();

// The formatter takes ESLint's results shape; filePath is absolute in real runs,
// so build it from cwd to keep the repo-relative output deterministic.
const result = (relPath: string, messages: unknown[]) => ({
  filePath: join(cwd, relPath),
  messages,
});
const message = (over: Record<string, unknown> = {}) => ({
  severity: 2,
  ruleId: 'complexity',
  message: 'too complex',
  line: 3,
  column: 5,
  ...over,
});

describe('githubFormatter', () => {
  it('emits a GitHub Actions annotation naming file, line, col, rule, and message', () => {
    const out = githubFormatter([result('src/lib/x.ts', [message()])]);
    expect(out).toContain('::error file=src/lib/x.ts,line=3,col=5,title=complexity::too complex');
  });

  it('escapes %, CR, and LF in the annotation message (command data)', () => {
    const out = githubFormatter([result('src/x.ts', [message({ message: 'a%b\r\nc' })])]);
    expect(out).toContain('::a%25b%0D%0Ac');
  });

  it('escapes a newline in the file path so it cannot forge a workflow command', () => {
    // A committed file whose path contains a newline: without escaping, the raw
    // "\n::error::PWNED" would be parsed by the runner as its own command.
    const out = githubFormatter([result('scripts/evil\n::error::PWNED.mjs', [message()])]);
    expect(out).not.toContain('\n::error::PWNED');
    expect(out).toContain('file=scripts/evil%0A%3A%3Aerror%3A%3APWNED.mjs');
  });

  it('escapes comma and colon in property values (file and rule)', () => {
    const out = githubFormatter([
      result('a,b:c.ts', [message({ ruleId: 'plugin/rule:x,y' })]),
    ]);
    expect(out).toContain('file=a%2Cb%3Ac.ts');
    expect(out).toContain('title=plugin/rule%3Ax%2Cy');
  });

  it('neutralizes a path newline on the human-readable fallback line too', () => {
    const out = githubFormatter([result('scripts/evil\n::warning::PWNED.mjs', [message()])]);
    // No stdout line may begin with an injected "::" command.
    expect(out.split('\n').some((l) => l.startsWith('::warning::PWNED'))).toBe(false);
  });

  it('leaves a normal path legible on the fallback line', () => {
    const out = githubFormatter([result('src/lib/x.ts', [message()])]);
    expect(out).toContain('  error src/lib/x.ts:3:5  too complex  (complexity)');
  });

  it('reports a clean summary when there are no messages', () => {
    expect(githubFormatter([result('src/x.ts', [])])).toContain(
      'no complexity or lint violations',
    );
  });
});
