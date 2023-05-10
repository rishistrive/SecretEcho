const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = { dbConnect };
