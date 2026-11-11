SELECT set_config('retention.cutoff', (now() - make_interval(months => :'months'::int))::text, false);

DO $$
DECLARE
  cutoff timestamptz := current_setting('retention.cutoff')::timestamptz;
  target text;
  removed bigint;
BEGIN
  RAISE NOTICE 'retention: removendo dados anteriores a %', cutoff;

  FOREACH target IN ARRAY ARRAY['event_data', 'website_event', 'session_data', 'revenue', 'session_replay', 'heatmap_event', 'session_link'] LOOP
    IF to_regclass(format('public.%I', target)) IS NULL THEN
      CONTINUE;
    END IF;
    EXECUTE format('DELETE FROM %I WHERE created_at < $1', target) USING cutoff;
    GET DIAGNOSTICS removed = ROW_COUNT;
    RAISE NOTICE 'retention: % linhas removidas de %', removed, target;
  END LOOP;

  IF to_regclass('public.session') IS NOT NULL AND to_regclass('public.website_event') IS NOT NULL THEN
    DELETE FROM session
    WHERE created_at < cutoff
      AND NOT EXISTS (SELECT 1 FROM website_event WHERE website_event.session_id = session.session_id);
    GET DIAGNOSTICS removed = ROW_COUNT;
    RAISE NOTICE 'retention: % linhas removidas de session', removed;
  END IF;
END $$;
