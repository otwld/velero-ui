import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

const require = createRequire(new URL('../package.json', import.meta.url));

// Exercise the copies actually loaded by the affected dependency chains.
const editorRequire = createRequire(require.resolve('launch-editor'));
const { quote } = editorRequire('shell-quote');
const docsRequire = createRequire(
  require.resolve('@docusaurus/core/package.json')
);
const { default: Tinypool } = await import(
  pathToFileURL(docsRequire.resolve('tinypool')).href
);

test('shell-quote rejects line terminators following a comment token', () => {
  // GHSA-pqg4-j6r4-53mv: the newline must not escape the shell comment.
  for (const separator of ['\n', '\r', '\u2028', '\u2029']) {
    assert.throws(
      () =>
        quote([
          'echo',
          'safe',
          { comment: 'comment' },
          `argument${separator}echo injected`,
        ]),
      TypeError
    );
  }
  assert.equal(quote(['echo', 'safe argument']), "echo 'safe argument'");
});

test('tinypool ignores an inherited worker filename in run options', async (t) => {
  // GHSA-85c8-ppgw-ccpr: a polluted prototype must not select another worker.
  const directory = await mkdtemp(join(tmpdir(), 'velero-tinypool-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const legitimate = join(directory, 'legitimate.cjs');
  const redirected = join(directory, 'redirected.cjs');
  await writeFile(
    legitimate,
    'module.exports = (task) => ({ worker: "legitimate", task });'
  );
  await writeFile(
    redirected,
    'module.exports = (task) => ({ worker: "redirected", task });'
  );
  const pool = new Tinypool({
    filename: legitimate,
    minThreads: 1,
    maxThreads: 1,
  });
  try {
    const options = Object.create({ filename: redirected });
    options.signal = new AbortController().signal;
    assert.deepEqual(await pool.run('payload', options), {
      worker: 'legitimate',
      task: 'payload',
    });
    assert.deepEqual(await pool.run('normal task'), {
      worker: 'legitimate',
      task: 'normal task',
    });
  } finally {
    await pool.destroy();
  }
});

const mergeConsumers = [
  '@rollup/plugin-node-resolve',
  '@svgr/plugin-svgo',
  'fork-ts-checker-webpack-plugin',
  'jest-config',
];
const mergeModules = new Set(
  mergeConsumers.map((name) =>
    createRequire(require.resolve(name)).resolve('deepmerge')
  )
);
mergeModules.add(
  join(dirname(require.resolve('deepmerge/package.json')), 'dist/umd.js')
);

for (const modulePath of mergeModules) {
  const merge = require(modulePath);
  test(`deepmerge keeps a plain prototype for untrusted keys (${modulePath})`, () => {
    // GHSA-gcqx-w48m-w2h4: both copying the target and merging into a null
    // prototype target must preserve __proto__ as data, never as a setter.
    const payload = JSON.parse('{"__proto__":{"injected":"marker"}}');
    for (const [result, keepsData] of [
      [merge(payload, {}), true],
      [merge(Object.create(null), payload), true],
      [merge([], [payload])[0], false],
    ]) {
      assert.equal(Object.getPrototypeOf(result), Object.prototype);
      assert.equal(result.injected, undefined);
      assert.equal(Object.hasOwn(result, '__proto__'), keepsData);
      if (keepsData) {
        assert.deepEqual(result.__proto__, { injected: 'marker' });
      }
    }
    assert.equal({}.injected, undefined);
  });

  test(`deepmerge preserves nested values, arrays, symbols and custom merging (${modulePath})`, () => {
    const key = Symbol('config');
    const date = new Date('2026-01-01T00:00:00Z');
    const target = { nested: { a: 1 }, values: [1], [key]: 'kept', date };
    const source = { nested: { b: 2 }, values: [2] };
    const result = merge(target, source);
    assert.deepEqual(result.nested, { a: 1, b: 2 });
    assert.deepEqual(result.values, [1, 2]);
    assert.equal(result[key], 'kept');
    assert.equal(result.date, date);
    assert.deepEqual(target.values, [1]);
    assert.deepEqual(merge.all([{ a: 1 }, { b: 2 }]), { a: 1, b: 2 });
    assert.deepEqual(
      merge(target, source, { arrayMerge: (_target, next) => next }).values,
      [2]
    );
  });
}
