const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const solPath = path.join(__dirname, '../config/package-solution.json');
const sol = require(solPath);

sol.solution.version = `${pkg.version}.0`;
fs.writeFileSync(solPath, JSON.stringify(sol, null, 2));

console.log("Updated solution version to", sol.solution.version);
