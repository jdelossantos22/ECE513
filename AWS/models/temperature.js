var db = require("../db");

  var temperatureSchema = new db.Schema({
      deviceId: String,
      postDate: Date,
      temperature: Number,
      humidity: Number,
      power: Number

});

const Temperature = db.model("Temperature", temperatureSchema);

module.exports = Temperature;