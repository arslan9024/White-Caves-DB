// MongoDB Query Examples for White Caves Real Estate Database

/* 
 * This file contains common query examples for the White Caves Real Estate database.
 * These queries demonstrate how to interact with the database for various use cases.
 */

// ============================================
// PROPERTY QUERIES
// ============================================

// 1. Find all available properties for sale
db.properties.find({
  status: "available",
  transactionType: { $in: ["sale", "both"] }
}).sort({ createdAt: -1 });

// 2. Find properties in a specific area with filters
db.properties.find({
  "location.area": "Dubai Marina",
  status: "available",
  "specifications.bedrooms": { $gte: 2 },
  "price.amount": { $lte: 3000000 }
}).sort({ "price.amount": 1 });

// 3. Find properties within a specific price range
db.properties.find({
  status: "available",
  "price.amount": {
    $gte: 1000000,
    $lte: 2000000
  }
});

// 4. Search properties by text (requires text index)
db.properties.find({
  $text: { $search: "luxury villa pool" }
}).sort({ score: { $meta: "textScore" } });

// 5. Find properties near a location (geospatial query)
db.properties.find({
  "location.coordinates": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [55.1384, 25.0795] // [longitude, latitude] - Dubai Marina
      },
      $maxDistance: 5000 // 5km radius
    }
  },
  status: "available"
});

// 6. Find properties by agent
db.properties.find({
  "agent.agentId": "AGT001",
  status: { $ne: "sold" }
}).sort({ updatedAt: -1 });

// 7. Find most viewed properties
db.properties.find({
  status: "available"
}).sort({ viewCount: -1 }).limit(10);

// 8. Aggregate properties by type and status
db.properties.aggregate([
  {
    $group: {
      _id: {
        type: "$type",
        status: "$status"
      },
      count: { $sum: 1 },
      averagePrice: { $avg: "$price.amount" }
    }
  },
  { $sort: { count: -1 } }
]);

// 9. Find properties with specific features
db.properties.find({
  features: { $all: ["Swimming Pool", "Gym", "Parking"] },
  status: "available"
});

// 10. Update property status
db.properties.updateOne(
  { propertyId: "PROP001" },
  {
    $set: {
      status: "sold",
      updatedAt: new Date()
    }
  }
);

// 11. Increment view count
db.properties.updateOne(
  { propertyId: "PROP001" },
  { $inc: { viewCount: 1 } }
);

// ============================================
// USER QUERIES
// ============================================

// 12. Find active agents with high ratings
db.users.find({
  role: "agent",
  isActive: true,
  "agentDetails.rating": { $gte: 4.5 }
}).sort({ "agentDetails.completedDeals": -1 });

// 13. Find users by role
db.users.find({
  role: "buyer",
  isActive: true
});

// 14. Find agents by specialization
db.users.find({
  role: "agent",
  "agentDetails.specialization": "luxury"
});

// 15. Search users by name or email
db.users.find({
  $text: { $search: "Ahmed" }
});

// 16. Find users with saved properties
db.users.find({
  savedProperties: { $exists: true, $ne: [] }
});

// 17. Update user profile
db.users.updateOne(
  { userId: "AGT001" },
  {
    $set: {
      "agentDetails.completedDeals": 48,
      "agentDetails.rating": 4.85,
      updatedAt: new Date()
    }
  }
);

// 18. Add property to user's saved list
db.users.updateOne(
  { userId: "BUY001" },
  {
    $addToSet: { savedProperties: "PROP002" },
    $set: { updatedAt: new Date() }
  }
);

// ============================================
// TRANSACTION QUERIES
// ============================================

// 19. Find all active transactions
db.transactions.find({
  status: { $in: ["pending", "in-progress"] }
}).sort({ createdAt: -1 });

// 20. Find transactions by agent
db.transactions.find({
  "agent.agentId": "AGT001"
}).sort({ createdAt: -1 });

// 21. Find completed transactions within a date range
db.transactions.find({
  status: "completed",
  completedAt: {
    $gte: new ISODate("2024-01-01"),
    $lte: new ISODate("2024-12-31")
  }
});

// 22. Find transactions by property
db.transactions.find({
  propertyId: "PROP001"
}).sort({ createdAt: -1 });

// 23. Calculate total sales by agent
db.transactions.aggregate([
  {
    $match: {
      type: "sale",
      status: "completed"
    }
  },
  {
    $group: {
      _id: "$agent.agentId",
      agentName: { $first: "$agent.name" },
      totalSales: { $sum: "$financialDetails.agreedPrice" },
      totalCommission: { $sum: "$agent.commission.amount" },
      numberOfDeals: { $sum: 1 }
    }
  },
  { $sort: { totalSales: -1 } }
]);

// 24. Find leases expiring soon (within next 90 days)
const today = new Date();
const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
db.transactions.find({
  type: { $in: ["lease", "rent"] },
  status: "completed",
  "leasingDetails.endDate": {
    $gte: today.toISOString(),
    $lte: ninetyDaysFromNow.toISOString()
  }
});

// 25. Update transaction status
db.transactions.updateOne(
  { transactionId: "TXN001" },
  {
    $set: {
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date()
    },
    $push: {
      timeline: {
        stage: "Transaction Completed",
        timestamp: new Date(),
        note: "All payments received and documents signed"
      }
    }
  }
);

// 26. Mark installment as paid
db.transactions.updateOne(
  { transactionId: "TXN001", "financialDetails.installments.dueDate": "2024-03-15" },
  {
    $set: {
      "financialDetails.installments.$.isPaid": true,
      updatedAt: new Date()
    }
  }
);

// ============================================
// ADVANCED ANALYTICS QUERIES
// ============================================

// 27. Average property price by area
db.properties.aggregate([
  {
    $match: { status: "available" }
  },
  {
    $group: {
      _id: "$location.area",
      averagePrice: { $avg: "$price.amount" },
      minPrice: { $min: "$price.amount" },
      maxPrice: { $max: "$price.amount" },
      propertyCount: { $sum: 1 }
    }
  },
  { $sort: { averagePrice: -1 } }
]);

// 28. Properties by type and bedroom count
db.properties.aggregate([
  {
    $match: { status: "available" }
  },
  {
    $group: {
      _id: {
        type: "$type",
        bedrooms: "$specifications.bedrooms"
      },
      count: { $sum: 1 },
      averagePrice: { $avg: "$price.amount" }
    }
  },
  { $sort: { "_id.type": 1, "_id.bedrooms": 1 } }
]);

// 29. Monthly transaction volume
db.transactions.aggregate([
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
]);

// 30. Agent performance leaderboard
db.transactions.aggregate([
  {
    $match: {
      status: "completed",
      completedAt: {
        $gte: new ISODate("2024-01-01")
      }
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
  { $sort: { totalRevenue: -1 } },
  { $limit: 10 }
]);
