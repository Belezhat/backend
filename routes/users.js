var express = require('express');
var router = express.Router();
const User = require('../models/users');
const uid2 = require ('uid2');
const bcrypt = require ('bcrypt');

const { checkBody } = require('../modules/checkBody');
//signup


router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields!' });
    return;
  }

  const token = uid2(32);
  const hash = bcrypt.hashSync(password, 10);

  User.findOne({ username: username }).then((data) => {
    if (data === null) {
      const newUser = new User({
        username: username,
        password: hash,
        token: token,
        canBoomarks: true
      });

      newUser.save().then((data) => {
        res.json({ result: true, token:token });
      });
    } else {
      res.json({ result: false, error: 'User already exists !' });
    }
  });
});

router.post('/signin', (req, res) => {
  const { username } = req.body;

  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields!' });
    return;
  }

  User.findOne({ username: username }).then((data) => {
    if (data) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'User not found!' });
    }
  });
});

module.exports = router;