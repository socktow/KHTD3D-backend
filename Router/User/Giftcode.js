const express = require("express");
const Giftcode = require("../../Schema/GiftcodeSchema");
const userGiftcode = require("../../Schema/UserGiftCode");
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

module.exports = router;
