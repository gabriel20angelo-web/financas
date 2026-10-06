// Publica no GitHub Pages: gera site/ e manda para o ramo gh-pages (o Pages
// serve esse ramo). Sem Actions, porque a conta do GitHub daqui não tem a
// permissão de gravar arquivo de workflow.
//   npm run publicar
import { execSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';

const sh = (cmd, cwd = '.') => execSync(cmd, { cwd, stdio: 'inherit' });
const sai = (cmd, cwd = '.') => execSync(cmd, { cwd }).toString().trim();
const origem = sai('git remote get-url origin');
const versao = sai('git rev-parse --short HEAD');
const autor = ['-c', 'user.name=gabriel20angelo-web', '-c', 'user.email=gabriel_20angelo@hotmail.com'].join(' ');

sh('npm run build');

const DIR = '.publicar';
if (!existsSync(DIR)) {
  const temRamo = sai(`git ls-remote --heads ${origem} gh-pages`).length > 0;
  if (temRamo) sh(`git clone --quiet --branch gh-pages --single-branch ${origem} ${DIR}`);
  else {
    sh(`git init --quiet ${DIR}`);
    sh('git checkout --quiet -b gh-pages', DIR);
    sh(`git remote add origin ${origem}`, DIR);
  }
} else {
  sh('git pull --quiet --ff-only origin gh-pages', DIR);
}

for (const f of readdirSync(DIR)) if (f !== '.git') rmSync(`${DIR}/${f}`, { recursive: true, force: true });
cpSync('site', DIR, { recursive: true });
sh('git add -A', DIR);
if (sai('git status --porcelain', DIR)) {
  sh(`git ${autor} commit --quiet -m "publica ${versao}"`, DIR);
  sh('git push --quiet -u origin gh-pages', DIR);
  console.log(`publicado: ${versao}`);
} else console.log('nada mudou no site');
