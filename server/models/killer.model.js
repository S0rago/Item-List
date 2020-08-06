const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const killerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
});

const Killer = mongoose.model('Killer', killerSchema);

module.exports = Killer;