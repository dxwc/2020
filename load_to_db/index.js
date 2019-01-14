const pgp         = require('pg-promise')();
const db          = pgp
(
    process.env.DATABASE_URL || `postgres://can_admin:can_pass@localhost:5432/can`
);