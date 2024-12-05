const authRoutes = require("../Router/Auth");
const userRouters = require("../Router/User");
const resetpasswordRouters = require("../Router/User/ForgetPassword");
const GiftcodeRouters = require("../Router/User/Giftcode");

const userRoutes = [
  { path: "/api", router: authRoutes },
  { path: "/api", router: userRouters },
  { path: "/api", router: resetpasswordRouters },
  { path: "/api", router: GiftcodeRouters },
];

module.exports = userRoutes;
