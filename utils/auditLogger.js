// const fs = require("fs");
// const path = require("path");

// const AUDIT_LOG_PATH = path.join(__dirname, "../logs/audit.log");

// function logAudit(event) {
//   const entry = {
//     ...event,
//     timestamp: new Date().toISOString(),
//   };
//   const line = JSON.stringify(entry) + "\n";
//   fs.appendFile(AUDIT_LOG_PATH, line, (err) => {
//     if (err) console.error("Audit log error:", err);
//   });
// }

// module.exports = { logAudit };
