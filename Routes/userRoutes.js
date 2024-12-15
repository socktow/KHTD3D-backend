const authRoutes = require("../Router/Auth");
const userRouters = require("../Router/User");
const GiftcodeRouters = require("../Router/User/Giftcode");
const BaiVietRouters = require("../Router/User/BaiViet");
const userRoutes = [
  { path: "/api", router: authRoutes },
  { path: "/api", router: userRouters },
  { path: "/api", router: GiftcodeRouters },
  { path: "/api", router: BaiVietRouters },
];

module.exports = userRoutes;
