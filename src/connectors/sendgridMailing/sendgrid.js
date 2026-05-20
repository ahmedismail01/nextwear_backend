const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailProvider {
  async sendEmail(options) {
    const from = options.from || `"NextWear" <${process.env.SMTP_USER}>`;
    await sgMail.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}

module.exports = new EmailProvider();
