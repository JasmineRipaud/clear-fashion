require('dotenv').config();
const {MongoClient} = require('mongodb');
 // TODO put this information in a .config file 
 
const MONGODB_URI ="mongodb+srv://AFR2512:Bellecreole44@clearfashion.mbe0y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const MONGODB_DB_NAME = "clearfashion"
const MONGODB_COLLECTION = 'products'
//const config = require("../config");
const fs=require('fs');


let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products);

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
 module.exports.find = async (query,filter,page,limit) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).project(filter).skip(page).limit(limit).toArray();
    const count=await collection.countDocuments();
    let pagecount = Math.floor(count/limit)
    let meta = {'count' : count,'page' : page,'page_size' : limit, 'page_count' : pagecount}
    console.log(result,meta)
    return {result,meta};
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};