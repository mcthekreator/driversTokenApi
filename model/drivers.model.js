const mongoose = require("mongoose");

const driverSchema = mongoose.Schema(
  {
    name: { type: String, required: false },
    licenseNumber: { type: String, require: true },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Driver", driverSchema);
