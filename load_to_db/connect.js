let pgp         = require('pg-promise')();
let db          = pgp
(
    process.env.DATABASE_URL || `postgres://can_admin:can_pass@localhost:5432/can`
);

module.exports.db = db;
module.exports.pgp = pgp;