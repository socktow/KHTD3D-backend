const express = require("express");
const router = express.Router();
const { query } = require("../Services/MySQLService");

router.get("/charlist", async (req, res) => {
  try {
    const rows = await query(
      "SELECT SEPTMBRID, SEPTMBRTEMPID, SEPTMBRNAME, SEPTMBRZONE FROM septmember"
    );
    const formattedRows = rows.map((row) => ({
      id: row.SEPTMBRID,
      tempId: row.SEPTMBRTEMPID,
      name: row.SEPTMBRNAME,
      zone: row.SEPTMBRZONE,
    }));
    res.json({ charlist: formattedRows });
  } catch (error) {
    console.error("MySQL Query Error:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

router.get("/charlist/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query(
      "SELECT SEPTMBRID, SEPTMBRTEMPID, SEPTMBRNAME, SEPTMBRZONE FROM septmember WHERE SEPTMBRID = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Character not found with this ID" });
    }

    const char = {
      id: rows[0].SEPTMBRID,
      tempId: rows[0].SEPTMBRTEMPID,
      name: rows[0].SEPTMBRNAME,
      zone: rows[0].SEPTMBRZONE,
    };
    res.json({ char });
  } catch (error) {
    console.error("MySQL Query Error:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

router.get("/charlist/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const rows = await query(
      "SELECT SEPTMBRID, SEPTMBRTEMPID, SEPTMBRNAME, SEPTMBRZONE FROM septmember WHERE SEPTMBRNAME LIKE ?",
      [`%${name}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No characters found with this name" });
    }

    const formattedRows = rows.map((row) => ({
      id: row.SEPTMBRID,
      tempId: row.SEPTMBRTEMPID,
      name: row.SEPTMBRNAME,
      zone: row.SEPTMBRZONE,
    }));
    res.json({ charlist: formattedRows });
  } catch (error) {
    console.error("MySQL Query Error:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

module.exports = router;
