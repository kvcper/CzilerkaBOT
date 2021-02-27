const mongoose = require("mongoose");

const CstatySchema = mongoose.Schema({
  userID: String,
  guildID: String,
  time: String,
  czas: String,
});

module.exports = mongoose.model("Mutyvc", CstatySchema)