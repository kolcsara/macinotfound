# macinotfound

User storykat felbontani kissebb user storykra
Mindenki a sajat reszet ugy csinalja ahogy szeretne, de nem art vegen masoknak elmagyarazni a PullRequest / MergeRequest alatt!
Develop szent! (Nem tudom itt hogy kell levedeni!)


Szerverre való hívás: 

URL: http://localhost:5500/api/mp3
METHOD: POST
BODY: form-data
    key: mp3
    value: asd.mp3
    
A válasz kb ilyen: 
{
    "warningLevel": 10,
    "coordinates": "0,0",
    "animalObserved": "Medve",
    "voiceToPlay": "MedveWarning.mp3",
    "dateTime": "2019-10-25T16:40:03.886Z",
    "_id": "5db325633d4189092ca0939b"
}

TO get it running: 
    download NODE JS
    -npm install
    -npm start