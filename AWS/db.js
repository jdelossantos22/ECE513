var mongoose = require("mongoose");

//mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost/myDB", { useNewUrlParser: true, useUnifiedTopology: true}); //, useCreateIndex: true 


module.exports = mongoose;