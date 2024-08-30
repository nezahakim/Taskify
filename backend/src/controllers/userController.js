const User = require("../models/User");
const AppError = require("../utils/AppError");

exports.submitKYC = async (req, res, next) => {
  try {
    const { fullName, dateOfBirth, address, idNumber } = req.body;
    const user = await User.findById(req.user._id);

    user.kyc = {
      fullName,
      dateOfBirth,
      address,
      idNumber,
      status: "pending",
    };

    await user.save();

    res.status(200).json({
      status: "success",
      message: "KYC information submitted successfully",
    });
  } catch (error) {
    next(new AppError("Error submitting KYC information", 400));
  }
};

exports.getKYCStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: "success",
      data: {
        kycStatus: user.kyc ? user.kyc.status : "not submitted",
      },
    });
  } catch (error) {
    next(new AppError("Error fetching KYC status", 400));
  }
};
