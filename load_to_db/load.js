async function load(silent, dont_close_db)
{
    let db  = require('./connect.js').db;
    let pgp = require('./connect.js').pgp;
    let say = require('../say.js');

    if(!silent) say.stdout_write('- Inserting data in db...');
    let data = require(await require('../download.js')(silent));
    for(let i = 0; i < data.length; ++i)
    {
        await db.none
        (
            `
            INSERT INTO candidate VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (ID) DO UPDATE
            SET
                full_name = EXCLUDED.full_name,
                party     = EXCLUDED.party,
                p_code    = EXCLUDED.p_code,
                a_city    = EXCLUDED.a_city,
                a_state   = EXCLUDED.a_state,
                a_zip     = EXCLUDED.a_zip,
                receipt   = EXCLUDED.receipt,
                image_num = EXCLUDED.image_num`,
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
    if(!silent) say.clean_say_dont_replace('✓ Done saving in DB');
    if(!dont_close_db) pgp.end();
    return;
}

if(process.argv[1] === __filename) load().catch((err) => console.error(err));

module.exports = load;