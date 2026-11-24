BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
INSERT INTO outcome_measurables(id,project_id,progress_only) VALUES (20,1,true);
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
DO $$
DECLARE submitted public.updates;
BEGIN
  INSERT INTO updates(project_id,outcome_measurable_id,type,description,value)
    VALUES(1,20,'Progress','Written progress',99) RETURNING * INTO submitted;
  ASSERT submitted.value IS NULL AND submitted.impact_indicator_id IS NULL;
  UPDATE updates SET description='Edited written progress' WHERE id=submitted.id;
  BEGIN
    UPDATE updates SET type='Impact',value=3 WHERE id=submitted.id;
    RAISE EXCEPTION 'Expected rejection of numeric conversion';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO updates(project_id,outcome_measurable_id,type,description,value)
      VALUES(1,20,'Impact','Numeric result',3);
    RAISE EXCEPTION 'Expected rejection of numeric insert';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO updates(project_id,outcome_measurable_id,type,description)
      VALUES(2,20,'Progress','Wrong project');
    RAISE EXCEPTION 'Expected rejection of wrong project';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    UPDATE outcome_measurables SET progress_only=true,impact_indicator_id=NULL WHERE id=1;
    RAISE EXCEPTION 'Expected rejection of non-admin configuration';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  ASSERT NOT EXISTS (SELECT 1 FROM reviewed_impact_updates WHERE outcome_measurable_id=20);
END $$;
ROLLBACK;
