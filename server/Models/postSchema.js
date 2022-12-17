const mongoose = require("mongoose");
const schema = mongoose.Schema({
  post:{
    type: String
  }
});

const postModel = mongoose.model("posts", schema );

module.exports = postModel;