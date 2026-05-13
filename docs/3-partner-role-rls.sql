-- Partner role + RLS policies for Maerl
--
-- Assumptions:
-- - public.users(id uuid primary key, role text, ...)
-- - public.user_projects(user_id uuid, project_id bigint/int)
-- - public.projects(id bigint/int)
-- - public.updates(project_id bigint/int, posted_by uuid, ...)
-- - All tables use RLS and auth.uid() is available (Supabase).
--
-- NOTE:
-- This script is intentionally explicit and conservative:
-- - Partners can READ assigned projects + related logframe data.
-- - Partners can INSERT updates for assigned projects.
-- - Partners can UPDATE only their OWN updates (posted_by = auth.uid()).
-- - Partners cannot modify logframe structure.
--
-- You may need to adapt table/column names if your schema differs.
-- 1) Ensure role values include "Partner"
-- If you use a CHECK constraint on users.role, update it here.
-- Example:
-- ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
-- ALTER TABLE public.users
--   ADD CONSTRAINT users_role_check
--   CHECK (role IN ('Admin', 'Project Manager', 'Partner'));
-- 2) Helper: determine whether the current user is a partner assigned to a project
-- (Inline in policies to avoid adding SQL functions.)
-- 3) USERS: allow users to read their own profile row (needed for app role context)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_own_profile" ON public.users;
CREATE POLICY "users_select_own_profile" ON public.users FOR
SELECT TO authenticated USING (id = auth.uid());
-- 4) PROJECTS: allow Partners to see only assigned projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_select_partner_assigned" ON public.projects;
CREATE POLICY "projects_select_partner_assigned" ON public.projects FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = projects.id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- 5) LOGFRAME TABLES: allow Partners to read rows for assigned projects
-- Repeat the pattern for each table that includes project_id.
-- Impacts
ALTER TABLE public.impacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "impacts_select_partner_assigned" ON public.impacts;
CREATE POLICY "impacts_select_partner_assigned" ON public.impacts FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = impacts.project_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- Outcomes
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "outcomes_select_partner_assigned" ON public.outcomes;
CREATE POLICY "outcomes_select_partner_assigned" ON public.outcomes FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = outcomes.project_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- Outputs
ALTER TABLE public.outputs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "outputs_select_partner_assigned" ON public.outputs;
CREATE POLICY "outputs_select_partner_assigned" ON public.outputs FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = outputs.project_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- Outcome measurables
ALTER TABLE public.outcome_measurables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "outcome_measurables_select_partner_assigned" ON public.outcome_measurables;
CREATE POLICY "outcome_measurables_select_partner_assigned" ON public.outcome_measurables FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = outcome_measurables.project_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- Output measurables
ALTER TABLE public.output_measurables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "output_measurables_select_partner_assigned" ON public.output_measurables;
CREATE POLICY "output_measurables_select_partner_assigned" ON public.output_measurables FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = output_measurables.project_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- Activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activities_select_partner_assigned" ON public.activities;
CREATE POLICY "activities_select_partner_assigned" ON public.activities FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = activities.project_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- Impact indicators: Partners need read access because logframe joins them.
-- If you want impact indicators globally visible, you can simplify this to true.
ALTER TABLE public.impact_indicators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "impact_indicators_select_authenticated" ON public.impact_indicators;
CREATE POLICY "impact_indicators_select_authenticated" ON public.impact_indicators FOR
SELECT TO authenticated USING (true);
-- 6) UPDATES: allow Partners to read assigned-project updates + write their own
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "updates_select_partner_assigned" ON public.updates;
CREATE POLICY "updates_select_partner_assigned" ON public.updates FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = updates.project_id
        )
        OR EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid()
                AND u.role IN ('Admin', 'Project Manager')
        )
    );
-- Insert: Partners can create updates for assigned projects; posted_by must match auth.uid()
DROP POLICY IF EXISTS "updates_insert_partner_assigned" ON public.updates;
CREATE POLICY "updates_insert_partner_assigned" ON public.updates FOR
INSERT TO authenticated WITH CHECK (
        posted_by = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = updates.project_id
        )
    );
-- Update: Partners can update ONLY their own updates (and only for assigned projects)
DROP POLICY IF EXISTS "updates_update_partner_own" ON public.updates;
CREATE POLICY "updates_update_partner_own" ON public.updates FOR
UPDATE TO authenticated USING (
        posted_by = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = updates.project_id
        )
    ) WITH CHECK (
        posted_by = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM public.users u
                JOIN public.user_projects up ON up.user_id = u.id
            WHERE u.id = auth.uid()
                AND u.role = 'Partner'
                AND up.project_id = updates.project_id
        )
    );
-- Admin/PM policies are assumed to already exist. If they don't, add them separately.