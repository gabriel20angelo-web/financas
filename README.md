# Finanças: Inari e Livro-caixa

O módulo Finanças do antigo Meu Consultório (repo `psicoterapeutas`, apagado no
commit `3cfabc8`), separado em dois apps com o mesmo código:

- **Inari** (`/financas/inari/`): a identidade da Raposa Analítica (floresta da kitsune).
- **Livro-caixa** (`/financas/livro-caixa/`): a identidade do Clube de Literatura Entrelinhas (o frajola e as cartinhas).

Cada app tem os próprios dados. Sem conta, tudo fica no aparelho; com a conta
(a mesma do painel da Raposa), os dados vão para a tabela `financas_kv` do banco
da Raposa e aparecem iguais no celular e no computador.

## Onde mexer

- `src/lib/tema.ts`: o que muda entre os dois (nome, figuras, paletas, textos).
- `src/app/globals.css`: as cores de cada um, por `[data-app]`.
- `src/lib/sync.ts`: aparelho ⇄ banco.
- `src/components/financas/`: o Finanças antigo (só trocadas as cores fixas por papéis do tema).
- `supabase/financas_kv.sql`: a tabela e as regras (cada pessoa só vê as próprias linhas).
- `scripts/assets.py` e `scripts/papeis.py`: figuras e texturas, tiradas dos bancos de cada identidade.

## Rodar

    npm run dev:inari          # http://localhost:3021
    npm run dev:livro-caixa    # http://localhost:3022
    npm run build              # gera site/ com os dois e a página de entrada

Publicar: `npm run publicar` (gera site/ e envia para o ramo gh-pages, que o GitHub Pages serve).
