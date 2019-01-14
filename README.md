+ `node download.js` will saved cleaned up presidential statement of candidacy data to file `./candidate_data/<today's date>.json`. If file exist for the day, won't download
+ If not used directly, it exports a function that returns a Promise that resolves
  when done

---

+ `node load_to_db/index.js` saves json and loads to db