const User = require("../models/User");
const Payment = require("../models/Payment");
const AppError = require("../utils/AppError");
const {
  processCryptoPayment,
  processTelegramPayment,
  getExchangeRates,
} = require("../services/paymentService");

exports.getExchangeRates = async (req, res, next) => {
  try {
    const rates = await getExchangeRates();
    res.status(200).json({
      status: "success",
      data: { rates },
    });
  } catch (error) {
    next(new AppError("Error fetching exchange rates", 500));
  }
};

exports.initiateWithdrawal = async (req, res, next) => {
  try {
    const { amount, cryptoCurrency, walletAddress } = req.body;
    const user = await User.findById(req.user._id);

    if (user.balance < amount || amount < 5) {
      return next(new AppError("Invalid withdrawal amount", 400));
    }

    const paymentResult = await processCryptoPayment(
      amount,
      cryptoCurrency,
      walletAddress,
    );

    if (paymentResult.success) {
      user.balance -= amount;
      await user.save();

      const payment = new Payment({
        user: user._id,
        amount,
        cryptoCurrency,
        cryptoAmount: paymentResult.cryptoAmount,
        walletAddress,
        transactionHash: paymentResult.transactionHash,
        status: "completed",
      });
      await payment.save();

      res.status(200).json({
        status: "success",
        message: "Withdrawal successful",
        data: {
          newBalance: user.balance,
          payment: {
            amount,
            cryptoCurrency,
            cryptoAmount: paymentResult.cryptoAmount,
            transactionHash: paymentResult.transactionHash,
          },
        },
      });
    } else {
      next(new AppError("Withdrawal failed", 400));
    }
  } catch (error) {
    next(error);
  }
};

exports.initiateTelegramWithdrawal = async (req, res, next) => {
  try {
    const { amount, telegramUserId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.balance < amount || amount < 5) {
      return next(new AppError("Invalid withdrawal amount", 400));
    }

    const paymentResult = await processTelegramPayment(amount, telegramUserId);

    if (paymentResult.success) {
      user.balance -= amount;
      await user.save();

      const payment = new Payment({
        user: user._id,
        amount,
        cryptoCurrency: "USDT",
        cryptoAmount: amount,
        walletAddress: "Telegram",
        status: "pending",
      });
      await payment.save();

      res.status(200).json({
        status: "success",
        message: "Telegram withdrawal initiated",
        data: {
          newBalance: user.balance,
          paymentId: payment._id,
        },
      });
    } else {
      next(new AppError("Withdrawal initiation failed", 400));
    }
  } catch (error) {
    next(error);
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
