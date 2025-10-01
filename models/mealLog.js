const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: String,
    barcode: String,
    qty: Number,
    unit: String,
    calories: { type: Number, min: 0 },
    macros: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const PhotoAssetSchema = new mongoose.Schema(
  {
    asset_id: { type: String, required: true },
    s3_key: { type: String, required: true },
    mime_type: { type: String, required: true },
    size_bytes: { type: Number, required: true },
  },
  { _id: false }
);

const MealLogSchema = new mongoose.Schema({
  tenant_id: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  day_bucket: { type: String, required: true },
  ingest_type: { type: String, enum: ["manual", "photo"], required: true },
  items: [ItemSchema],
  photo_assets: [PhotoAssetSchema],
  notes: String,
  logged_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

MealLogSchema.index({ tenant_id: 1, user_id: 1, day_bucket: 1 });
MealLogSchema.index({ tenant_id: 1, user_id: 1, logged_at: 1 });

module.exports = mongoose.model("MealLog", MealLogSchema);
