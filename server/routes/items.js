const router = require('express').Router();
let Item = require('../models/item.model');

router.route('/').get((req, res) => {
    Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const itemname = req.body.itemname;
  const itemtype = req.body.itemtype;
  const killer = req.body.killer;
  const boostamount = req.body.boostamount;
  const mainstattype = req.body.mainstattype;
  const statvalue = Number(req.body.statvalue);

  const newItem = new Item({
    itemname,
    itemtype,
    killer,
    boostamount,
    mainstattype,
    statvalue,
  });

  newItem.save()
  .then(() => res.json('Item added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Item.findById(req.params.id)
      .then(item => res.json(item))
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/:id').delete((req, res) => {
    Item.findByIdAndDelete(req.params.id)
      .then(() => res.json('Item deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/update/:id').post((req, res) => {
    Item.findById(req.params.id)
      .then(item => {
        item.itemname = req.body.itemname;
        item.itemtype = req.body.itemtype;
        item.killer = req.body.killer;
        item.boostamount = req.body.boostamount;
        item.mainstattype = req.body.mainstattype;
        item.statvalue = req.body.statvalue;
  
        item.save()
          .then(() => res.json('Item updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });

module.exports = router;