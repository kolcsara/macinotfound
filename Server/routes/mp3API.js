const fs = require('fs'),
  eformidable = require('express-formidable'),
  speech = require('@google-cloud/speech');
const router = require('express').Router();
const WaveFile = require('wavefile');
const mongo = require('../managers/mongoAcces');

const uploadDir = ('./uploadDir');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
router.use(eformidable({ uploadDir, keepExtensions: true }));
let toLog = false;

function assembelMessage(words) {
  let warningLevel,
    animalObserved,
    voiceToPlay;
  if (words.includes('medve')) {
    animalObserved = 'Medve';
    voiceToPlay = 'MedveWarning.mp3';
    warningLevel = 10;
    toLog = true;
  }

  if (words.includes('farkas')) {
    animalObserved = 'Farkas';
    voiceToPlay = 'FarkasWarning.mp3';
    warningLevel = 8;
    toLog = true;
  }

  if (words.includes('kutya')) {
    animalObserved = 'Kutya';
    voiceToPlay = 'KutyaWarning.mp3';
    warningLevel = 6;
    toLog = true;
  }

  if (words.includes('zalan')) {
    animalObserved = 'Zalan';
    voiceToPlay = 'ZalanWarning.mp3';
    warningLevel = 0;
    toLog = true;
  }

  if (words.includes('sanyika')) {
    animalObserved = 'Sandor';
    voiceToPlay = 'SandorWarning.mp3';
    warningLevel = 0;
    toLog = true;
  }

  return {
    warningLevel,
    coordinates: {
      Longitude: 0,
      Latitude: 0,
    },
    animalObserved,
    voiceToPlay,
    dateTime: new Date(),
  };
}

router.post('/api/mp3', async (req, res) => {
  const { mp3 } = req.files;
  const client = new speech.SpeechClient();
  const wav = new WaveFile(fs.readFileSync(mp3.path));
  wav.toBitDepth('16');
  const audioBytes = wav.toBuffer();
  const audio = {
    content: audioBytes,
  };
  const config = {
    languageCode: 'hu-HU',
  };
  const request = {
    audio,
    config,
  };
  const [response] = await client.recognize(request);
  const words = response.results.map(result => result.alternatives[0].transcript).join('\n');
  const sendBack = assembelMessage(words);
  console.log(words);
  if (toLog) {
    mongo.logToMongo(sendBack);
    res.json(sendBack);
  }
});

module.exports = router;
