const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const GlucoseLog = require("../models/glucoseLog");

// POST /api/glucose/log
router.post("/log", async (req, res) => {
  try {
    const { value_mgdl, logged_at, notes } = req.body;
    // Simulate tenant/user from auth/session (replace with real logic)
    const tenant_id = req.tenant_id || "demo-tenant";
    const user_id = req.user_id
      ? mongoose.Types.ObjectId(req.user_id)
      : mongoose.Types.ObjectId("000000000000000000000000");
    if (typeof value_mgdl !== "number" || value_mgdl < 40 || value_mgdl > 500) {
      return res.status(400).json({
        ok: false,
        error: "Invalid glucose value. Must be between 40 and 500 mg/dL.",
      });
    }
    if (!logged_at) {
      return res
        .status(400)
        .json({ ok: false, error: "logged_at is required." });
    }
    const dateObj = new Date(logged_at);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        ok: false,
        error: "logged_at must be a valid ISO date string.",
      });
    }
    const day_bucket = dateObj.toISOString().slice(0, 10);
    const log = new GlucoseLog({
      tenant_id,
      user_id,
      day_bucket,
      value_mgdl,
      logged_at: dateObj,
      notes,
      created_at: new Date(),
    });
    await log.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// GET /api/glucose/trend?range=7d
// GET /api/glucose/trend?range=7d OR ?from=2025-09-01&to=2025-09-30
// GET /api/glucose/trend
router.get("/trend", async (req, res) => {
  try {
    const tenant_id = req.tenant_id || "demo-tenant";
    const user_id = req.user_id
      ? new mongoose.Types.ObjectId(req.user_id)
      : new mongoose.Types.ObjectId("000000000000000000000000");

    let fromDate, toDate;

    if (req.query.from && req.query.to) {
      fromDate = new Date(req.query.from);
      toDate = new Date(req.query.to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(400).json({
          ok: false,
          error: "Invalid from/to date format. Use YYYY-MM-DD.",
        });
      }
      fromDate.setUTCHours(0, 0, 0, 0);
      toDate.setUTCHours(23, 59, 59, 999);

    } else {
      let range = req.query.range || "7d";
      let days = 7;
      if (/^(\d+)d$/.test(range)) {
        days = parseInt(range);
      }
      toDate = new Date();
      toDate.setUTCHours(23, 59, 59, 999);
      fromDate = new Date();
      fromDate.setDate(toDate.getDate() - days + 1);
      fromDate.setUTCHours(0, 0, 0, 0);
    }

    // Aggregate existing glucose logs
    const results = await GlucoseLog.aggregate([
      {
        $match: {
          tenant_id,
          user_id,
          logged_at: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: "$day_bucket",
          avg_mgdl: { $avg: "$value_mgdl" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Convert results to map for easy lookup
    const resultMap = {};
    results.forEach(r => {
      resultMap[r._id] = Math.round(r.avg_mgdl);
    });

    // Fill in missing days
    const trend = [];
    let cursor = new Date(fromDate);
    while (cursor <= toDate) {
      const dayStr = cursor.toISOString().slice(0, 10);
      trend.push({
        date: dayStr,
        avg_mgdl: resultMap[dayStr] ?? null   // null if no entry
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.json({ ok: true, trend });
  } catch (err) {
    console.error("Trend error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;
