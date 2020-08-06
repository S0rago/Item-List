const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemname: { type: String, required: true, unique: true },
  itemtype: { type: String, required: true },
  killer: { type: String, required: true },
  boostamount: { type: Number, required: true },
  mainstattype: { type: String, required: false },
  statvalue: { type: Number, required: false },
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;