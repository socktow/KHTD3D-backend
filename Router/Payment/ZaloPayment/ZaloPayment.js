const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("qs"); 
const moment = require("moment"); 
const config = require("../../config.json");
const CryptoJS = require("crypto-js"); 

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/payment", async (req, res) => {
  const embed_data = {
    redirecturl: "http://localhost:3000/paymentsuccess",
  };

  const items = [];
  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: config.zaloConfig.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: req.body.amount,
    callback_url: "https://234b-113-160-235-103.ngrok-free.app/zalo/callback",
    description: `Kuromi - Payment for the order #${transID}`,
    bank_code: "",
  };

  const data =
    order.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.zaloConfig.key1).toString(); 

  try {
    const result = await axios.post(config.zaloConfig.endpoint, null, {
      params: order,
    });
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }
});

router.post("/callback", (req, res) => {
  let result = {};
  console.log(req.body);
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;
    let mac = CryptoJS.HmacSHA256(dataStr, config.zaloConfig.key2).toString();
    console.log("mac =", mac);
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr, config.zaloConfig.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.log("lỗi:::" + ex.message);
    result.return_code = 0;
    result.return_message = ex.message;
  }
  res.json(result);
});

router.post("/checkzalopayment", async (req, res) => {
  const { app_trans_id } = req.body;

  let postData = {
    app_id: config.zaloConfig.app_id,
    app_trans_id,
  };

  let data =
    postData.app_id + "|" + postData.app_trans_id + "|" + config.zaloConfig.key1; 
  postData.mac = CryptoJS.HmacSHA256(data, config.zaloConfig.key1).toString(); 

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log("lỗi",error);
  }
});

module.exports = router;
