let rv = require('./registered_voter.json');
let ec = require('./electoral_college.json');

let data = { };
for(state in rv)
{
    data[state] = rv[state] / ec[state];
}

require('fs').writeFileSync
(
    './combine.json',
    JSON.stringify(data),
    { encoding : 'utf-8' }
);