const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/safeNature';

class Mongo {
  constructor() {
    this.client = new MongoClient(url, {
      poolSize: 10,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async mongoStart() {
    await this.client.connect();
  }

  async logToMongo(toPut) {
    await this.client.db('safeNature').collection('logger').insertOne(toPut);
  }
}

module.exports = new Mongo();
