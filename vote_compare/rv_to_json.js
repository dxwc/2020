let fs = require('fs');

let data = fs.readFileSync('./registered_voter.csv', { encoding : 'utf-8' });

let i, state, num_registered;
let json_data = { };

data.split('\n').forEach((val) =>
{
    i = val.indexOf(',');

    state = val.substr(0, i).toLowerCase();
    state = state
    .split(' ')
    .map((part, i) =>
        (part === 'of') ?
            part :
            part.charAt(0).toUpperCase() + part.substr(1))
    .join(' ');

    num_registered = val.substr(i+1).replace(/"/g, '').replace(/,/g, '');
    num_registered = Number.parseInt(num_registered);

    json_data[state] = num_registered;
});

fs.writeFileSync
(
    './registered_voter.json',
    JSON.stringify(json_data),
    { encoding : 'utf-8' }
);