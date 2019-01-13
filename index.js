let https = require('https');
let path  = require('path');
let fs    = require('fs');

/**
 * @param {String} url
 * @returns {Promise} Resolves with the downloaded content, reject on error
 */
function download(url, file_name)
{
    return new Promise((resolve, reject) =>
    {
        let ws = fs.createWriteStream(file_name);
        ws.on('error', (err) => reject(err));
        ws.on('close', ()    => resolve());

        https.get(url, (res) =>
        {
            res.pipe(ws);
            res.on('error', (err) => reject(err));
        })
        .on('error', (err) => reject(err));
    });
}


let data_file;

async function setup()
{
    let source = `https://classic.fec.gov/data/Form2Filer.do?` +
    `format=json&election_yr=2020&CAND_OFFICE=P`;

    let download_dir = path.join(__dirname, 'candidate_data');
    data_file = path.join
    (download_dir, new Date().toLocaleDateString().replace(/\//gi, '_') + '.json');

    if(!fs.existsSync(download_dir) || !fs.statSync(download_dir).isDirectory())
        fs.mkdirSync(download_dir);
    if(!fs.existsSync(data_file))
        await download(source, data_file);
    console.log(data_file);
}

setup()
.catch((err) =>
{
    console.error(err);
});