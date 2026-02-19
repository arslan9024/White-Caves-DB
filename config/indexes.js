// MongoDB Indexes for White Caves Real Estate Database
// Run this script to create all necessary indexes for optimal query performance

const indexes = {
  // Properties Collection Indexes
  properties: [
    // Single field indexes
    { key: { propertyId: 1 }, unique: true },
    { key: { status: 1 } },
    { key: { type: 1 } },
    { key: { transactionType: 1 } },
    { key: { 'location.area': 1 } },
    { key: { 'location.city': 1 } },
    { key: { 'price.amount': 1 } },
    { key: { 'agent.agentId': 1 } },
    { key: { 'owner.ownerId': 1 } },
    { key: { createdAt: -1 } },
    { key: { updatedAt: -1 } },
    
    // Compound indexes for common queries
    { key: { status: 1, type: 1 } },
    { key: { 'location.area': 1, type: 1, status: 1 } },
    { key: { status: 1, 'price.amount': 1 } },
    { key: { transactionType: 1, status: 1, 'price.amount': 1 } },
    { key: { type: 1, 'specifications.bedrooms': 1, status: 1 } },
    
    // Geospatial index for location-based queries
    { key: { 'location.coordinates': '2dsphere' } },
    
    // Text index for search functionality
    { 
      key: { 
        title: 'text', 
        description: 'text', 
        'location.area': 'text',
        'location.address': 'text'
      },
      weights: {
        title: 10,
        'location.area': 5,
        description: 3,
        'location.address': 2
      }
    }
  ],
  
  // Users Collection Indexes
  users: [
    // Single field indexes
    { key: { userId: 1 }, unique: true },
    { key: { email: 1 }, unique: true },
    { key: { role: 1 } },
    { key: { 'phone.number': 1 } },
    { key: { 'agentDetails.licenseNumber': 1 }, sparse: true },
    { key: { createdAt: -1 } },
    { key: { isActive: 1 } },
    
    // Compound indexes
    { key: { role: 1, isActive: 1 } },
    { key: { role: 1, 'agentDetails.rating': -1 } },
    
    // Text index for user search
    {
      key: {
        'name.firstName': 'text',
        'name.lastName': 'text',
        email: 'text'
      }
    }
  ],
  
  // Transactions Collection Indexes
  transactions: [
    // Single field indexes
    { key: { transactionId: 1 }, unique: true },
    { key: { propertyId: 1 } },
    { key: { type: 1 } },
    { key: { status: 1 } },
    { key: { 'buyer.userId': 1 } },
    { key: { 'seller.userId': 1 } },
    { key: { 'agent.agentId': 1 } },
    { key: { createdAt: -1 } },
    { key: { completedAt: -1 } },
    
    // Compound indexes for transaction queries
    { key: { status: 1, type: 1 } },
    { key: { 'agent.agentId': 1, status: 1, createdAt: -1 } },
    { key: { propertyId: 1, status: 1 } },
    { key: { status: 1, createdAt: -1 } },
    
    // Index for financial queries
    { key: { 'financialDetails.agreedPrice': 1 } }
  ]
};

// Helper function to create indexes (for Node.js MongoDB driver)
async function createIndexes(db) {
  try {
    console.log('Creating indexes for White Caves Real Estate database...');
    
    // Create indexes for properties collection
    const propertiesCollection = db.collection('properties');
    for (const index of indexes.properties) {
      await propertiesCollection.createIndex(index.key, {
        unique: index.unique || false,
        sparse: index.sparse || false,
        weights: index.weights || undefined
      });
    }
    console.log(`✓ Created ${indexes.properties.length} indexes for properties collection`);
    
    // Create indexes for users collection
    const usersCollection = db.collection('users');
    for (const index of indexes.users) {
      await usersCollection.createIndex(index.key, {
        unique: index.unique || false,
        sparse: index.sparse || false,
        weights: index.weights || undefined
      });
    }
    console.log(`✓ Created ${indexes.users.length} indexes for users collection`);
    
    // Create indexes for transactions collection
    const transactionsCollection = db.collection('transactions');
    for (const index of indexes.transactions) {
      await transactionsCollection.createIndex(index.key, {
        unique: index.unique || false,
        sparse: index.sparse || false
      });
    }
    console.log(`✓ Created ${indexes.transactions.length} indexes for transactions collection`);
    
    console.log('All indexes created successfully!');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

module.exports = { indexes, createIndexes };
