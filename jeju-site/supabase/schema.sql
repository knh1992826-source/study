-- Supabase 대시보드 > SQL Editor 에 붙여넣고 [Run] 하세요.
-- 회원가입/로그인(Auth)은 Supabase 가 기본으로 제공하므로 테이블이 필요 없어요.
-- 아래는 "내가 찜한 이미지"를 저장하는 favorites 테이블이에요. (Pixabay 이미지 자체는 저장하지 않고 id 만 저장)

create table if not exists public.favorites (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  pixabay_id bigint not null,
  tags       text,
  created_at timestamptz not null default now(),
  unique (user_id, pixabay_id)
);

-- 행 단위 보안(RLS): 내 데이터만 보고, 넣고, 지울 수 있게 해요.
alter table public.favorites enable row level security;

drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own" on public.favorites for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own" on public.favorites for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own" on public.favorites for delete using (auth.uid() = user_id);
