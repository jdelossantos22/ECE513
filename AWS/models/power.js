var db = require("../db");

  var powerSchema = new db.Schema({
      postDate: Date,
      power: Number

});

const Power = db.model("Power", powerSchema);

module.exports = Power;