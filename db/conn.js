const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGO_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectDB: async(callbackFn) => {
    try {
      await client.connect();
      dbConnection = await client.db("so-sure");
      console.log(`Connected successfully to MongoDB: ${dbConnection.databaseName}`);
      const collections = await dbConnection.listCollections({}, { nameOnly: true }).toArray();
      if (collections.length <= 0) {
        const collection = await dbConnection.createCollection("phones");
        console.log(`Created collection: ${collection.collectionName}`);
      }
      return callbackFn();

    } catch(err) {
      await client.close();
      return callbackFn(err);
    }
  },
  getDb: () => {
    return dbConnection;
  },
};