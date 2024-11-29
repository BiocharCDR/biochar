-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enums
create type project_stage as enum ('pre_design', 'design', 'construction', 'verification');
create type project_status as enum ('active', 'on_hold', 'completed');
create type area_unit as enum ('sqm', 'sqft');
create type currency_type as enum ('SGD', 'MYR', 'IDR', 'USD');

-- Profiles table (extends Supabase auth.users)
create table profiles (
    id uuid primary key references auth.users on delete cascade,
    full_name text not null,
    email text not null,
    phone text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Projects table
create table projects (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    client_name text not null,
    certification_type text not null,
    building_type text,  -- Optional
    floor_area decimal,  -- Optional
    floor_area_unit area_unit default 'sqm',
    contract_value decimal not null,
    currency currency_type default 'SGD',
    target_level text not null,
    stage project_stage default 'pre_design',
    progress integer default 0,
    red_flag boolean default false,
    red_flag_reason text,
    consultant_id uuid references auth.users not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Documents table
create table documents (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects on delete cascade not null,
    name text not null,
    file_path text not null,
    file_type text not null,
    file_size integer,
    uploaded_by uuid references auth.users not null,
    created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table projects enable row level security;
alter table documents enable row level security;

-- Basic RLS Policies
create policy "Users can view their own profile"
    on profiles for select
    using (id = auth.uid());

create policy "Users can update their own profile"
    on profiles for update
    using (id = auth.uid());

create policy "Consultants can create projects"
    on projects for insert
    with check (consultant_id = auth.uid());

create policy "Consultants can view their own projects"
    on projects for select
    using (consultant_id = auth.uid());

create policy "Consultants can update their own projects"
    on projects for update
    using (consultant_id = auth.uid());

create policy "Consultants can view project documents"
    on documents for select
    using (
        exists (
            select 1 from projects
            where projects.id = documents.project_id
            and projects.consultant_id = auth.uid()
        )
    );

-- Create trigger for new user signup
create or replace function handle_new_user_signup()
returns trigger as $$
begin
    insert into profiles (
        id,
        full_name,
        email
    ) 
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users table
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user_signup();

-- Enable realtime for projects
alter publication supabase_realtime add table projects;