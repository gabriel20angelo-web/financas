-- Cada conta de finanças pertence a UM app: o login do Inari (angelo) não
-- abre o Snowbobão, o da Iara (docinho) não abre o Inari. Vale no app (que
-- recusa a conta de outro app) e aqui no banco, onde a linha de financas_kv
-- só é vista e gravada se for do app da conta.
-- Conta nova de finanças: criar o usuário e pôr uma linha aqui.
create table if not exists public.financas_contas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  app text not null check (app in ('inari', 'snowbobao'))
);
alter table public.financas_contas enable row level security;
drop policy if exists "financas_contas: cada um vê a sua" on public.financas_contas;
create policy "financas_contas: cada um vê a sua" on public.financas_contas
  for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.financas_contas from anon, authenticated;
grant select on public.financas_contas to authenticated;

insert into public.financas_contas (user_id, app)
select id, case email when 'angelo@financas.lar' then 'inari' else 'snowbobao' end
from auth.users where email in ('angelo@financas.lar', 'docinho@financas.lar')
on conflict (user_id) do update set app = excluded.app;

-- financas_kv: além de ser o dono, a linha tem que ser do app da conta
drop policy if exists "financas: dono lê" on public.financas_kv;
drop policy if exists "financas: dono insere" on public.financas_kv;
drop policy if exists "financas: dono altera" on public.financas_kv;
drop policy if exists "financas: dono apaga" on public.financas_kv;
create policy "financas: dono lê" on public.financas_kv for select to authenticated
  using (user_id = (select auth.uid()) and app = (select c.app from public.financas_contas c where c.user_id = (select auth.uid())));
create policy "financas: dono insere" on public.financas_kv for insert to authenticated
  with check (user_id = (select auth.uid()) and app = (select c.app from public.financas_contas c where c.user_id = (select auth.uid())));
create policy "financas: dono altera" on public.financas_kv for update to authenticated
  using (user_id = (select auth.uid()) and app = (select c.app from public.financas_contas c where c.user_id = (select auth.uid())))
  with check (user_id = (select auth.uid()) and app = (select c.app from public.financas_contas c where c.user_id = (select auth.uid())));
create policy "financas: dono apaga" on public.financas_kv for delete to authenticated
  using (user_id = (select auth.uid()) and app = (select c.app from public.financas_contas c where c.user_id = (select auth.uid())));

select u.email, c.app from public.financas_contas c join auth.users u on u.id = c.user_id order by 2;
