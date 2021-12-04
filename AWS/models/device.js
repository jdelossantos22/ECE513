var db = require("../db");

  var deviceSchema = new db.Schema({
      apikey:       String,
      deviceId:     String,
      deviceName: String,
      userEmail:    String,
      startDate: Date

});

var Device = db.model("Device", deviceSchema);

module.exports = Device;