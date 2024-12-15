const express = require("express");
const router = express.Router();
const { query } = require("../Services/MySQLService");

router.get("/", async (req, res) => {
  try {
    const rows = await query("SELECT ID, NAME FROM snapshot");
    const formattedRows = rows.map((row) => ({
      id: row.ID,
      name: row.NAME,
    }));

    res.json({ charlist: formattedRows });
  } catch (error) {
    console.error("MySQL Query Error:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

module.exports = router;
