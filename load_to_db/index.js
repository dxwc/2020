const pgp         = require('pg-promise')();
const db          = pgp
(
    process.env.DATABASE_URL || `postgres://can_admin:can_pass@localhost:5432/can`
);

global.previous_length = 0;

function stdout_write(text)
{
    process.stdout.write
    (
        ' '.repeat(global.previous_length ? previous_length : text.length) + '\r'
    );

    global.previous_length = text.length;
    process.stdout.write(text + '\r');
}

function clean_say_dont_replace(text)
{
    process.stdout.write
    (
        ' '.repeat(global.previous_length ? previous_length : text.length) + '\r'
    );

    console.info(text);
}

require('../download.js')()
.then(async (data_file) =>
{
    stdout_write('- Inserting data in db...');
    let data = require(data_file);
    for(let i = 0; i < data.length; ++i)
    {
        await db.none
        (
            `
            INSERT INTO candidate VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT DO NOTHING`,
            [
                data[i]['CANDIDATE_ID'],
                data[i]['CANDIDATE_NAME'],
                data[i]['PARTY'],
                data[i]['PARTY_CODE'],
                data[i]['CITY'],
                data[i]['STATE'],
                data[i]['ZIP'],
                data[i]['RECEIPT_DATE'],
                data[i]['BEGIN_IMAGE_NUMBER']
            ]
        );
    }

    await db.none
    (
        // CASTRO, JULIAN is currently marked as party: Unknown even though the
        // statement paper says Democratic
        `
        UPDATE candidate
        SET
            party='Democratic Party',
            p_code='DEM'
        WHERE
            id='P00009092'
        `
    );

    delete data;
    clean_say_dont_replace('✓ Done saving in DB');
    return pgp.end();
})
.catch((err) =>
{
    clean_say_dont_replace(err);
});