const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Client, resources } = require("coinbase-commerce-node");
const axios = require("axios");

const coinbaseClient = Client.init(process.env.COINBASE_API_KEY);
const { Charge } = resources;

exports.processBankPayment = async (amount, details) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: "usd",
      payment_method_types: ["card"],
      payment_method: details.paymentMethodId,
      confirm: true,
    });
    return { success: true, transactionId: paymentIntent.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.processMobilePayment = async (amount, details) => {
  try {
    // M-Pesa integration (example for Safaricom M-Pesa)
    const response = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: process.env.MPESA_PASSWORD,
        Timestamp: new Date().toISOString(),
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: details.phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: details.phoneNumber,
        CallBackURL: `${process.env.BASE_URL}/api/payments/mpesa-callback`,
        AccountReference: "TaskMaster Withdrawal",
        TransactionDesc: "Withdrawal from TaskMaster",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MPESA_AUTH_TOKEN}`,
        },
      },
    );
    return { success: true, transactionId: response.data.CheckoutRequestID };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.processCryptoPayment = async (amount, details) => {
  try {
    const charge = await Charge.create({
      name: "TaskMaster Withdrawal",
      description: "Withdrawal from TaskMaster balance",
      local_price: {
        amount: amount.toString(),
        currency: "USD",
      },
      pricing_type: "fixed_price",
    });
    return { success: true, chargeId: charge.id, chargeUrl: charge.hosted_url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
