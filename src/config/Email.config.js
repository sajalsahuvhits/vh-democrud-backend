import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  // host: "127.0.0.1",
  // port: 25,
  // secure: false, // true for 465, false for other ports
  service: "Gmail",
  auth: {
    user: process.env.USER, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

export const transport = (toEmail, subject, emailBody) => {
  return new Promise(function (resolve, reject) {
    const mailing = {
      from: 'no-reply@vhits.com',
      to: toEmail,
      subject: subject,
      text: emailBody,
    };
    transporter.sendMail(mailing, (err, data) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(1);
      }
    });
  });
};