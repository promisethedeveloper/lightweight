\echo 'Delete and recreate lightweight db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE lightweight;
CREATE DATABASE lightweight;
\connect lightweight;

\i lightweight-schema.sql
\i lightweight-seed.sql

\echo 'Delete and recreate lightweight_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE lightweight_test;
CREATE DATABASE lightweight_test;
\connect lightweight_test

\i lightweight-schema.sql