const mongoose = require("mongoose");

const GlucoseLogSchema = new mongoose.Schema({
  tenant_id: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  day_bucket: { type: String, required: true }, // YYYY-MM-DD
  value_mgdl: { type: Number, required: true, min: 40, max: 500 },
  logged_at: { type: Date, required: true },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
});

GlucoseLogSchema.index({ tenant_id: 1, user_id: 1, day_bucket: 1 });

module.exports = mongoose.model("GlucoseLog", GlucoseLogSchema);
