// Gera os dois apps (cada um com o seu basePath) e junta em site/:
//   site/inari/        → /financas/inari/
//   site/snowbobao/    → /financas/snowbobao/
//   site/index.html    → /financas/ (a porta para os dois)
//   site/livro-caixa/  → leva para o Snowbobão (o endereço antigo)
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const APPS = ['inari', 'snowbobao'];
rmSync('site', { recursive: true, force: true });
mkdirSync('site');

for (const app of APPS) {
  const dist = `.next-${app}`; // com output: 'export', o site estático sai na própria distDir
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', NEXT_PUBLIC_APP: app, NEXT_DIST: dist },
  });
  cpSync(dist, `site/${app}`, { recursive: true });
  // a pasta public/ entra inteira em cada build: tira as figuras do outro app
  for (const outro of APPS.filter((a) => a !== app)) rmSync(`site/${app}/${outro}`, { recursive: true, force: true });
}

writeFileSync('site/.nojekyll', '');
writeFileSync('site/index.html', `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Finanças</title>
<style>
  :root { color-scheme: light dark; --fundo: #EFE7D6; --tinta: #13211F; }
  @media (prefers-color-scheme: dark) { :root { --fundo: #0E0C0B; --tinta: #EEEAE0; } }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: var(--fundo); font-family: Georgia, serif; color: var(--tinta); }
  main { display: grid; gap: 18px; padding: 24px 16px; width: min(560px, 100%); box-sizing: border-box; }
  h1 { font-weight: 400; font-size: 20px; text-align: center; margin: 0 0 6px; letter-spacing: .04em; }
  a { display: flex; align-items: center; gap: 18px; padding: 18px; border-radius: 18px; text-decoration: none; box-shadow: 0 10px 24px -16px rgb(0 0 0 / .6); }
  a img { width: 72px; height: 72px; border-radius: 16px; flex: none; }
  a strong { display: block; font-size: 30px; font-weight: 400; }
  a span { font-size: 15px; opacity: .85; }
  .inari { background: #13211F; color: #F2EBDC; }
  .inari em { color: #D7A441; }
  .snow { background: #15100E; color: #F2E9DF; border-radius: 4px; outline: 1px solid rgb(224 168 103 / .35); outline-offset: -6px; }
  .snow em { color: #E0A867; }
</style>
</head>
<body>
<main>
  <h1>Qual livro de contas?</h1>
  <a class="inari" href="inari/"><img src="inari/inari/icone-192.png" alt=""><div><strong>Ina<em>ri</em></strong><span>as contas da raposa</span></div></a>
  <a class="snow" href="snowbobao/"><img src="snowbobao/snowbobao/icone-192.png" alt=""><div><strong>Snow<em>bobão</em></strong><span>as contas da Iara</span></div></a>
</main>
</body>
</html>
`);

// o endereço antigo do segundo app leva para o Snowbobão
mkdirSync('site/livro-caixa');
writeFileSync('site/livro-caixa/index.html', `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=../snowbobao/">
<script>location.replace('../snowbobao/' + location.search + location.hash)</script>
<title>Snowbobão</title></head>
<body><a href="../snowbobao/">Snowbobão</a></body></html>
`);
console.log('site/ pronto:', APPS.join(', '));
