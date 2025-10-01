// const express = require("express");
// const router = express.Router();
// const { evaluateNudges } = require("../services/nudgeService");

// // POST /api/nudge/evaluate
// // Body: { user_id: string, date?: ISO string }
// router.post("/evaluate", async (req, res) => {
//   try {
//     const { user_id, date } = req.body;
//     if (!user_id)
//       return res.status(400).json({ ok: false, error: "user_id is required" });
//     const nudges = await evaluateNudges(
//       user_id,
//       date ? new Date(date) : new Date()
//     );
//     res.json({ ok: true, nudges });
//   } catch (err) {
//     res.status(500).json({ ok: false, error: "Server error" });
//   }
// });

// module.exports = router;
