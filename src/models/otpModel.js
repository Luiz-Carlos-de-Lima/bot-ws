var mongoose = require('mongoose');

var OtpSchema = mongoose.Schema({
  code: { type: String, required: true },
  //Ex: 554187019820
  phone: { type: String, required: true,  },
  used: { type: Boolean, default: false },
  headers: { type: {}, required: true, },
  created_at: { type: Date, default: Date.now },
  validade: { type: Date }
});

module.exports = mongoose.model('otp', OtpSchema);
