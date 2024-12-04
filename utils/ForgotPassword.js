const User = require("../Schema/UsersSchema");
const {PasswordResetToken , deleteExpiredTokens } = require("../Schema/PasswordReset");
const nodemailer = require("nodemailer");

const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const ForgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const verificationCode = generateVerificationCode();
  const expiration = new Date(Date.now() + 10 * 60 * 1000);

  // Lưu mã xác minh với userid
  const resetToken = new PasswordResetToken({
    userid: user.userid,
    token: verificationCode,
    expiration: expiration,
  });

  await resetToken.save();
  await deleteExpiredTokens();
  const transporter = nodemailer.createTransport({
    host: 'mail.kiemhieptinhduyen.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
    <h2>Khoi phục mật khẩu</h2>
    <p>Để khôi phục mật khẩu của bạn, vui lòng nhập mã xác minh dưới đây:</p>
    <h3>${verificationCode}</h3>
    <p>Mã xác minh này sẽ hết hạn trong vòng 10 phút.</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Khôi phục mật khẩu',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = ForgotPassword;
