const fs = require('fs');
let code = fs.readFileSync('server/db.ts', 'utf-8');

code = code.replace(/banners: \[[\s\S]*?\]\,/g, 'banners: [],');
code = code.replace(/videos: \[[\s\S]*?\]\,/g, 'videos: [],');

fs.writeFileSync('server/db.ts', code, 'utf-8');
