-- Finanças pessoais dos apps Inari (raposa) e Snowbobão (as contas da Iara Loren).
-- Uma linha por chave de dados (fin:txs, fin:cats…) por app e por pessoa.
create table if not exists public.financas_kv (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  app text not null check (app in ('inari', 'snowbobao')),
  chave text not null,
  valor jsonb not null,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, app, chave)
);
alter table public.financas_kv enable row level security;
drop policy if exists "financas: dono lê" on public.financas_kv;
drop policy if exists "financas: dono insere" on public.financas_kv;
drop policy if exists "financas: dono altera" on public.financas_kv;
drop policy if exists "financas: dono apaga" on public.financas_kv;
create policy "financas: dono lê" on public.financas_kv for select to authenticated using (user_id = (select auth.uid()));
create policy "financas: dono insere" on public.financas_kv for insert to authenticated with check (user_id = (select auth.uid()));
create policy "financas: dono altera" on public.financas_kv for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "financas: dono apaga" on public.financas_kv for delete to authenticated using (user_id = (select auth.uid()));
revoke all on public.financas_kv from anon;
grant select, insert, update, delete on public.financas_kv to authenticated;
select count(*) as politicas from pg_policies where tablename = 'financas_kv';
