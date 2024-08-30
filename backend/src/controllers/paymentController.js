const User = require("../models/User");
const Payment = require("../models/Payment");
const {
  processBankPayment,
  processMobilePayment,
  processCryptoPayment,
} = require("../services/paymentService");

exports.initiateWithdrawal = async (req, res) => {
  try {
    const { amount, method, details } = req.body;
    const user = await User.findById(req.user._id);

    if (user.balance < amount || amount < 5) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    let paymentResult;
    switch (method) {
      case "bank":
        paymentResult = await processBankPayment(amount, details);
        break;
      case "mobile":
        paymentResult = await processMobilePayment(amount, details);
        break;
      case "crypto":
        paymentResult = await processCryptoPayment(amount, details);
        break;
      default:
        return res.status(400).json({ message: "Invalid payment method" });
    }

    if (paymentResult.success) {
      user.balance -= amount;
      await user.save();

      const payment = new Payment({
        user: user._id,
        amount,
        method,
        details,
        status: "completed",
      });
      await payment.save();

      res.json({ message: "Withdrawal successful", newBalance: user.balance });
    } else {
      res
        .status(400)
        .json({ message: "Withdrawal failed", error: paymentResult.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
