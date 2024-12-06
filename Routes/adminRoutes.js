const admingiftcodeRouters = require("../Router/Admin/GiftCode");
const articlesRouters = require("../Router/Admin/BaiViet");
const uploadRouters = require("../Router/Admin/Upload");
const adminRoutes = [
  { path: "/admin", router: admingiftcodeRouters },
  { path: "/admin", router: articlesRouters },
  { path: "/admin", router: uploadRouters },
];

module.exports = adminRoutes;
