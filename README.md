+ `node download.js` will saved cleaned up presidential statement of candidacy data to file `./candidate_data/<today's date>.json`. If file exist for the day, won't download
+ If not used directly, it exports a function that returns a Promise that resolves
  when done

# DB

+ `sudo -u postgres createuser -P -s -e can_admin` and set account password: `can_pass`
+ `sudo -u postgres createdb can --owner can_admin`
+ `sudo psql -U can_admin -d can -W < table.sql`