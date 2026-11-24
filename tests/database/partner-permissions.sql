BEGIN;
-- Model the existing separation: Partners may read indicators, but only write their own updates on assigned projects.
ALTER TABLE public.outcome_measurables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.output_measurables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY indicator_partner_read ON public.outcome_measurables FOR SELECT TO authenticated USING (project_id = 1);
CREATE POLICY indicator_partner_read ON public.output_measurables FOR SELECT TO authenticated USING (project_id = 1);
CREATE POLICY update_partner_read ON public.updates FOR SELECT TO authenticated USING (project_id = 1);
CREATE POLICY update_partner_insert ON public.updates FOR INSERT TO authenticated WITH CHECK (project_id = 1 AND posted_by = auth.uid());
CREATE POLICY update_partner_edit ON public.updates FOR UPDATE TO authenticated USING (project_id = 1 AND posted_by = auth.uid()) WITH CHECK (project_id = 1 AND posted_by = auth.uid());
REVOKE UPDATE ON public.outcome_measurables, public.output_measurables FROM authenticated;
INSERT INTO public.outcome_measurables VALUES (2, 2, 1);
INSERT INTO public.updates(project_id, outcome_measurable_id, posted_by, type, description, value)
VALUES (1, 1, '00000000-0000-0000-0000-000000000001', 'Impact', 'Admin result', 1);
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
DO $$
DECLARE submitted public.updates; affected bigint;
BEGIN
  INSERT INTO public.updates(project_id, outcome_measurable_id, posted_by, type, description, value, link)
  VALUES (1, 1, auth.uid(), 'Impact', 'Partner outcome result', 2, 'https://example.org/evidence') RETURNING * INTO submitted;
  ASSERT NOT submitted.admin_reviewed AND submitted.impact_indicator_id = 1, 'Assigned partner may report outcome impact without indicator edit permission';
  UPDATE public.updates SET description = 'Corrected partner result' WHERE id = submitted.id;
  GET DIAGNOSTICS affected = ROW_COUNT;
  ASSERT affected = 1, 'Partner may edit own outcome update';
  INSERT INTO public.updates(project_id, output_measurable_id, posted_by, type, description, value, link)
  VALUES (1, 1, auth.uid(), 'Impact', 'Partner output result', 2, 'https://example.org/evidence') RETURNING * INTO submitted;
  ASSERT NOT submitted.admin_reviewed AND submitted.impact_indicator_id = 1, 'Output permissions and evidence match outcome';
  UPDATE public.updates SET description = 'Cannot edit other owner' WHERE posted_by <> auth.uid();
  GET DIAGNOSTICS affected = ROW_COUNT;
  ASSERT affected = 0, 'Partner cannot edit another owner';
  BEGIN
    INSERT INTO public.updates(project_id, outcome_measurable_id, posted_by, type, description, value)
    VALUES (2, 2, auth.uid(), 'Impact', 'Unassigned project', 2);
    RAISE EXCEPTION 'Expected unassigned project rejection';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
ROLLBACK;
