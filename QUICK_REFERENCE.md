# White Caves Real Estate Database - Quick Reference Guide

## Common Operations

### Connecting to the Database

```javascript
const { MongoClient } = require('mongodb');
const config = require('./config/database.config');

const uri = process.env.MONGODB_URI || config.development.uri;
const client = new MongoClient(uri, config.options);

await client.connect();
const db = client.db(config.database);
```

## Property Operations

### Search Properties
```javascript
// Find available properties for sale in Dubai Marina
const properties = await db.collection('properties').find({
  "location.area": "Dubai Marina",
  status: "available",
  transactionType: { $in: ["sale", "both"] }
}).toArray();

// Find properties within budget
const affordableProperties = await db.collection('properties').find({
  status: "available",
  "price.amount": { $lte: 2000000 }
}).sort({ "price.amount": 1 }).toArray();

// Search by text
const searchResults = await db.collection('properties').find({
  $text: { $search: "luxury villa pool" }
}).toArray();
```

### Add New Property
```javascript
const newProperty = {
  propertyId: "PROP004",
  title: "Modern 2BR Apartment",
  type: "apartment",
  status: "available",
  transactionType: "sale",
  location: {
    area: "Downtown Dubai",
    city: "Dubai",
    coordinates: { latitude: 25.1972, longitude: 55.2744 }
  },
  price: {
    amount: 1800000,
    currency: "AED"
  },
  specifications: {
    bedrooms: 2,
    bathrooms: 2,
    area: { value: 1500, unit: "sqft" }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

await db.collection('properties').insertOne(newProperty);
```

### Update Property Status
```javascript
await db.collection('properties').updateOne(
  { propertyId: "PROP001" },
  {
    $set: {
      status: "sold",
      updatedAt: new Date().toISOString()
    }
  }
);
```

## User Operations

### Find Agents
```javascript
// Find top-rated agents
const topAgents = await db.collection('users').find({
  role: "agent",
  isActive: true,
  "agentDetails.rating": { $gte: 4.5 }
}).sort({ "agentDetails.completedDeals": -1 }).limit(10).toArray();
```

### Create New User
```javascript
const newUser = {
  userId: "BUY002",
  email: "buyer@example.com",
  name: {
    firstName: "Jane",
    lastName: "Doe"
  },
  role: "buyer",
  phone: {
    countryCode: "+971",
    number: "50-555-1234"
  },
  preferences: {
    propertyTypes: ["apartment"],
    locations: ["Dubai Marina", "JBR"],
    priceRange: { min: 1500000, max: 2500000 }
  },
  savedProperties: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
};

await db.collection('users').insertOne(newUser);
```

### Save Property for User
```javascript
await db.collection('users').updateOne(
  { userId: "BUY001" },
  {
    $addToSet: { savedProperties: "PROP003" },
    $set: { updatedAt: new Date().toISOString() }
  }
);
```

## Transaction Operations

### Create Transaction
```javascript
const newTransaction = {
  transactionId: "TXN003",
  propertyId: "PROP003",
  type: "sale",
  status: "pending",
  buyer: {
    userId: "BUY001",
    name: "John Smith",
    email: "john@example.com"
  },
  seller: {
    userId: "OWN003",
    name: "Property Owner"
  },
  agent: {
    agentId: "AGT001",
    name: "Ahmed Al-Mansouri",
    commission: {
      percentage: 2,
      amount: 30000
    }
  },
  financialDetails: {
    agreedPrice: 1500000,
    currency: "AED",
    deposit: 150000,
    paymentMethod: "bank-transfer"
  },
  timeline: [{
    stage: "Initial Inquiry",
    timestamp: new Date().toISOString(),
    note: "Buyer inquired about the property"
  }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

await db.collection('transactions').insertOne(newTransaction);
```

