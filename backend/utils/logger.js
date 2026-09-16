const info = (msg) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`);
const error = (msg) => console.error(`[${new Date().toISOString()}] ERROR: ${msg}`);

module.exports = { info, error };
