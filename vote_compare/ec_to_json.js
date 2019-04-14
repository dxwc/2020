let fs = require('fs');

let data = fs.readFileSync('./electoral_college.csv', { encoding : 'utf-8' });

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
    './electoral_college.json',
    JSON.stringify(json_data),
    { encoding : 'utf-8' }
);

let rv = require('./registered_voter.json');
for(state in json_data)
{
    if(!rv[state]) console.log('Mismatch', state);
}

for(state in rv)
{
    if(!json_data[state]) console.log('Mismatch', state);
}