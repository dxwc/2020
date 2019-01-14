let data;

require('./download.js')(true)
.then(async (file) =>
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
<h1>All Presidential Candidates Who Filed For 2020 Candidacy</h1>
`
    )
    data = require(file);
    data.forEach((can) =>
    {
        console.log
        (
`
<span class='candidate'>
    <h3 class='name' title='${can['CANDIDATE_ID']}'>${can['CANDIDATE_NAME']}</h3>
    Party: <b class='party'>${can['PARTY']}</b><br>
    <i class='addr'>${can['CITY']}, ${can['STATE']}, ${can['ZIP']}</i><br>
    <i class='reciept'>Statement recieved on ${can['RECEIPT_DATE']}</i><br>
    <a href='http://docquery.fec.gov/cgi-bin/fecimg/?_${can['BEGIN_IMAGE_NUMBER']}+0'>
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
    )
});