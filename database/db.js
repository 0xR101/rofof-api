const mongoose = require("mongoose");

const uri =
  "mongodb+srv://Rofouf:rofouf123@rofouf.hcc5gvz.mongodb.net/Rofouf?retryWrites=true&w=majority&appName=Rofouf";

module.exports = {
  connectToDb: async (cb) => {
    try {
      await mongoose.connect(uri);

      return cb();
    } catch (err) {
      console.log(err);
      return cb(err);
    }
  },
  getDb: () => mongoose,
};
