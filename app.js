const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const glucoseRouter = require("./routes/glucose");
const mealRouter = require("./routes/meal");
// const journalRouter = require("./routes/journal");
// const nudgeRoutes = require("./routes/nudgeRoutes");
const app = express();
app.use(bodyParser.json());

// Mount routers

app.use("/api/glucose", glucoseRouter);
app.use("/api/meal", mealRouter);
// app.use("/api/journal", journalRouter);
// Health check
app.get("/health", (req, res) => res.json({ ok: true }));
// app.use("/api/nudge", nudgeRoutes);
// MongoDB connection (replace URI with env/config in production)
mongoose
  .connect("mongodb://localhost:27017/metabolic_health", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
