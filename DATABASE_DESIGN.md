# White Caves Real Estate Database Design

## Overview
This document describes the MongoDB database design for White Caves Real Estate LLC, a real estate company operating in Dubai, UAE. The database supports a web application for buying, selling, and leasing properties.

## Database Name
`white_caves_real_estate`

## Collections

### 1. Properties Collection
Stores all property listings including apartments, villas, offices, and other real estate.

**Key Features:**
- Supports both sale and rental properties
- Geospatial indexing for location-based searches
- Full-text search capabilities
- Tracks property views and engagement

**Main Fields:**
- `propertyId`: Unique identifier
- `title`: Property listing title
- `type`: Property type (apartment, villa, townhouse, etc.)
- `status`: Current status (available, sold, leased, pending)
- `transactionType`: Sale, rent, or both
- `location`: Detailed location information with coordinates
- `price`: Pricing information with currency
- `specifications`: Bedrooms, bathrooms, area, etc.
- `features`: Array of property amenities
- `images`: Property photos
- `agent`: Reference to handling agent
- `owner`: Reference to property owner

**Use Cases:**
- Search properties by location, type, price range
- Find properties near a specific location (geospatial)
- Filter by amenities and specifications
- Track property views and popularity

### 2. Users Collection
Stores all users including agents, buyers, sellers, landlords, and tenants.

**Key Features:**
- Role-based user types
- Agent-specific details (license, rating, completed deals)
- User preferences for property search
- Saved properties functionality

**Main Fields:**
- `userId`: Unique identifier
- `email`: Email address (unique)
- `name`: User's first and last name
- `role`: User role (agent, buyer, seller, landlord, tenant, admin)
- `phone`: Contact number
- `profile`: Profile information
- `agentDetails`: Additional details for agents
- `preferences`: Search preferences
- `savedProperties`: List of saved property IDs

**Use Cases:**
- Agent management and performance tracking
- User authentication and authorization
- Customer relationship management
- Property recommendations based on preferences

### 3. Transactions Collection
Tracks all real estate transactions including sales, leases, and rentals.

**Key Features:**
- Complete transaction lifecycle tracking
- Payment and installment management
- Document storage references
- Timeline tracking for transaction stages
- Commission calculations

**Main Fields:**
- `transactionId`: Unique identifier
- `propertyId`: Reference to property
- `type`: Transaction type (sale, lease, rent)
- `status`: Current status (pending, in-progress, completed, cancelled)
- `buyer`: Buyer/tenant information
- `seller`: Seller/landlord information
- `agent`: Agent details and commission
- `financialDetails`: Price, deposit, payment method, installments
- `leasingDetails`: Lease-specific information (for rentals)
- `documents`: Contract and document references
- `timeline`: Transaction history and stages

**Use Cases:**
- Track sales pipeline
- Manage lease agreements
- Calculate agent commissions
- Monitor payment schedules
- Generate transaction reports

## Relationships

### Property → User (Agent/Owner)
- Properties reference agents and owners via `agentId` and `ownerId`
- One-to-many relationship: One agent can handle multiple properties

### Transaction → Property
- Transactions reference properties via `propertyId`
- One-to-many relationship: One property can have multiple transactions over time

### Transaction → User (Buyer/Seller/Agent)
- Transactions reference users via `userId` fields
- Many-to-many relationship: Users can participate in multiple transactions

### User → Property (Saved Properties)
- Users can save properties via `savedProperties` array
- Many-to-many relationship via array of property IDs

## Indexes

### Properties Collection
1. **Single Field Indexes:**
   - `propertyId` (unique)
   - `status`
   - `type`
   - `location.area`
   - `price.amount`

2. **Compound Indexes:**
   - `{ status, type }`
   - `{ location.area, type, status }`
   - `{ status, price.amount }`

3. **Special Indexes:**
   - Geospatial index on `location.coordinates` (2dsphere)
   - Text index on title, description, and location fields

### Users Collection
1. **Single Field Indexes:**
   - `userId` (unique)
   - `email` (unique)
   - `role`

2. **Compound Indexes:**
   - `{ role, isActive }`
   - `{ role, agentDetails.rating }`

### Transactions Collection
1. **Single Field Indexes:**
   - `transactionId` (unique)
   - `propertyId`
   - `status`
   - `agent.agentId`

2. **Compound Indexes:**
   - `{ status, type }`
   - `{ agent.agentId, status, createdAt }`

## Data Validation

All collections use JSON Schema validation to ensure data integrity:
- Required fields enforcement
- Data type validation
- Enum constraints for categorical fields
- Nested object validation

## Security Considerations

1. **Authentication:**
   - User credentials should be hashed (handled by application layer)
   - Implement JWT or session-based authentication

2. **Authorization:**
   - Role-based access control (RBAC)
   - Agents can only modify their own listings
   - Admins have full access

3. **Data Privacy:**
   - Personal information encryption at rest
   - Sensitive fields (passwords) never stored in plain text
   - Document URLs should use signed URLs with expiration

4. **Audit Trail:**
   - All documents include `createdAt` and `updatedAt` timestamps
   - Transaction timeline tracks all changes

## Scalability Considerations

1. **Indexing:**
   - Proper indexes on frequently queried fields
   - Compound indexes for common query patterns

2. **Sharding Strategy:**
   - Shard by `location.area` for geographic distribution
   - Consider time-based sharding for transactions

3. **Performance:**
   - Use projection to limit returned fields
   - Implement pagination for large result sets
   - Cache frequently accessed data

## Backup and Recovery

1. **Backup Strategy:**
   - Daily automated backups
   - Point-in-time recovery capability
   - Geographic redundancy for production

2. **Data Retention:**
   - Active properties: Indefinite
   - Completed transactions: 7 years (legal requirement)
   - User data: As per GDPR/data protection laws

## Future Enhancements

1. **Additional Collections:**
   - `leads`: Track potential customers
   - `viewings`: Schedule and track property viewings
   - `inquiries`: Manage property inquiries
   - `notifications`: User notification system
   - `reports`: Cached analytics and reports

2. **Features:**
   - Property comparison functionality
   - Virtual tour integration
   - Market analysis and trends
   - Automated property valuation
   - Integration with external property portals

## Technology Stack

- **Database:** MongoDB 6.x or higher
- **Driver:** MongoDB Node.js Driver
- **Schema Validation:** JSON Schema (draft-07)
- **Indexing:** Standard MongoDB indexes + geospatial
- **Hosting:** MongoDB Atlas (recommended for production)

## Compliance

The database design considers:
- Dubai Real Estate Regulatory Authority (RERA) requirements
- UAE Data Protection laws
- General Data Protection Regulation (GDPR) for EU citizens
- Financial transaction record-keeping requirements
