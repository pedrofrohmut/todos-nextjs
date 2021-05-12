CREATE SCHEMA app;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE app.users (
  id UUID DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  PRIMARY KEY (id)
);
