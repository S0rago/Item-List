const router = require('express').Router();
let Killer = require('../models/killer.model');

router.route('/').get((req, res) => {
    Killer.find()
    .then(killers => res.json(killers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;

  const newKiller = new Killer({name});

  newKiller.save()
    .then(() => res.json('New Killer added!'))
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res.json('New Killer added!'));
});

router.route('/:id').delete((req, res) => {
  Killer.findByIdAndDelete(req.params.id)
    .then(() => res.json('Killer deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;