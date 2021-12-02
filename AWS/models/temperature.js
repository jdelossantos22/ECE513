var db = require("../db");

  var temperatureSchema = new db.Schema({
      postDate: Date,
      temperature: Number,
      humidity: Number

});

const Temperature = db.model("Temperature", temperatureSchema);

module.exports = Temperature;