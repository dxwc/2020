let pgp = require('../connect.js').pgp;
let db  = require('../connect.js').db;

// require('../load.js')(true, true)
Promise.resolve()
.then(() =>
{
    return db
    .many
    (
        `SELECT
            *,
            to_char(receipt, 'mm/dd/yyyy') AS receipt
        FROM candidate
        ORDER BY candidate.receipt DESC`);
})
.then((data) =>
{
    console.log
    (
`---
title: All ${data.length} Candidates Who Filed For 2020 Presidency
---


<style>
table
{
    display: table;
    margin: 0 auto;
}

tr:nth-child(odd)
{
    background-color: #efefef;
}

h1, h2
{
    text-align: center;
}
</style>
`
    );

    let parties = { };

    console.log('<table>');
    data.forEach((can) =>
    {
        if(!parties[can.party]) parties[can.party] = 1;
        else                    parties[can.party]++;
        console.log
        (
`<tr>
    <td>
        <a
            id='${can.id}'
            href='/candidate/${can.id.trim()}.html'>${can.full_name}
        </a>
    </td>
    <td>
        ${can.party}
    </td>
</tr>`
        );
    });
    console.log('</table>');

    console.log(`<h2>Number of Parties and Candidates in each party</h2>`)
    console.log(`<table>`);
    parties = Object.entries(parties).sort((a, b) => b[1] - a[1]);
    parties.forEach((p) =>
    {
        console.log(`<tr><td>${p[0]}</td> <td>${p[1]}</td>`);
    })
    console.log(`</table>`);
})
.then(() =>
{
    pgp.end();
})
.catch((err) =>
{
    console.error(err);
});