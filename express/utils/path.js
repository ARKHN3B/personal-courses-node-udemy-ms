const path = require("path");

// Dirname method returns the directory of the name of a path so we could add the file that has been run by node (e.g. "node index.js")
// Check https://nodejs.org/api/modules.html#requiremain and https://nodejs.org/api/modules.html#accessing-the-main-module for more explanations
module.exports = path.dirname(require.main.filename); // gives the root directory
