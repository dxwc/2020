const { parseFullName } = require('parse-full-name');

async function load(silent, dont_close_db)
{
    let db  = require('./connect.js').db;
    let pgp = require('./connect.js').pgp;
    let say = require('../say.js');

    if(!silent) say.stdout_write('- Inserting data in db...');
    let data = require(await require('../download.js')(silent));
    await db.none(`DELETE FROM candidate`);
    for(let i = 0; i < data.length; ++i)
    {
        let name = '';

        let n = parseFullName(data[i]['CANDIDATE_NAME'], 'all', -1, false);
        name += n.title ? n.title + ' ' : '';
        name += n.first ? n.first + ' ' : '';
        name += n.middle ? n.middle + ' ' : '';
        name += n.last ? n.last + ' ' : '';
        name += n.nick ? n.nick + ' ' : '';
        name += n.suffix ? n.suffix + ' ' : '';
        name = name.trim();

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
                name,
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

    /* Don't Editorialize, show what's given

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

    await db.none
    (
        // P00010892 : Highly likely it is fake candidate
        // Note: P00007286 is not fake, there's a outline.com post on it
        // P00009415 : probably someone's cat: http://www.seymourcats.com/
        // P60007895: Real person, but decided to ignore age limit requirement, see:
        // https://twitter.com/iElijahManley/status/1086724758962663425
        // P00009365: very likely a joke candidate https://youtu.be/eet-O2wKvwA
        // P00011072 : multiple name on form, likely cartoon caracter joke candidate:
        // https://azumanga.fandom.com/wiki/Chiyo_Mihama
        // P00011122 : The name and address are clearly joke
        // P00011379: "The meme comittee" and name doens't make sense
        // P00011411: fake name including adolf, city as england
        // P00011775 : fake name ? + communist party (not included yet)
        `
        DELETE FROM candidate
        WHERE
            id='P00010892' OR
            id='P00009415' OR
            id='P60007895' OR
            id='P00009365' OR
            id='P00011072' OR
            id='P00011122' OR
            id='P00011379' OR
            id='P00011411'
        `
    );
    */

    delete data;
    if(!silent) say.clean_say_dont_replace('✓ Done saving in DB');
    if(!dont_close_db) pgp.end();
    return;
}

if(process.argv[1] === __filename) load().catch((err) => console.error(err));

module.exports = load;