const express = require("express");
const router = express.Router();
const UserPayment = require("../../Schema/UserpaymentSchema"); // Đường dẫn tới schema của bạn

router.post("/", async (req, res) => {
  try {
    console.log(req.body); // In ra dữ liệu gửi đến để kiểm tra
    const { username, paymentMethod, amount, status, transactionId, time } =
      req.body;

    // Kiểm tra nếu các trường bắt buộc không có
    if (
      !username ||
      !paymentMethod ||
      !amount ||
      !status ||
      !transactionId ||
      !time
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Tạo bản ghi thanh toán mới
    const newPayment = new UserPayment({
      username,
      paymentMethod,
      amount,
      status,
      transactionId,
      time,
    });

    // Lưu vào database
    const savedPayment = await newPayment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

router.get("/", async (req, res) => {
  try {
    const payments = await UserPayment.find();
    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: `Failed to fetch payments: ${error.message}` });
  }
});


module.exports = router;
