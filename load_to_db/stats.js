const pgp         = require('pg-promise')();
const db          = pgp
(
    process.env.DATABASE_URL || `postgres://can_admin:can_pass@localhost:5432/can`
);

async function num_of_parties()
{
    return db.any
    (
        `
        SELECT party, count(*) AS num FROM candidate
        GROUP BY party
        ORDER BY num DESC
        `
    )
    .catch((err) =>
    {
        console.error(err);
    });
}

(async () =>
{
    console.log(await num_of_parties());
    pgp.end();
})()