const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: String,
    shortCode: { type: String, unique: true },
    clicks: { type: Number, default: 0 },
    expiresAt: Date,
    clickLog: [{
      timestamp: { type: Date, default: Date.now },
      userAgent: String,
      referer: String
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
