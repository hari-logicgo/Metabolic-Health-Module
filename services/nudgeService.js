// const NudgeEvent = require("../models/nudgeEvent");
// const { logAudit } = require("../utils/auditLogger");

// // Example: stub data fetchers (replace with real DB queries)
// async function getUserLogs(user_id, date) {
//   // Fetch logs for the user for the given date from various collections
//   // Return an object with all needed info for trigger evaluation
//   return {
//     meals: ["breakfast", "lunch"], // e.g. ['breakfast', 'lunch'] if dinner missing
//     medicationTaken: true,
//     waterIntake: 1200, // ml
//     lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
//     glucoseReadings: [110, 180],
//     steps: 4000,
//     sleep: {
//       start: "2025-09-30T23:30:00Z",
//       end: "2025-10-01T05:00:00Z",
//       duration: 5.5,
//     },
//     supplementsTaken: false,
//     heartRates: [72, 110],
//     workoutDone: false,
//     sedentaryBlocks: [9], // hours
//     hydrationMissed: 3,
//     moodLogged: false,
//     meditationDone: false,
//     weightChange: 2.5, // percent
//     glucoseMeasured: false,
//     restingHR: 105,
//   };
// }

// const TRIGGERS = [
//   {
//     type: "missed_meal",
//     check: (logs) =>
//       ["breakfast", "lunch", "dinner"]
//         .filter((m) => !logs.meals.includes(m))
//         .map((m) => ({
//           trigger_type: "missed_meal",
//           message: `You missed logging your ${m}.`,
//           severity: "warning",
//           confidence: 0.95,
//         })),
//   },
//   {
//     type: "skipped_medication",
//     check: (logs) =>
//       logs.medicationTaken
//         ? []
//         : [
//             {
//               trigger_type: "skipped_medication",
//               message: "You may have missed your medication.",
//               severity: "critical",
//               confidence: 0.98,
//             },
//           ],
//   },
//   {
//     type: "skipped_water",
//     check: (logs) =>
//       logs.waterIntake < 1000
//         ? [
//             {
//               trigger_type: "skipped_water",
//               message: "Low water intake detected.",
//               severity: "warning",
//               confidence: 0.9,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "inactivity_3h",
//     check: (logs) => {
//       const now = new Date();
//       if (now - logs.lastActivity > 3 * 60 * 60 * 1000) {
//         return [
//           {
//             trigger_type: "inactivity_3h",
//             message: "No activity detected for over 3 hours.",
//             severity: "warning",
//             confidence: 0.9,
//           },
//         ];
//       }
//       return [];
//     },
//   },
//   {
//     type: "elevated_glucose",
//     check: (logs) =>
//       logs.glucoseReadings.some((v) => v > 180)
//         ? [
//             {
//               trigger_type: "elevated_glucose",
//               message: "Elevated glucose reading detected.",
//               severity: "critical",
//               confidence: 0.9,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "low_activity",
//     check: (logs) =>
//       logs.steps < 5000
//         ? [
//             {
//               trigger_type: "low_activity",
//               message: "Low activity detected (<5000 steps).",
//               severity: "info",
//               confidence: 0.85,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "high_activity",
//     check: (logs) =>
//       logs.steps > 20000
//         ? [
//             {
//               trigger_type: "high_activity",
//               message: "High activity detected (>20,000 steps).",
//               severity: "info",
//               confidence: 0.85,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "late_sleep",
//     check: (logs) => {
//       const sleepStart = new Date(logs.sleep.start);
//       if (sleepStart.getUTCHours() >= 0 && sleepStart.getUTCHours() < 5) {
//         return [
//           {
//             trigger_type: "late_sleep",
//             message: "Late sleep detected (>12 AM).",
//             severity: "info",
//             confidence: 0.9,
//           },
//         ];
//       }
//       return [];
//     },
//   },
//   {
//     type: "early_waking",
//     check: (logs) => {
//       const sleepEnd = new Date(logs.sleep.end);
//       if (sleepEnd.getUTCHours() < 5) {
//         return [
//           {
//             trigger_type: "early_waking",
//             message: "Early waking detected (<5 AM).",
//             severity: "info",
//             confidence: 0.9,
//           },
//         ];
//       }
//       return [];
//     },
//   },
//   {
//     type: "skipped_supplement",
//     check: (logs) =>
//       logs.supplementsTaken
//         ? []
//         : [
//             {
//               trigger_type: "skipped_supplement",
//               message: "You may have missed your supplement.",
//               severity: "info",
//               confidence: 0.9,
//             },
//           ],
//   },
//   {
//     type: "irregular_heart_rate",
//     check: (logs) =>
//       logs.heartRates.some((hr) => hr < 60 || hr > 100)
//         ? [
//             {
//               trigger_type: "irregular_heart_rate",
//               message: "Irregular heart rate detected.",
//               severity: "warning",
//               confidence: 0.9,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "missed_workout",
//     check: (logs) =>
//       logs.workoutDone
//         ? []
//         : [
//             {
//               trigger_type: "missed_workout",
//               message: "Workout session missed.",
//               severity: "info",
//               confidence: 0.9,
//             },
//           ],
//   },
//   {
//     type: "irregular_sleep_pattern",
//     check: (logs) =>
//       logs.sleep.duration < 4 || logs.sleep.duration > 10
//         ? [
//             {
//               trigger_type: "irregular_sleep_pattern",
//               message: "Irregular sleep pattern detected.",
//               severity: "info",
//               confidence: 0.9,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "excessive_sedentary",
//     check: (logs) =>
//       logs.sedentaryBlocks.some((h) => h > 8)
//         ? [
//             {
//               trigger_type: "excessive_sedentary",
//               message: "Excessive sedentary time detected (>8h).",
//               severity: "warning",
//               confidence: 0.9,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "repeated_missed_hydration",
//     check: (logs) =>
//       logs.hydrationMissed > 2
//         ? [
//             {
//               trigger_type: "repeated_missed_hydration",
//               message: "Repeated missed hydration detected.",
//               severity: "warning",
//               confidence: 0.9,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "missed_mood_journal",
//     check: (logs) =>
//       logs.moodLogged
//         ? []
//         : [
//             {
//               trigger_type: "missed_mood_journal",
//               message: "Mood journal not logged.",
//               severity: "info",
//               confidence: 0.9,
//             },
//           ],
//   },
//   {
//     type: "missed_meditation",
//     check: (logs) =>
//       logs.meditationDone
//         ? []
//         : [
//             {
//               trigger_type: "missed_meditation",
//               message: "Meditation/breathing session missed.",
//               severity: "info",
//               confidence: 0.9,
//             },
//           ],
//   },
//   {
//     type: "abnormal_weight_change",
//     check: (logs) =>
//       Math.abs(logs.weightChange) > 2
//         ? [
//             {
//               trigger_type: "abnormal_weight_change",
//               message: "Abnormal weight change detected (>2% per day).",
//               severity: "warning",
//               confidence: 0.9,
//             },
//           ]
//         : [],
//   },
//   {
//     type: "missed_glucose_measurement",
//     check: (logs) =>
//       logs.glucoseMeasured
//         ? []
//         : [
//             {
//               trigger_type: "missed_glucose_measurement",
//               message: "Glucose measurement missed.",
//               severity: "info",
//               confidence: 0.9,
//             },
//           ],
//   },
//   {
//     type: "abnormal_resting_hr",
//     check: (logs) =>
//       logs.restingHR > 100 || logs.restingHR < 50
//         ? [
//             {
//               trigger_type: "abnormal_resting_hr",
//               message: "Abnormal resting heart rate detected.",
//               severity: "critical",
//               confidence: 0.95,
//             },
//           ]
//         : [],
//   },
// ];

// async function evaluateNudges(user_id, date = new Date()) {
//   const logs = await getUserLogs(user_id, date);
//   let nudges = [];
//   for (const trig of TRIGGERS) {
//     const results = trig.check(logs);
//     for (const nudge of results) {
//       const nudgeObj = {
//         user_id,
//         trigger_type: nudge.trigger_type,
//         severity: nudge.severity,
//         confidence: nudge.confidence,
//         message: nudge.message,
//         disclaimer: "Not medical advice, advisory only.",
//         timestamp: new Date(),
//         meta: { date, ...logs },
//       };
//       nudges.push(nudgeObj);
//       await NudgeEvent.create(nudgeObj);
//       logAudit({
//         action: "nudge_generated",
//         user_id,
//         trigger: nudge.trigger_type,
//         severity: nudge.severity,
//       });
//     }
//   }
//   return nudges;
// }

// module.exports = { evaluateNudges };