### Update Transaction Status
```javascript
await db.collection('transactions').updateOne(
  { transactionId: "TXN001" },
  {
    $set: {
      status: "completed",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    $push: {
      timeline: {
        stage: "Completed",
        timestamp: new Date().toISOString(),
        note: "Transaction completed successfully"
      }
    }
  }
);
```

## Analytics Queries

### Properties by Area
```javascript
const propertiesByArea = await db.collection('properties').aggregate([
  { $match: { status: "available" } },
  {
    $group: {
      _id: "$location.area",
      count: { $sum: 1 },
      avgPrice: { $avg: "$price.amount" }
    }
  },
  { $sort: { avgPrice: -1 } }
]).toArray();
```

### Agent Performance
```javascript
const agentPerformance = await db.collection('transactions').aggregate([
  {
    $match: {
      status: "completed",
      completedAt: { $gte: new Date("2024-01-01").toISOString() }
    }
  },
  {
    $group: {
      _id: "$agent.agentId",
      agentName: { $first: "$agent.name" },
      totalDeals: { $sum: 1 },
      totalRevenue: { $sum: "$financialDetails.agreedPrice" },
      totalCommission: { $sum: "$agent.commission.amount" }
    }
  },
  { $sort: { totalRevenue: -1 } }
]).toArray();
```

### Monthly Transaction Volume
```javascript
const monthlyStats = await db.collection('transactions').aggregate([
  {
    $match: {
      status: "completed",
      completedAt: { $exists: true }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: { $toDate: "$completedAt" } },
        month: { $month: { $toDate: "$completedAt" } }
      },
      totalTransactions: { $sum: 1 },
      totalValue: { $sum: "$financialDetails.agreedPrice" }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } }
]).toArray();
```

## Useful Filters

### Property Filters
```javascript
// Find villas with pool
{ type: "villa", features: "Private Pool" }

// Find furnished properties
{ "specifications.furnished": "furnished" }

// Find properties with parking
{ "specifications.parkingSpaces": { $gte: 1 } }

// Find properties by bedroom count
{ "specifications.bedrooms": 3 }

// Find properties in specific buildings
{ "location.building": "Marina Heights Tower" }
```

### User Filters
```javascript
// Find active agents
{ role: "agent", isActive: true }

// Find users with saved properties
{ savedProperties: { $exists: true, $ne: [] } }

// Find agents with specific specialization
{ "agentDetails.specialization": "luxury" }
```

### Transaction Filters
```javascript
// Find pending transactions
{ status: "pending" }

// Find transactions by type
{ type: "sale" }

// Find transactions with installments
{ "financialDetails.installments": { $exists: true } }
```

## Best Practices

1. **Always use indexes**: Query fields that have indexes for better performance
2. **Use projection**: Limit returned fields to only what you need
3. **Implement pagination**: Use `limit()` and `skip()` for large result sets
4. **Update timestamps**: Always update `updatedAt` when modifying documents
5. **Validate data**: Use the JSON schemas to validate before insertion
6. **Handle errors**: Always wrap database operations in try-catch blocks
7. **Close connections**: Close MongoDB connections when done

## Error Handling Example

```javascript
try {
  const result = await db.collection('properties').insertOne(newProperty);
  console.log('Property added successfully:', result.insertedId);
} catch (error) {
  if (error.code === 11000) {
    console.error('Duplicate property ID');
  } else {
    console.error('Error adding property:', error.message);
  }
}
```

## Connection Management

```javascript
// Reusable connection function
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = new MongoClient(process.env.MONGODB_URI, config.options);
  await client.connect();
  cachedDb = client.db(config.database);
  return cachedDb;
}

// Use it
const db = await connectToDatabase();
const properties = await db.collection('properties').find({}).toArray();
```

## MongoDB Compass

For visual database management, use MongoDB Compass:
1. Download from mongodb.com
2. Connect using your MONGODB_URI
3. Browse collections, run queries, and analyze data visually

---

For more examples, see `examples/queries.js`
For schema details, see files in `schemas/` directory
