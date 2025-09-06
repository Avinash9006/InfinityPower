const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // used for subdomain
  domain: String,
  theme: {
    logoUrl: String,
    primaryColor: String,
    secondaryColor: String,
  },
  billingPlan: { type: String, default: "free" },
}, { timestamps: true });

module.exports = mongoose.model("Tenant", tenantSchema);
