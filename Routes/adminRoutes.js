const express = require("express");
const admingiftcodeRouters = require("../Router/Admin/GiftCode");
const articlesRouters = require("../Router/Admin/BaiViet");
const uploadRouters = require("../Router/Admin/Upload");
const userRouters = require("../Router/Admin/QuanLyTaiKhoan");
const fetchUser = require("../Settings/FetchUser");
const AdminOnly = require("../Settings/AdminOnly");

const adminRoutes = [
  { path: "/admin", router: admingiftcodeRouters },
  { path: "/admin", router: articlesRouters },
  { path: "/admin", router: uploadRouters },
  { path: "/admin", router: userRouters },
];

const applyAdminMiddleware = (app) => {
  adminRoutes.forEach(({ path, router }) => {
    app.use(path, fetchUser, AdminOnly, router);
  });
};

module.exports = applyAdminMiddleware;