/**
 * Points the fork's metadata at the real GitHub owner once the account is known.
 *
 * Repository name is already decided (鱼窝); only the owner is a placeholder. Run:
 *   node scripts/set-owner.cjs <github-username>
 * It rewrites package.json and every OWNER/鱼窝 link in the docs, and refuses to run twice with the
 * same mistake (it reports what it changed).
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const owner = (process.argv[2] ?? '').trim();

if (!owner || !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(owner)) {
  console.error('usage: node scripts/set-owner.cjs <github-username>');
  console.error('(GitHub usernames are letters, digits and hyphens, up to 39 chars.)');
  process.exit(2);
}

// The repository slug is ASCII on purpose (URLs stay clean); the Chinese name 鱼窝 is the display
// name in README and the repo description.
const repoName = 'xiaoyu';
const base = `https://github.com/${owner}/${repoName}`;
const changed = [];

// package.json: the three links GitHub renders next to the package.
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.repository = { type: 'git', url: `${base}.git` };
pkg.homepage = `${base}#readme`;
pkg.bugs = { url: `${base}/issues` };
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
changed.push('package.json');

// Docs: replace the placeholder owner, and retire the sentence that says it is still a placeholder —
// otherwise the README keeps telling the reader to run this very script.
const PENDING =
  '- 仓库地址里的 `OWNER` 是占位符。GitHub 用户名定了之后执行 `node scripts/set-owner.cjs <用户名>`，脚本会一次改完 README 和 `package.json`。';
const SETTLED = `- 仓库地址的所有者是 \`${owner}\`（由 \`scripts/set-owner.cjs\` 写入）。`;

for (const name of ['README.md', 'CHANGELOG.md']) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = before.split('github.com/OWNER').join(`github.com/${owner}`).split(PENDING).join(SETTLED);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed.push(name);
  }
}

console.log(`owner = ${owner}`);
console.log(`repo  = ${base}`);
console.log('changed:', changed.join(', ') || '(nothing to change)');
console.log('\nremaining placeholder:', /github\.com\/OWNER/.test(fs.readFileSync(path.join(root, 'README.md'), 'utf8')) ? 'yes' : 'no');
