let pgp  = require('../connect.js').pgp;
let db   = require('../connect.js').db;
let fs   = require('fs');
let path = require('path');

const save_dir = process.argv[2] || path.join(path.dirname(__filename), 'pages');
let current_file = path.join(save_dir, 'temp' + '.md')

// require('../load.js')(false, true)
Promise.resolve()
.then(() =>
{
    return db
    .many(`SELECT *, to_char(receipt, 'mm/dd/yyyy') AS receipt FROM candidate`);
})
.then((data) =>
{
    if(!fs.existsSync(save_dir) || !fs.statSync(save_dir).isDirectory())
        fs.mkdirSync(save_dir);

    data.forEach((d) =>
    {
        current_file = path.join(save_dir, d.id + '.md');
        if(!fs.existsSync(current_file))
        {
            console.log('Generating', d.id + '.md');
            let text =
`---
title: ${d.full_name}
---

+ ${d.party.toLowerCase().indexOf('party') !== -1 ?
    `**${d.party}**` :
    `**Party**: ${d.party}`}
+ 2020 presidential candidate
+ From ${d.a_city}, ${d.a_state}, ${d.a_zip}
+ [Statement of candidacy recieved on ${d.receipt}](https://docquery.fec.gov/cgi-bin/fecimg/?_${d.image_num}+0)

`;
            fs.writeFileSync
            (current_file, text, { encoding : 'utf-8'})
        }
    });

})
.then(() =>
{
    console.log('Done :)');
    pgp.end();
})
.catch((err) =>
{
    console.error(err);
    pgp.end();
});