var db = require("../db");

var tokenSchema = new db.Schema({
    _userId:    { type: db.Schema.Types.ObjectId, required: true, ref: 'User' },
    token:      { type: String, required: true },
    createdAt:  { type: Date, required: true, default: Date.now, expires: 2023}
});

var Ttoken = db.model("Token", tokenSchema);

module.exports = Ttoken;