let pgp = require('../connect.js').pgp;
let db  = require('../connect.js').db;
let fs  = require('fs');
let path = require('path');
let fn   = require('filenamify');
let sg   = require('@sindresorhus/slugify');

let out = process.argv[2] || './parties/';


let pre = (title) =>
`<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta http-equiv='X-UA-Compatible' content='ie=edge'>
    <title>${title}</title>
    <style>
        body
        {
            margin: 0;
            border: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
            background: white;
            color: black;
        }

        .candidate, .disclaimer, table
        {
            display: table;
            margin: 0 auto;
        }

        h1, h2, h6
        {
            text-align: center;
        }

        h3 a
        {
            text-decoration: none;
            border: none;
            color: inherit;
        }
    </style>
</head>
<body>
<h1>${title}</h1>
`;

let each = (can) =>
`<span class='candidate'>
<h3 class='name' title='${can.id}'>
    <a id='${can.id}' href='#${can.id.trim()}'>${can.full_name}</a>
</h3>
<i class='addr'>${can.a_city}, ${can.a_state}, ${can.a_zip}</i><br>
<i class='reciept'>Statement recieved on ${can.receipt}</i><br>
<a href='https://docquery.fec.gov/cgi-bin/fecimg/?_${can.image_num}+0'>
    View statement of candidacy
</a>
</span>`;

let post = () =>
`<br>
<br>
<i class='disclaimer'>Not an official source</i>
<i class='disclaimer'>
    <a href='https://github.com/dxwc/2020'>
        Last Generated on ${new Date().toLocaleDateString()}
    </a>
</i>
<br>
</body>
</html>`;

let each1 = (can) =>
{
    return `+ [${can.full_name}](/candidate/${can.id}.html)\n`;
//     return `<tr>
//     <td>${can.full_name}</td>
//     <td>${can.a_state}</td>
//     <td>${new Date(can.receipt).toLocaleDateString()}</td>
// </tr>\n`
}

(async function()
{try
{
    let parties = await db.any(`SELECT party FROM candidate GROUP BY party`);
    parties = parties.map((obj) => obj.party);
    let final = { };
    let buffer = '';
    let can_count;
    for(let i = 0; i < parties.length; ++i)
    {
        can_count = (await db.one(`SELECT count(*) FROM candidate where party=$1`, [parties[i]])).count;
        final[can_count] =
        {
            party : parties[i],
            loc   : sg(parties[i], { lowercase : true }) + '.html'
        }
        buffer = `---\ntitle: ${parties[i]} Candidates\ndate: ${new Date().toLocaleDateString()}\n---\n\n`;
        buffer += `<i style='display: table; margin: 0 auto' title='recent on top'>${can_count} candidates so far<i>\n\n`;
        (
            await db.any
            (`SELECT * FROM candidate WHERE party=$1`, [parties[i]])
        ).forEach((can) => buffer += each1(can));
        buffer += '</table>'
        fs.writeFileSync(path.join(out, sg(parties[i], { lowercase : true }) + '.md'), buffer);
    }

    buffer = `---\ntitle: List of Parties\ndate: ${new Date().toLocaleDateString()}\n---\n\n`;
    // console.log(buffer);
    Object.keys(final).map(n => Number(n)).sort((a, b) => b - a).forEach((c) =>
    {
        // console.log(`+ [${final[c].party}]('/party/${final[c].loc}) [${c}]`);
        buffer += `+ [${final[c].party}](./${final[c].loc}) [${c}]\n`;
    });

    fs.writeFileSync(path.join(out, 'index.md'), buffer);

    pgp.end();
}
catch(err)
{
    console.error(err);
}
})();