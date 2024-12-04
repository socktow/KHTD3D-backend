const cron = require('node-cron');
const { deleteExpiredTokens } = require("../Schema/PasswordReset");

const setupCronJobs = async () => {
    // Xóa Token hệ thống hết hạn
  await deleteExpiredTokens();
  cron.schedule('0 * * * *', async () => {
    await deleteExpiredTokens();
  });
};

module.exports = setupCronJobs;
