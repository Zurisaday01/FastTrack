CREATE TABLE fasting_goals (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    window_start time NOT NULL,        -- 12:00:00
    window_end   time NOT NULL,        -- 16:00:00
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE fasting_sessions (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id          uuid NOT NULL REFERENCES fasting_goals(id),
    started_at       timestamptz NOT NULL,
    ended_at         timestamptz,
    duration_seconds int,
    completed        boolean,
    deviation_seconds int,
    note             text,
    created_at       timestamptz NOT NULL DEFAULT now()
);

-- one active session per user at a time
CREATE UNIQUE INDEX one_active_session 
ON fasting_sessions(user_id) WHERE ended_at IS NULL;

-- fast lookups
CREATE INDEX ON fasting_sessions(user_id, started_at DESC);
CREATE INDEX ON fasting_goals(user_id);