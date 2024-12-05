const express = require("express");
const Giftcode = require("../../Schema/GiftcodeSchema");
const router = express.Router();

router.post("/create-giftcode", async (req, res) => {
  try {
    const { name, code, items, title, content, expiryDate } = req.body;
    const parsedItems = items.map((item) => {
      if (!item.itemId || !item.quantity || item.quantity <= 0) {
        throw new Error("Invalid item format or quantity");
      }
      return { itemId: item.itemId, quantity: item.quantity };
    });
    const newGiftcode = new Giftcode({
      name,
      code,
      items: parsedItems,
      title,
      content,
      expiryDate,
    });
    await newGiftcode.save();
    res
      .status(201)
      .json({ message: "Giftcode created successfully", newGiftcode });
  } catch (error) {
    console.error("Error creating giftcode:", error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
