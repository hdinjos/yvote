import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailer = async (optionSender) => {
  try {
    const { to, subject, text, html } = optionSender;
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.MAIL_USERNAME, // sender address
      to,
      subject,
      text,
      html,
    });
    console.log(info);
  } catch (err) {
    console.log(err);
  }
};

export default mailer;
