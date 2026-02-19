// Database Setup Script for White Caves Real Estate
// This script initializes the MongoDB database with collections, indexes, and seed data

const { MongoClient } = require('mongodb');
const config = require('../config/database.config');
const { createIndexes } = require('../config/indexes');
const sampleProperties = require('../seed-data/properties.seed');
const sampleUsers = require('../seed-data/users.seed');
const sampleTransactions = require('../seed-data/transactions.seed');

async function setupDatabase() {
  let client;
  
  try {
    console.log('Starting White Caves Real Estate Database Setup...\n');
    
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || config.development.uri;
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri, config.options);
    await client.connect();
    console.log('✓ Connected to MongoDB\n');
    
    // Get database
    const db = client.db(config.database);
    
    // Create collections
    console.log('Creating collections...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    for (const [key, collectionName] of Object.entries(config.collections)) {
      if (!collectionNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`✓ Created collection: ${collectionName}`);
      } else {
        console.log(`  Collection already exists: ${collectionName}`);
      }
    }
    console.log('');
    
    // Create indexes
    await createIndexes(db);
    console.log('');
    
    // Insert seed data
    console.log('Inserting seed data...');
    
    // Insert properties
    const propertiesCollection = db.collection(config.collections.properties);
    const existingProperties = await propertiesCollection.countDocuments();
    if (existingProperties === 0) {
      await propertiesCollection.insertMany(sampleProperties);
      console.log(`✓ Inserted ${sampleProperties.length} sample properties`);
    } else {
      console.log(`  Properties collection already has ${existingProperties} documents`);
    }
    
    // Insert users
    const usersCollection = db.collection(config.collections.users);
    const existingUsers = await usersCollection.countDocuments();
    if (existingUsers === 0) {
      await usersCollection.insertMany(sampleUsers);
      console.log(`✓ Inserted ${sampleUsers.length} sample users`);
    } else {
      console.log(`  Users collection already has ${existingUsers} documents`);
    }
    
    // Insert transactions
    const transactionsCollection = db.collection(config.collections.transactions);
    const existingTransactions = await transactionsCollection.countDocuments();
    if (existingTransactions === 0) {
      await transactionsCollection.insertMany(sampleTransactions);
      console.log(`✓ Inserted ${sampleTransactions.length} sample transactions`);
    } else {
      console.log(`  Transactions collection already has ${existingTransactions} documents`);
    }
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\nDatabase Summary:');
    console.log(`- Database: ${config.database}`);
    console.log(`- Properties: ${await propertiesCollection.countDocuments()} documents`);
    console.log(`- Users: ${await usersCollection.countDocuments()} documents`);
    console.log(`- Transactions: ${await transactionsCollection.countDocuments()} documents`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n✅ Setup script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup script failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
