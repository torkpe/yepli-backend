import sendGrid from '@sendgrid/mail';

export async function sendMail({ to, subject, message }) {
  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    console.log(`Sending email to: ${to}`);

    await sendGrid.send({
      to,
      from: process.env.MAIL_SENDER_ADDRESS,
      subject,
      html: message,
    });
  } catch (err) {
    console.log(err.toString())
    throw err;
  }
}
