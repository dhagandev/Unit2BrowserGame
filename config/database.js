var mongoose = require('mongoose');

console.log("Debugging ====");
console.log(process.env.DATABASE_URL);
console.log("Debugging ====");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
  console.log(`Mongoose connected to: ${process.env.DATABASE_URL}`);
});

module.exports = mongoose;