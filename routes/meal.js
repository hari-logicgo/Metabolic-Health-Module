const express = require("express");
const router = express.Router();
const multer = require("multer");
const { randomUUID } = require("crypto");
const MealLog = require("../models/mealLog");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Configure AWS S3 (replace with env/config in production)
const s3 = new S3Client({ region: "us-east-1" });
const BUCKET = "your-s3-bucket"; // TODO: replace with real bucket

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

// POST /api/meal/log (manual or photo upload)
router.post("/log", upload.single("photo"), async (req, res) => {
  try {
    const { ingest_type, items, notes, logged_at } = req.body;
    const tenant_id = req.tenant_id || "demo-tenant";
    const user_id = req.user_id || "000000000000000000000000";
    if (!logged_at) {
      return res.status(400).json({ ok: false, error: "logged_at is required." });
    }
    const dateObj = new Date(logged_at);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ ok: false, error: "logged_at must be a valid ISO date string." });
    }
    const day_bucket = dateObj.toISOString().slice(0, 10);

    if (ingest_type === "manual") {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ ok: false, error: "items[] is required for manual meal log." });
      }
      if (!items.some((i) => i.calories && i.calories > 0)) {
        return res.status(400).json({ ok: false, error: "At least one item must have calories > 0." });
      }
      // Save manual meal log
      const meal = new MealLog({
        tenant_id,
        user_id,
        day_bucket,
        ingest_type,
        items,
        photo_assets: [],
        notes,
        logged_at: dateObj,
        created_at: new Date(),
      });
      await meal.save();
      return res.json({ ok: true });
    }

    if (ingest_type === "photo") {
      if (!req.file) {
        return res.status(400).json({ ok: false, error: "Photo file is required for photo meal log." });
      }
      // Generate asset_id and S3 key
      const asset_id = randomUUID();
      const yyyy = dateObj.getUTCFullYear();
      const mm = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getUTCDate()).padStart(2, "0");
      const s3_key = `hc-prod/media/${user_id}/${yyyy}/${mm}/${dd}/${asset_id}.jpg`;

      // Upload to S3
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3_key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }));

      // Save meal log with photo asset metadata
      const photo_assets = [{
        asset_id,
        s3_key,
        mime_type: req.file.mimetype,
        size_bytes: req.file.size,
      }];
      const meal = new MealLog({
        tenant_id,
        user_id,
        day_bucket,
        ingest_type,
        items: [],
        photo_assets,
        notes,
        logged_at: dateObj,
        created_at: new Date(),
      });
      await meal.save();
      return res.json({ ok: true, asset_id, s3_key });
    }

    return res.status(400).json({ ok: false, error: "ingest_type must be manual or photo." });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;