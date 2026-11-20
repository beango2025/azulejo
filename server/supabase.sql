-- Azulejo cloud sync (Supabase / Postgres)
-- Run in Supabase SQL editor after creating the project.

create table if not exists public.azulejo_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.azulejo_progress enable row level security;
grant select, insert, update on public.azulejo_progress to authenticated;

drop policy if exists "azulejo_own_progress" on public.azulejo_progress;
create policy "azulejo_own_progress"
  on public.azulejo_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists azulejo_progress_updated_idx
  on public.azulejo_progress (updated_at desc);
