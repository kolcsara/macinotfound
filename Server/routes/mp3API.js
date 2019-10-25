const router = require('express').Router();

router.put('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
