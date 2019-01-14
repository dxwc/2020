CREATE TABLE IF NOT EXISTS candidate
(
    id        TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    party     TEXT,
    p_code    TEXT,
    a_city    TEXT,
    a_state   TEXT,
    a_zip     TEXT,
    receipt   TIMESTAMP WITHOUT TIME ZONE,
    image_num TEXT
);