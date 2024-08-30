const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  cryptoCurrency: { type: String, required: true }, // e.g., 'BTC', 'ETH', 'USDT'
  cryptoAmount: { type: Number, required: true },
  walletAddress: { type: String, required: true },
  transactionHash: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
