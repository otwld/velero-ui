// Run from the repository root: node kubernetes/chart/tests/security.test.cjs
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { resolve } = require('node:path');
const { parseAllDocuments } = require('yaml');

const chart = resolve(__dirname, '..');
const render = (...args) =>
  parseAllDocuments(
    execFileSync('helm', ['template', 'security-test', chart, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  )
    .map((doc) => doc.toJSON())
    .filter(Boolean);
const container = (docs) =>
  docs.find((doc) => doc.kind === 'Deployment').spec.template.spec
    .containers[0];
const secret = 'security-test-only-random-key-placeholder';

assert.throws(() => render(), /secretPassPhrase/);
const created = render(
  '--set',
  `configuration.general.secretPassPhrase.value=${secret}`
);
const signingSecret = created.find((doc) => doc.kind === 'Secret');
assert.equal(
  Buffer.from(signingSecret.data.pass_phrase, 'base64').toString(),
  secret
);
assert.deepEqual(
  container(created).env.find((env) => env.name === 'AUTH_SECRET_PASSPHRASE')
    .valueFrom.secretKeyRef,
  {
    name: signingSecret.metadata.name,
    key: 'pass_phrase',
  }
);
assert(!container(created).env.some((env) => env.name === 'POLICY_FILE_PATH'));

const existing = render(
  '--set',
  'configuration.general.secretPassPhrase.existingSecret=external-key',
  '--set',
  'configuration.general.secretPassPhrase.key=jwt',
  '--set',
  'configuration.policies.enabled=true'
);
assert(!existing.some((doc) => doc.kind === 'Secret'));
assert.deepEqual(
  container(existing).env.find((env) => env.name === 'AUTH_SECRET_PASSPHRASE')
    .valueFrom.secretKeyRef,
  {
    name: 'external-key',
    key: 'jwt',
  }
);
assert(container(existing).env.some((env) => env.name === 'POLICY_FILE_PATH'));

const direct = render(
  '--set',
  'configuration.general.secretPassPhrase.useSecret=false',
  '--set',
  `configuration.general.secretPassPhrase.value=${secret}`
);
assert.equal(
  container(direct).env.find((env) => env.name === 'AUTH_SECRET_PASSPHRASE')
    .value,
  secret
);
assert(!direct.some((doc) => doc.kind === 'Secret'));
console.log('Helm security checks passed');
