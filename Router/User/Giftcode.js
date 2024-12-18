const express = require("express");
const Giftcode = require("../../Schema/GiftcodeSchema");
require("dotenv").config();
const giftcodeServiceUrl = process.env.GIFTCODESERVICEURL;
const axios = require("axios");
const router = express.Router();

router.get("/giftcode", async (req, res) => {
  try {
    const giftcodes = await Giftcode.find();
    const giftcodesResponse = giftcodes.map((giftcode) => ({
      name: giftcode.name,
      code: giftcode.code,
      usage: giftcode.usage,
      expiryDate: giftcode.expiryDate,
    }));
    res.json(giftcodesResponse);
  } catch (error) {
    console.error("Error fetching giftcodes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/giftcode/redeem", async (req, res) => {
  try {
    const { code, uid } = req.body;
    const giftcode = await Giftcode.findOne({ code: { $regex: new RegExp(`^${code}$`, "i") } });
    if (!giftcode) {
      return res.status(404).json({ message: "Giftcode không hợp lệ" });
    }
    const currentDate = new Date();
    if (new Date(giftcode.expiryDate) < currentDate) {
      return res.status(400).json({ message: "Giftcode đã hết hạn" });
    }
    if (giftcode.usage <= 0) {
      return res.status(400).json({ message: "Giftcode đã được sử dụng hết" });
    }

    // Chuẩn bị dữ liệu gửi đến PHP API
    const requestData = {
      type: "codemail",
      uid,
      qu: "1",
      checknum: "123456",
      title: giftcode.title,
      content: giftcode.content,
    };

    // Thêm các item và quantity từ GiftCode
    giftcode.items.forEach((item, index) => {
      requestData[`item${index + 1}`] = item.itemId.toString();
      requestData[`num${index + 1}`] = item.quantity.toString();
    });

    const response = await axios.post(giftcodeServiceUrl, requestData);
    if (response.status === 200) {
      giftcode.usage -= 1;
      await giftcode.save();

      return res.status(200).json({ message: "Giftcode báo nhận thành công" });
    } else {
      return res.status(500).json({ message: "Gửi đến API thất bại", error: response.data });
    }
  } catch (error) {
    console.error("Error redeeming giftcode:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
