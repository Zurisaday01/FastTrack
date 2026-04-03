-- remove indexes if they exist
DROP INDEX IF EXISTS one_active_session;
DROP INDEX IF EXISTS fasting_sessions_user_id_started_at_idx;
DROP INDEX IF EXISTS fasting_goals_user_id_idx;

DROP TABLE IF EXISTS fasting_sessions;
DROP TABLE IF EXISTS fasting_goals;

