const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { tyoe: String, required: true },
    emoji: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//hashear las password para encriptarlas
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);

  //y continua gracias a next()
  next();
});

module.exports = mongoose.model('users', userSchema);
