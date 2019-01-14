/**
 * Downloads 2020 presidential statement of candidacy data to
 * ./candidate_data/<date>.json file
 */

let https = require('https');
let path  = require('path');
let fs    = require('fs');

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

/**
 * @param {String} url
 * @returns {Promise} Resolves with the downloaded content, reject on error
 */
function download(url)
{
    return new Promise((resolve, reject) =>
    {
        let data = '';
        https.get(url, (res) =>
        {
            res.on('data',  (chunk) => data += chunk);
            res.on('end',   ()      => resolve(data));
            res.on('error', (err)   => reject(err));
        })
        .on('error', (err) => reject(err));
    });
}



async function setup()
{
    let data;
    stdout_write('Getting data...');
    let source = `https://classic.fec.gov/data/Form2Filer.do?` +
    `format=json&election_yr=2020&CAND_OFFICE=P`;

    let download_dir = path.join(path.dirname(__filename), 'candidate_data');
    let data_file = path.join
    (download_dir, new Date().toLocaleDateString().replace(/\//gi, '_') + '.json');

    if(!fs.existsSync(download_dir) || !fs.statSync(download_dir).isDirectory())
        fs.mkdirSync(download_dir);
    if(!fs.existsSync(data_file))
    {
        data = JSON.parse(await download(source));
        let president = [];
        data['data.fec.gov']['DATA_RECORD'].forEach((item) =>
        {
            if(item['CANDIDATE_OFFICE_CODE'] === 'P') president.push(item);
        });

        data = president;
        delete president;

        fs.writeFileSync(data_file, JSON.stringify(data, null, '\t'));
    }

    clean_say_dont_replace(`✓ Downloaded ${data_file}`);

    return data_file;
}

if(process.argv[1] === __filename) setup().catch((err) => console.error(err));

module.exports = setup;