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

  async getLast24() {
    return this.client.db('safeNature').collection('logger').find(/* { dateTime: { $lte: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } } */)
      .sort({ dateTime: -1 })
      .toArray();
  }
}

module.exports = new Mongo();
