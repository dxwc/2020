let pgp = require('../connect.js').pgp;
let db  = require('../connect.js').db;

// require('../load.js')(true, true)
Promise.resolve()
.then(() =>
{
    return db
    .many(`SELECT *, to_char(receipt, 'mm/dd/yyyy') AS receipt FROM candidate`);
})
.then((data) =>
{
    console.log
    (
`---
title: All ${data.length} Candidates Who Filed For 2020 Presidency
---
`
    );

    let parties = { };

    data.forEach((can) =>
    {
        if(!parties[can.party]) parties[can.party] = 1;
        else                    parties[can.party]++;
        console.log
        (
`
<span class='candidate'>
    <h3 class='name' title='${can.id}'>
        <a id='${can.id}' href='/candidate/${can.id.trim()}.html'>${can.full_name}</a>
    </h3>
    Party: <b class='party'>${can.party}</b><br>
</span>`
        );
    });
    console.log(`<h2>Number of Parties and Candidates in each party</h2>`)
    console.log(`<table>`);
    parties = Object.entries(parties).sort((a, b) => b[1] - a[1]);
    parties.forEach((p) =>
    {
        console.log(`<tr><td>${p[0]}</td> <td>${p[1]}</td>`);
    })
    console.log(`</table>`);

    console.log
    (
`
<br>
<br>
<i class='disclaimer'>Not an official source</i>
<i class='disclaimer'>
    <a href='https://github.com/dxwc/2020'>
        Last Generated on ${new Date().toLocaleDateString()}
    </a>
</i>
`
    );
})
.then(() =>
{
    pgp.end();
})
.catch((err) =>
{
    console.error(err);
});