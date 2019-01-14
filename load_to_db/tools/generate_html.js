let pgp = require('../connect.js').pgp;
let db  = require('../connect.js').db;

require('../load.js')(true, true)
.then(() =>
{
    return db
    .many(`SELECT *, to_char(receipt, 'mm/dd/yyyy') AS receipt FROM candidate`);
})
.then((data) =>
{
    console.log
    (
`<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta http-equiv='X-UA-Compatible' content='ie=edge'>
    <title>Presidential Candidates 2020</title>
    <style>
        body
        {
            margin: 0;
            border: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
        }

        .candidate, .disclaimer
        {
            display: table;
            margin: 0 auto;
        }

        h1
        {
            text-align: center;
        }
    </style>
</head>
<body>
<h1>All ${data.length} Candidates Who Filed For 2020 Presidency</h1>
`
    )
    data.forEach((can) =>
    {
        console.log
        (
`
<span class='candidate'>
    <h3 class='name' title='${can.id}'>${can.full_name}</h3>
    Party: <b class='party'>${can.party}</b><br>
    <i class='addr'>${can.a_city}, ${can.a_state}, ${can.a_zip}</i><br>
    <i class='reciept'>Statement recieved on ${can.receipt}</i><br>
    <a href='https://docquery.fec.gov/cgi-bin/fecimg/?_${can.image_num}+0'>
        View statement of candidacy
    </a>
</span>`
        );
    });

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
<br>
</body>
</html>
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