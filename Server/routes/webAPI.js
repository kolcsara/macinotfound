const router = require('express').Router();
const mongo = require('../managers/mongoAcces');

router.get('/api/getLast24', async (req, res) => {
  res.json(await mongo.getLast24());
});

router.post('/api/mobileDanger', async (req, res) => {
  const toLog = {
    warningLevel: req.warningLevel,
    coordinates: req.coordinates,
    animalObserved: req.animalObserved,
    voiceToPlay: `${req.animalObserved}Danger.mp3`,
    dateTime: new Date(),
  };
  await mongo.logToMongo(toLog);
  res.json({ ok: 'ok' });
});

router.get('api/statistics', async (req, res) => {
  res.json({ implementd: 'Not yet implemented...' });
});

module.exports = router;
