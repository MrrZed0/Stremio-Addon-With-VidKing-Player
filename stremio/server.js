const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

// This automatically handles CORS and the /manifest.json path
serveHTTP(addonInterface, { 
    port: process.env.PORT || 7000 
});

console.log("Addon is live and CORS is enabled.");