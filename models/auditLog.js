// // models/auditLog.js
// const mongoose = require("mongoose");

// const auditLogSchema = new mongoose.Schema(
//   {
//     user_type: { type: String, required: true },
//     user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
//     action: { type: String, required: true },
//     payload: { type: String, required: true },
//     severity: { type: String, enum: ["info", "warning", "critical"], default: "warning" },
//     flagged_at: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("AuditLog", auditLogSchema);
