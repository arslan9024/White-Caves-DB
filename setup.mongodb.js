// MongoDB Shell Script for White Caves Real Estate Database
// Run this script in MongoDB shell (mongosh) to set up the database
// Usage: mongosh < setup.mongodb.js

// Switch to the database
use white_caves_real_estate;

print("Setting up White Caves Real Estate Database...\n");

// Create collections with validation
print("Creating collections with validation...");

db.createCollection("properties", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["propertyId", "title", "type", "status", "location", "price"],
      properties: {
        propertyId: { bsonType: "string" },
        title: { bsonType: "string" },
        type: {
          enum: ["apartment", "villa", "townhouse", "penthouse", "office", "retail", "warehouse", "land"]
        },
        status: {
          enum: ["available", "sold", "leased", "pending", "off-market"]
        }
      }
    }
  }
});
print("✓ Created properties collection");

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "email", "role", "name"],
      properties: {
        userId: { bsonType: "string" },
        email: { bsonType: "string" },
        role: {
          enum: ["admin", "agent", "buyer", "seller", "landlord", "tenant"]
        }
      }
    }
  }
});
print("✓ Created users collection");

db.createCollection("transactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["transactionId", "propertyId", "type", "status"],
      properties: {
        transactionId: { bsonType: "string" },
        propertyId: { bsonType: "string" },
        type: {
          enum: ["sale", "lease", "rent"]
        },
        status: {
          enum: ["pending", "in-progress", "completed", "cancelled", "on-hold"]
        }
      }
    }
  }
});
print("✓ Created transactions collection\n");

// Create indexes
print("Creating indexes...");

// Properties indexes
db.properties.createIndex({ propertyId: 1 }, { unique: true });
db.properties.createIndex({ status: 1 });
db.properties.createIndex({ type: 1 });
db.properties.createIndex({ "location.area": 1 });
db.properties.createIndex({ "price.amount": 1 });
db.properties.createIndex({ status: 1, type: 1 });
db.properties.createIndex({ "location.area": 1, type: 1, status: 1 });
db.properties.createIndex({ "location.coordinates": "2dsphere" });
db.properties.createIndex(
  {
    title: "text",
    description: "text",
    "location.area": "text",
    "location.address": "text"
  },
  {
    weights: {
      title: 10,
      "location.area": 5,
      description: 3,
      "location.address": 2
    }
  }
);
print("✓ Created properties indexes");

// Users indexes
db.users.createIndex({ userId: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ role: 1, isActive: 1 });
db.users.createIndex(
  {
    "name.firstName": "text",
    "name.lastName": "text",
    email: "text"
  }
);
print("✓ Created users indexes");

// Transactions indexes
db.transactions.createIndex({ transactionId: 1 }, { unique: true });
db.transactions.createIndex({ propertyId: 1 });
db.transactions.createIndex({ status: 1 });
db.transactions.createIndex({ "agent.agentId": 1 });
db.transactions.createIndex({ status: 1, type: 1 });
db.transactions.createIndex({ "agent.agentId": 1, status: 1, createdAt: -1 });
print("✓ Created transactions indexes\n");

print("✅ Database setup completed successfully!");
print("\nNext steps:");
print("1. Run 'npm install' to install dependencies");
print("2. Run 'npm run setup' to insert sample data");
print("3. Check README.md for usage examples\n");
