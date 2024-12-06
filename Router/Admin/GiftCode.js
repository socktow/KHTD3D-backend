const express = require("express");
const Giftcode = require("../../Schema/GiftcodeSchema");
const fetchUser = require("../../Settings/FetchUser");
const router = express.Router();

router.post("/create-giftcode", fetchUser, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    const { name, code, items, title, usage, content, expiryDate } = req.body;
    const parsedItems = items.map((item) => {
      if (!item.itemId || !item.quantity || item.quantity <= 0) {
        throw new Error("Invalid item format or quantity");
      }
      return { itemId: item.itemId, quantity: item.quantity };
    });
    const newGiftcode = new Giftcode({
      name,
      code,
      usage,
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
