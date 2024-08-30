const Joi = require("joi");

exports.registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.withdrawalSchema = Joi.object({
  amount: Joi.number().min(5).required(),
  method: Joi.string().valid("bank", "mobile", "crypto").required(),
  details: Joi.object().required(),
});
