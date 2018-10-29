const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(`Could not connect to MongoDB: ${err.errmsg}`));

module.exports = mongoose;
