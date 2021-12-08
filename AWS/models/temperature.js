var db = require("../db");

  var temperatureSchema = new db.Schema({
      postDate: Date,
      deviceId: String,
      temperature: Number,
      humidity: Number,
      power: Number

});

const Temperature = db.model("Temperature", temperatureSchema);

module.exports = Temperature;