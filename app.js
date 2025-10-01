const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const glucoseRouter = require("./routes/glucose");
const mealRouter = require("./routes/meal");

const app = express();
app.use(bodyParser.json());

// Mount routers

app.use("/api/glucose", glucoseRouter);
app.use("/api/meal", mealRouter);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

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
