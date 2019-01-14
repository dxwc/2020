+ `sudo -u postgres createuser -P -s -e can_admin` and set account password: `can_pass`
+ `sudo -u postgres createdb can --owner can_admin`
+ `sudo psql -U can_admin -d can -W < table.sql`