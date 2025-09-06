const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER, // verified sender
    subject,
    text,
    html,
  };
  await sgMail.send(msg);
};

module.exports = sendEmail;
