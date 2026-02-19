# White Caves Real Estate Database

MongoDB database for White Caves Real Estate LLC - A comprehensive real estate management system for buying, selling, and leasing properties in Dubai, UAE.

## Overview

This repository contains the complete MongoDB database design and implementation for White Caves Real Estate, including:
- Database schemas for properties, users, and transactions
- Optimized indexes for high-performance queries
- Sample seed data for development and testing
- Query examples for common operations
- Setup scripts for easy deployment

## Features

### 🏢 Property Management
- Support for multiple property types (apartments, villas, offices, etc.)
- Geospatial search for location-based queries
- Full-text search capabilities
- Property status tracking (available, sold, leased)
- Rich property specifications and amenities
- Image gallery support

### 👥 User Management
- Multi-role support (agents, buyers, sellers, landlords, tenants, admins)
- Agent performance tracking and ratings
- User preferences and saved properties
- Contact information management
- Profile customization

### 💼 Transaction Management
- Complete sales transaction tracking
- Lease and rental agreement management
- Payment and installment tracking
- Commission calculations
- Document management
- Transaction timeline and history

## Database Structure

### Collections

1. **Properties** - Real estate listings
2. **Users** - All system users (agents, buyers, sellers, etc.)
3. **Transactions** - Sales, leases, and rental transactions

For detailed database design documentation, see [DATABASE_DESIGN.md](./DATABASE_DESIGN.md).

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- MongoDB 6.x or higher (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arslan9024/White-Caves-DB.git
cd White-Caves-DB
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection details
```

4. Set up the database:
```bash
npm run setup
```

This will create the collections, indexes, and populate sample data.

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/white_caves_real_estate
DATABASE_NAME=white_caves_real_estate
NODE_ENV=development
```

For MongoDB Atlas (production):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/white_caves_real_estate?retryWrites=true&w=majority
```

### Database Configuration

Database configuration is managed in `config/database.config.js`. You can customize:
- Connection options
- Pool size
- Timeout settings
- SSL options for production

## Usage

### Setup Database

Initialize the database with collections, indexes, and seed data:

```bash
npm run setup
```

### Query Examples

The `examples/queries.js` file contains common query patterns:

```javascript
// Find available properties in Dubai Marina
db.properties.find({
  "location.area": "Dubai Marina",
  status: "available"
});

// Find top-rated agents
db.users.find({
  role: "agent",
  "agentDetails.rating": { $gte: 4.5 }
}).sort({ "agentDetails.completedDeals": -1 });

// Track transaction progress
db.transactions.find({
  status: "in-progress"
}).sort({ createdAt: -1 });
```

See `examples/queries.js` for 30+ query examples covering all common operations.

## Database Schema

### Properties Schema

```json
{
  "propertyId": "PROP001",
  "title": "Luxury 3BR Apartment",
  "type": "apartment",
  "status": "available",
  "location": {
    "area": "Dubai Marina",
    "city": "Dubai",
    "coordinates": { "latitude": 25.0795, "longitude": 55.1384 }
  },
  "price": {
    "amount": 2500000,
    "currency": "AED"
  },
  "specifications": {
    "bedrooms": 3,
    "bathrooms": 3.5,
    "area": { "value": 2200, "unit": "sqft" }
  }
}
```

### Users Schema

```json
{
  "userId": "AGT001",
  "email": "agent@whitecaves.ae",
  "name": { "firstName": "Ahmed", "lastName": "Al-Mansouri" },
  "role": "agent",
  "agentDetails": {
    "licenseNumber": "BRN-12345",
    "rating": 4.8,
    "completedDeals": 47
  }
}
```

### Transactions Schema

```json
{
  "transactionId": "TXN001",
  "propertyId": "PROP001",
  "type": "sale",
  "status": "in-progress",
  "financialDetails": {
    "agreedPrice": 2500000,
    "currency": "AED",
    "deposit": 250000
  }
}
```

For complete schema definitions, see the `schemas/` directory.

## Directory Structure

```
White-Caves-DB/
├── config/              # Database configuration
│   ├── database.config.js
│   └── indexes.js
├── schemas/             # JSON Schema definitions
│   ├── properties.schema.json
│   ├── users.schema.json
│   └── transactions.schema.json
├── seed-data/           # Sample data
│   ├── properties.seed.js
│   ├── users.seed.js
│   └── transactions.seed.js
├── examples/            # Usage examples
│   ├── queries.js
│   └── setup-database.js
├── .env.example         # Environment variables template
├── package.json         # Node.js dependencies
├── README.md           # This file
└── DATABASE_DESIGN.md  # Detailed design documentation
```

## Indexes

The database includes optimized indexes for:

- Property searches by location, type, and status
- Full-text search on property titles and descriptions
- Geospatial queries for location-based searches
- User lookups by email and role
- Transaction queries by status and agent

See `config/indexes.js` for the complete index definition.

## Sample Data

The repository includes realistic sample data:

- **3 Properties**: Apartment, villa, and office space in various Dubai locations
- **5 Users**: Agents, buyers, tenants, and admin accounts
- **2 Transactions**: One sale and one lease transaction with complete details

Use this data for development and testing.

## Development

### Adding New Collections

1. Create schema in `schemas/` directory
2. Add collection to `config/database.config.js`
3. Define indexes in `config/indexes.js`
4. Create seed data in `seed-data/` directory
5. Update setup script to include new collection

### Best Practices

- Always use indexes for frequently queried fields
- Implement pagination for large result sets
- Use projection to limit returned fields
- Validate data against schemas before insertion
- Keep denormalized data in sync with source

## Production Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Configure network access (IP whitelist)
3. Create database user with appropriate permissions
4. Update `.env` with Atlas connection string
5. Run setup script to initialize database

### Security Checklist

- [ ] Enable authentication
- [ ] Use strong passwords
- [ ] Enable SSL/TLS
- [ ] Configure IP whitelist
- [ ] Implement role-based access control
- [ ] Enable audit logging
- [ ] Set up automated backups
- [ ] Encrypt sensitive data

## Performance Optimization

- Use compound indexes for multi-field queries
- Implement caching for frequently accessed data
- Use aggregation pipelines for complex queries
- Monitor slow queries with profiling
- Consider sharding for large datasets

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [White Caves Real Estate LLC](mailto:info@whitecaves.ae)

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Built for White Caves Real Estate LLC
- Designed for Dubai real estate market
- MongoDB-based NoSQL database

---

**White Caves Real Estate LLC** - Providing exceptional real estate services in Dubai since 2023 
