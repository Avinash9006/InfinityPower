const Tenant = require('../models/tenantModel');
const sendEmail = require('../utils/email');

const sendInvite = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    const inviteLink = `${process.env.FRONTEND_URL}/register?tenant=${tenant._id}`;

    await sendEmail(
      email,
      `You're invited to join ${tenant.name}`,
      `Click here to join: ${inviteLink}`,
      `<p>Click here to join: <a href="${inviteLink}">${inviteLink}</a></p>`
    );

    res.json({ success: true, message: "Invite sent successfully" });
  } catch (err) {
    console.error("Invite Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = sendInvite;
