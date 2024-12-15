const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const pool = mysql.createPool(process.env.MYSQLURL);

router.get("/charlist", async (req, res) => {
  try {
    const [rows] = await pool.query(
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
    console.error("Lỗi khi truy vấn MySQL:", error);
    res.status(500).json({ error: "Không thể truy xuất dữ liệu" });
  }
});
router.get("/charlist/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT SEPTMBRID, SEPTMBRTEMPID, SEPTMBRNAME, SEPTMBRZONE FROM septmember WHERE SEPTMBRID = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy nhân vật với ID này" });
    }

    const char = {
      id: rows[0].SEPTMBRID,
      tempId: rows[0].SEPTMBRTEMPID,
      name: rows[0].SEPTMBRNAME,
      zone: rows[0].SEPTMBRZONE,
    };
    res.json({ char });
  } catch (error) {
    console.error("Lỗi khi truy vấn MySQL:", error);
    res.status(500).json({ error: "Không thể truy xuất dữ liệu" });
  }
});
router.get("/charlist/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.query(
      "SELECT SEPTMBRID, SEPTMBRTEMPID, SEPTMBRNAME, SEPTMBRZONE FROM septmember WHERE SEPTMBRNAME LIKE ?",
      [`%${name}%`]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy nhân vật với tên này" });
    }
    const formattedRows = rows.map((row) => ({
      id: row.SEPTMBRID,
      tempId: row.SEPTMBRTEMPID,
      name: row.SEPTMBRNAME,
      zone: row.SEPTMBRZONE,
    }));
    res.json({ charlist: formattedRows });
  } catch (error) {
    console.error("Lỗi khi truy vấn MySQL:", error);
    res.status(500).json({ error: "Không thể truy xuất dữ liệu" });
  }
});

module.exports = router;
