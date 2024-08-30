const express = require("express");
const {
  initiateWithdrawal,
  getPaymentHistory,
} = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { withdrawalSchema } = require("../utils/validationSchemas");

const router = express.Router();

router.post("/withdraw", auth, validate(withdrawalSchema), initiateWithdrawal);
router.get("/history", auth, getPaymentHistory);

module.exports = router;
