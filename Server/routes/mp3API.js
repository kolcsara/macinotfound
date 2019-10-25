const fs = require('fs'),
  eformidable = require('express-formidable');
const router = require('express').Router();

const uploadDir = ('./uploadDir');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
router.use(eformidable({ uploadDir }));


router.post('/api/mp3', (req, res) => {
  const { mp3 } = req.files;
  fs.rename(mp3.path, `${mp3.path}.mp3`, (err) => { if (err) console.log(err); });
  const message = {
    warningLevel: 'High',
    coordinates: 'Itt ne',
    animalObserved: 'Medve',
    voiceToPlay: 'medve.mp3',
  };
  res.json(message);
});

module.exports = router;
