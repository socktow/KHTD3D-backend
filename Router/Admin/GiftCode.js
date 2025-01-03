const express = require("express");
const Giftcode = require("../../Schema/GiftcodeSchema");

const router = express.Router();

router.get("/giftcode", async (req, res) => {
  try {
    const giftcodes = await Giftcode.find();
    res.json(giftcodes);
  } catch (error) {
    console.error("Error fetching giftcodes:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/create-giftcode", async (req, res) => {
  try {
    const { name, code, items = [], title, usage, content, expiryDate } = req.body;

    // Log the received data for debugging
    console.log("Received data:", req.body);

    if (!Array.isArray(items)) {
      throw new Error("Invalid items format. Expected an array.");
    }

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
