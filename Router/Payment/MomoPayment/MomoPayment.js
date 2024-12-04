const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const config = require("../../config.json");
// middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// Payment endpoint
router.post("/payment", async (req, res) => {
  try {
    const momoConfig = config.momoConfig;
    const { amount } = req.body; 
    const orderId = momoConfig.partnerCode + new Date().getTime();
    const requestId = orderId;
    const orderInfo = `Asuna - ${orderId}`;
    const rawSignature =
      "accessKey=" +
      momoConfig.accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      momoConfig.extraData +
      "&ipnUrl=" +
      momoConfig.ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      momoConfig.partnerCode +
      "&redirectUrl=" +
      momoConfig.redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      momoConfig.requestType;

    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: momoConfig.partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      lang: momoConfig.lang,
      requestType: momoConfig.requestType,
      autoCapture: momoConfig.autoCapture,
      extraData: momoConfig.extraData,
      orderGroupId: momoConfig.orderGroupId,
      signature: signature,
    });

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const result = await axios(options);
    console.log("User đã tạo payment");
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
});

// Callback endpoint
router.post("/callback", async (req, res) => {
  console.log("callback: ");
  console.log(req.body);
  if (req.body.resultCode === 0) {
    console.log("Thanh toán thành công");
  } else if (req.body.resultCode === 5) {
    console.log("Người dùng đã hủy giao dịch");
  } else if (req.body.resultCode === 9) {
    console.log("Thông tin đơn hàng không hợp lệ");
  } else if (req.body.resultCode === 11) {
    console.log("Giao dịch bị từ chối bởi hệ thống ngân hàng");
  } else if (req.body.resultCode === 12) {
    console.log("Giao dịch bị từ chối do không đủ số dư");
  } else if (req.body.resultCode === 13) {
    console.log("Giao dịch bị từ chối bởi Momo");
  } else {
    console.log("Thanh toán thất bại với mã lỗi: ", req.body.resultCode);
  }
  return res.redirect(
    `http://localhost:3000/testpayment?resultCode=${req.body.resultCode}`
  );
});

// Check status transaction endpoint
router.post("/checkmomopayment", async (req, res) => {
  try {
    const { orderId } = req.body;
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const accessKey = "F8BBA842ECF85";
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    const requestBody = JSON.stringify({
      partnerCode: "MOMO",
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: "vi",
    });
    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
});

module.exports = router;
