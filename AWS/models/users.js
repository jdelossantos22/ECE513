var db = require("../db");

var userSchema = new db.Schema({
  email:        { type: String, required: true, unique: true },
  fullName:     { type: String, required: true },
  passwordHash: { type: String, required: true },
  lastAccess:   { type: Date, default: Date.now },
  userDevices:  { type:[String], default:[], sparse:true},
  zip:      {type: Number},
});

const User = db.model("User", userSchema);

module.exports = User;