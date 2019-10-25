const fs = require('fs'),
  eformidable = require('express-formidable'),
  speech = require('@google-cloud/speech');
const router = require('express').Router();
const mongo = require('../managers/mongoAcces');

const uploadDir = ('./uploadDir');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
router.use(eformidable({ uploadDir, keepExtensions: true }));

function assembelMessage(words) {
  let warningLevel,
    animalObserved,
    voiceToPlay;

  if (words.includes('medve')) {
    animalObserved = 'Medve';
    voiceToPlay = 'MedveWarning.mp3';
    warningLevel = 10;
  }

  if (words.includes('farkas')) {
    animalObserved = 'Farkas';
    voiceToPlay = 'FarkasWarning.mp3';
    warningLevel = 8;
  }

  if (words.includes('kutya')) {
    animalObserved = 'Kutya';
    voiceToPlay = 'KutyaWarning.mp3';
    warningLevel = 6;
  }

  if (words.includes('zalan')) {
    animalObserved = 'Zalan';
    voiceToPlay = 'ZalanWarning.mp3';
    warningLevel = 0;
  }

  if (words.includes('sanyika')) {
    animalObserved = 'Sandor';
    voiceToPlay = 'SandorWarning.mp3';
    warningLevel = 0;
  }

  return {
    warningLevel,
    coordinates: '0,0',
    animalObserved,
    voiceToPlay,
    dateTime: new Date(),
  };
}

router.post('/api/mp3', async (req, res) => {
  const { mp3 } = req.files;

  const client = new speech.SpeechClient();
  const fileName = mp3.path;
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'MP3',
    languageCode: 'hu-HU',
    sampleRateHertz: 18000,
  };
  const request = {
    audio,
    config,
  };
  const [response] = await client.recognize(request);
  const words = response.results.map(result => result.alternatives[0].transcript).join('\n');
  const sendBack = assembelMessage(words);
  mongo.logToMongo(sendBack);
  res.json(sendBack);
});

module.exports = router;
