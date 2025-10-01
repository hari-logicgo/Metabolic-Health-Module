// const mongoose = require("mongoose");

// const NudgeEventSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     index: true,
//   },
//   trigger_type: { type: String, required: true }, // e.g. 'missed_meal', 'high_glucose', etc.
//   severity: {
//     type: String,
//     enum: ["info", "warning", "critical"],
//     required: true,
//   },
//   confidence: { type: Number, min: 0.8, max: 1, required: true },
//   message: { type: String, required: true },
//   disclaimer: { type: String, default: "Not medical advice, advisory only." },
//   timestamp: { type: Date, default: Date.now },
//   meta: { type: mongoose.Schema.Types.Mixed }, // extra context (optional)
// });

// NudgeEventSchema.index({ user_id: 1, timestamp: -1 });

// module.exports = mongoose.model("NudgeEvent", NudgeEventSchema);
