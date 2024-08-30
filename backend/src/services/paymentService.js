const axios = require("axios");
const { Spot } = require("@binance/connector");
const TelegramBot = require("node-telegram-bot-api");

const binanceClient = new Spot(
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET,
);
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

const supportedCryptos = ["BTC", "ETH", "USDT", "BNB"];

exports.getExchangeRates = async () => {
  const rates = {};
  for (const crypto of supportedCryptos) {
    const ticker = await binanceClient.tickerPrice(`${crypto}USDT`);
    rates[crypto] = parseFloat(ticker.data.price);
  }
  return rates;
};

exports.processCryptoPayment = async (
  amount,
  cryptoCurrency,
  walletAddress,
) => {
  try {
    const rates = await this.getExchangeRates();
    const cryptoAmount = amount / rates[cryptoCurrency];

    // For demonstration purposes, we'll just return a success response
    // In a real-world scenario, you'd integrate with your crypto wallet or exchange API to make the transfer
    return {
      success: true,
      cryptoAmount,
      transactionHash: "mock_transaction_hash_" + Date.now(),
    };
  } catch (error) {
    console.error("Crypto payment processing error:", error);
    return { success: false, error: error.message };
  }
};

exports.processTelegramPayment = async (amount, telegramUserId) => {
  try {
    // Send a payment request message to the user via Telegram
    await telegramBot.sendMessage(
      telegramUserId,
      `Please send ${amount} USDT to the following wallet address: ${process.env.COMPANY_WALLET_ADDRESS}`,
    );
    return { success: true, status: "payment_requested" };
  } catch (error) {
    console.error("Telegram payment processing error:", error);
    return { success: false, error: error.message };
  }
};
