const {MongoClient, ServerApiVersion} = require("mongodb");

const {MONGODB_ENDPOINT, MONGODB_USERNAME, MONGODB_PWD, MONGODB_ENTRY_DATABASE} = process.env;

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PWD}@${MONGODB_ENDPOINT}/${MONGODB_ENTRY_DATABASE}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});


function initDatabase(callback) {
  client.connect(err => {
    if (err) {
      console.error(err);
      throw err;
    }
    callback(client);
  });
}


function getDatabaseClient() {
  return client;
}


function getDefaultDatabase() {
  return client.db();
}


module.exports = {
  getDatabaseClient,
  initDatabase,
}
