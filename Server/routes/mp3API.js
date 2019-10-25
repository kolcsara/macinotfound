const router = require('express').Router();

router.post('/api/mp3', (req, res) => {
  console.log(req);
  const message = {
    warningLevel: 'High',
    coordinates: 'Itt ne',
    animalObserved: 'Medve',
    voiceToPlay: 'medve.mp3',
  };
  res.json(message);
});

module.exports = router;
