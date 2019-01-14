let con_str = process.env.DATABASE_URL ||
`postgres://can_admin:can_pass@localhost:5432/can`;
let pgp = require('pg-promise')();
let db  = pgp(con_str);

module.exports.db      = db;
module.exports.pgp     = pgp;
module.exports.con_str = con_str;