// // routes/journal.js
// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const AuditLog = require("../models/auditLog");

// // Define the FORBIDDEN_TERMS and MISSPELLINGS manually
// const FORBIDDEN_TERMS = [
//     // Prescription drugs and controlled substances
//     "steroids", "anabolic", "opioids", "cocaine", "heroin", "mdma", "xanax", 
//     "adderall", "viagra", "sildenafil", "tadalafil", "morphine", "lsd", 
//     "fentanyl", "oxycodone", "hydrocodone", "codeine", "methadone", "tramadol", 
//     "ketamine", "methamphetamine", "amphetamine", "benzodiazepine", "diazepam", 
//     "clonazepam", "lorazepam", "alprazolam", "ritalin", "methylphenidate", 
//     "dexedrine", "suboxone", "buprenorphine", "vicodin", "percocet", 
//     "oxycontin", "ambien", "zolpidem", "valium", "ativan", "klonopin","kill",
//     "sleeping pills","alcohol","die","hang",

//     // Recreational drugs & slang
//     "weed", "marijuana", "cannabis", "pot", "hash", "thc", "cbd", "edibles", 
//     "shrooms", "psilocybin", "acid", "ecstasy", "molly", "speed", "crack", 
//     "crystal meth", "pcp", "special k", "dope", "smack", "roxies", "percs", 
//     "xannies", "addy", "vyvanse", "kush", "dabs", "wax", "bud", "chronic", 
//     "ganja", "reefer", "blow", "snow", "ice", "tina", "lean","overdose","testing purposes",
//     "testing","dying"
// ];

// const MISSPELLINGS = [
//     "steriods", "opiods", "cocain", "her0in", "xannax", "adderal", "viaggra", 
//     "v1agra", "m0rphine", "vic0din", "perc0cet", "oxycontin3", "ritallin", 
//     "sub0xone", "w33d", "mar1juana", "shr00m", "3xtasy", "m0lly", "m3th", 
//     "lean", "k@va"
// ];

// // POST /journal-msg to receive journaling input
// router.post("/journal-msg", async (req, res) => {
//   try {
//     const { user_id, text } = req.body;

//     if (!text || typeof text !== "string") {
//       return res.status(400).json({
//         ok: false,
//         error: "Text input is required and should be a string.",
//       });
//     }

//     // Check if the text contains any forbidden terms or misspellings
//     const containsForbiddenTerms = FORBIDDEN_TERMS.some((term) => text.toLowerCase().includes(term));
//     const containsMisspellings = MISSPELLINGS.some((term) => text.toLowerCase().includes(term));

//     // If unsafe or contains bad language, log it in AuditLogs
//     if (containsForbiddenTerms || containsMisspellings) {
//       const auditLog = new AuditLog({
//         actor_type: "user",      // Assuming 'user' is the actor
//         actor_id: user_id,      // Actor is the user ID
//         action: "journal entry flagged", 
//         payload: text,
//         severity: "critical",   // Mark as critical for bad language
//       });
//       await auditLog.save();  // Save the flagged entry to the database
//     }

//     res.json({
//       ok: true,
//       message: (containsForbiddenTerms || containsMisspellings) 
//                ? "Journal entry flagged." 
//                : "Journal entry saved.",
//       flagged: (containsForbiddenTerms || containsMisspellings),
//     });

//   } catch (err) {
//     console.error("Journal entry error:", err);
//     res.status(500).json({ ok: false, error: "Server error." });
//   }
// });

// module.exports = router;
