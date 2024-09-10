var mongoose = require('mongoose');

var OtpSchema = mongoose.Schema({
  code: { type: String, required: true },
  used: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  validade: { type: Date }
});

module.exports = mongoose.model('otp', OtpSchema);
