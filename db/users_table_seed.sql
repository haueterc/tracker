CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    display_name TEXT,
    img TEXT,
    auth_id TEXT
)