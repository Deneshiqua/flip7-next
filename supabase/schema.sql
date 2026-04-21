-- Flip 7 Database Schema for Supabase

-- Player profiles and stats
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text,
  total_games integer default 0,
  games_won integer default 0,
  highest_score integer default 0,
  created_at timestamptz default now(),
  last_seen timestamptz default now()
);

-- Game sessions (for multiplayer tracking)
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  room_code text unique,
  status text default 'waiting', -- waiting, playing, finished
  created_at timestamptz default now(),
  finished_at timestamptz
);

-- Player scores per game
create table if not exists public.game_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(id),
  profile_id uuid references public.profiles(id),
  player_name text not null,
  score integer default 0,
  is_ai boolean default false,
  status text default 'playing', -- playing, stayed, busted, winner
  created_at timestamptz default now()
);

-- Global leaderboard view
create view public.leaderboard as
  select
    username,
    display_name,
    total_games,
    games_won,
    highest_score,
    case when total_games > 0 then round((games_won::numeric / total_games) * 100, 1) else 0 end as win_rate
  from public.profiles
  where total_games >= 1
  order by games_won desc, highest_score desc;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.game_sessions enable row level security;
alter table public.game_players enable row level security;

-- Public read access
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Anyone can insert profiles"
  on public.profiles for insert with check (true);

create policy "Anyone can update their own profile"
  on public.profiles for update using (true);

create policy "Game sessions viewable by everyone"
  on public.game_sessions for select using (true);

create policy "Anyone can create game sessions"
  on public.game_sessions for insert with check (true);

create policy "Game players viewable by everyone"
  on public.game_players for select using (true);

create policy "Anyone can insert game players"
  on public.game_players for insert with check (true);
