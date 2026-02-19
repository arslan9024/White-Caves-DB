// MongoDB Database Configuration for White Caves Real Estate
// Connection string format: mongodb://username:password@host:port/database

const config = {
  // Database name
  database: 'white_caves_real_estate',
  
  // Collections
  collections: {
    properties: 'properties',
    users: 'users',
    transactions: 'transactions'
  },
  
  // Connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
  
  // Environment-specific configuration
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/white_caves_real_estate',
  },
  
  production: {
    uri: process.env.MONGODB_URI,
    options: {
      ssl: true,
      retryWrites: true,
      w: 'majority'
    }
  }
};

module.exports = config;
