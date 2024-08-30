const express = require("express");
const {
  initiateWithdrawal,
  initiateTelegramWithdrawal,
  getPaymentHistory,
  getExchangeRates,
} = require("../controllers/paymentController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/exchange-rates", getExchangeRates);
router.post("/withdraw", auth, initiateWithdrawal);
router.post("/withdraw-telegram", auth, initiateTelegramWithdrawal);
router.get("/history", auth, getPaymentHistory);

module.exports = router;
