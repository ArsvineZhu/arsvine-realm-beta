import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const DISALLOWED_ROUTE_TEST_RE = /\.(?:test|spec)\.(?:ts|tsx|js|jsx)$/i;

function walk(dir: string, files: string[] = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

describe('pages route layout', () => {
  it('does not allow test files inside pages/', () => {
    const pagesDir = path.join(process.cwd(), 'pages');
    const offenders = walk(pagesDir)
      .map((file) => path.relative(process.cwd(), file).replaceAll('\\', '/'))
      .filter((file) => DISALLOWED_ROUTE_TEST_RE.test(file));

    expect(
      offenders,
      `Test files cannot live under pages/: ${offenders.join(', ') || 'none'}`,
    ).toEqual([]);
  });
});
