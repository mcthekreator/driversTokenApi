const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
  {
    token: { type: String, required: false },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    type: String
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Token", tokenSchema);
