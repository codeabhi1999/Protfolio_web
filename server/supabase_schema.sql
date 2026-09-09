-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR ABHIJEET CHAVAN PORTFOLIO & ADMIN PLATFORM
-- Execute this entire script inside the Supabase SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically manage updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    location TEXT,
    email TEXT,
    phone TEXT,
    profile_image TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    social_links JSONB DEFAULT '{"github": "", "linkedin": "", "instagram": ""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 2. SKILLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Database', 'Tools', 'Other')),
    level TEXT NOT NULL DEFAULT 'Intermediate' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    proficiency INTEGER DEFAULT 80,
    icon TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_skills_updated_at ON public.skills;
CREATE TRIGGER tr_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 3. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT NOT NULL,
    detailed_description TEXT,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    category TEXT NOT NULL,
    image TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    live_url TEXT DEFAULT '',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_projects_updated_at ON public.projects;
CREATE TRIGGER tr_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. EXPERIENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT DEFAULT 'Present',
    location TEXT,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    technologies JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_experiences_updated_at ON public.experiences;
CREATE TRIGGER tr_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. EDUCATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    start_year TEXT NOT NULL,
    end_year TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_educations_updated_at ON public.educations;
CREATE TRIGGER tr_educations_updated_at
BEFORE UPDATE ON public.educations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. CERTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    date TEXT NOT NULL,
    credential_id TEXT DEFAULT '',
    credential_url TEXT DEFAULT '',
    image TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_certifications_updated_at ON public.certifications;
CREATE TRIGGER tr_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. SERVICES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_services_updated_at ON public.services;
CREATE TRIGGER tr_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 8. CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    subject TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Replied', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER tr_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 9. ADMIN USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER tr_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio tables
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public Read Educations" ON public.educations FOR SELECT USING (true);
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);

-- Allow public insertion for contact form messages
CREATE POLICY "Public Insert Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Allow service role / backend API full access to all tables
CREATE POLICY "Service Role Full Access Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Educations" ON public.educations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Certifications" ON public.certifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Admin Users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);
