# White Caves Real Estate Platform - Database Design Analysis & Implementation Guide

**Date:** February 19, 2026  
**Status:** Comprehensive Design Ready for Implementation  
**Target:** npm run dev server

---

## Executive Summary

This document provides **production-ready database design recommendations** for the White Caves Real Estate Platform. Based on your codebase analysis:

✅ **Current Tech Stack:**
- Frontend: React 19 + Redux Toolkit
- Backend: Node.js + Express
- Database (Configured): MongoDB Atlas
- ORM: Prisma 6.6 (from earlier context)
- WhatsApp Integration: whatsapp-web.js
- External Data: Google Sheets API

✅ **Business Domain:**
- Real Estate Project Management (50+ active projects)
- Multi-Agent Coordination
- Property Ownership & Contact Management
- WhatsApp-based Communication
- Commission Tracking & Analytics
- Lead Management & Campaign Execution

---

## Part 1: Database Selection & Strategy

### Recommendation: MongoDB + Prisma ORM

#### Why MongoDB for White Caves?

| Aspect | MongoDB | Justification |
|--------|---------|---|
| **Schema Flexibility** | ✅ High | Real estate data varies greatly by project |
| **Scalability** | ✅ Excellent | Support 50+ projects scaling to 100+ |
| **Document Model** | ✅ Natural | Properties, agents, contacts = documents |
| **Nested Data** | ✅ Perfect | Project metadata, agent hierarchy |
| **Query Performance** | ✅ Fast | Indexed lookups for phone numbers, agents |
| **Real-time Updates** | ✅ Capable | Change streams for bot notifications |
| **Cost** | ✅ Affordable | Free tier available for dev/test |

#### Why Prisma ORM?

- **Type-Safe:** Full TypeScript support
- **Migration Management:** Automatic migration tracking
- **Developer Experience:** Excellent for rapidly changing schemas
- **Prisma Client:** Auto-generated query builder
- **Studio:** Built-in data browser for development

---

## Part 2: Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    ORGANIZATION ||--o{ PROJECT : manages
    ORGANIZATION ||--o{ AGENT : employs
    ORGANIZATION ||--o{ PROPERTY_TYPE : defines
    
    PROJECT ||--o{ PROPERTY : contains
    PROJECT ||--o{ PROJECT_CAMPAIGN : launches
    PROJECT ||--o{ PROPERTY_SPREADSHEET : syncs
    
    PROPERTY ||--|| OWNER : "owned by"
    PROPERTY ||--o{ CONTACT : has
    PROPERTY ||--o{ PROJECT_ASSIGNMENT : assigned_to
    PROPERTY }o--| PROPERTY_TYPE : "is type of"
    
    AGENT ||--o{ PROJECT_ASSIGNMENT : works_on
    AGENT ||--o{ COMMISSION : earns
    AGENT ||--o{ CONVERSATION : initiates
    
    OWNER ||--o{ CONTACT : has
    OWNER ||--o{ COMMISSION : receives
    
    PROJECT_CAMPAIGN ||--o{ CAMPAIGN_MESSAGE : contains
    CAMPAIGN_MESSAGE ||--o{ CONVERSATION : becomes
    
    CONVERSATION ||--o{ MESSAGE : contains
    CONVERSATION ||--|| AGENT : "with agent"
    CONVERSATION ||--|| OWNER : "with owner"
    
    COMMISSION ||--o{ COMMISSION_PAYMENT : paid_via
    COMMISSION }o--|| PROJECT : "on project"
    COMMISSION }o--|| PROPERTY : "on property"
    COMMISSION ||--- AGENT : "earned by"
    COMMISSION ||--- OWNER : "earned by"
    
    PROPERTY_SPREADSHEET ||--o{ PROPERTY : "syncs to"
```

---

## Part 3: MongoDB Collection Schemas (Prisma)

### Schema Overview
```prisma
// File: prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("MONGODB_URI")
}

generator client {
  provider = "prisma-client-js"
}
```

### 1. Organization (Company/Tenant)
```prisma
model Organization {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  name            String    @unique
  email           String    @unique
  phone           String
  address         String
  city            String
  country         String
  
  // Relations
  projects        Project[]
  agents          Agent[]
  propertyTypes   PropertyType[]
  webhooks        WebhookLog[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([email])
  @@index([name])
}
```

### 2. Project (Real Estate Project)
```prisma
model Project {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  projectId       Int       @unique           // e.g., 25 (from MyProjects.js)
  name            String                      // e.g., "Basswood", "Victoria"
  description     String?
  
  // Google Sheet Integration
  googleSheetId   String    @unique
  sheetSyncStatus String    @default("pending") // pending, syncing, synced, failed
  lastSyncTime    DateTime?
  syncInterval    Int       @default(3600)  // seconds
  
  // Project Details
  organizationId  String    @db.ObjectId
  status          String    @default("active") // active, paused, completed, archived
  city            String?
  developer       String?
  budget          Float?
  
  // Relations
  organization    Organization @relation(fields: [organizationId], references: [id])
  properties      Property[]
  assignments     ProjectAssignment[]
  campaigns       ProjectCampaign[]
  spreadsheets    PropertySpreadsheet[]
  commissions     Commission[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([organizationId])
  @@index([projectId])
  @@index([name])
  @@index([status])
}
```

### 3. Property
```prisma
model Property {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  // Property Identification
  unitNumber      String
  municipalityNumber String?
  houseNumber     String?
  
  // Property Details
  type            String                  // villa, apt, townhouse, etc.
  bedrooms        Int?
  bathrooms       Int?
  sqft            Float?
  price           Float?
  
  // Location & Metadata
  projectId       String    @db.ObjectId
  propertyTypeId  String?   @db.ObjectId
  floors          String?
  amenities       String[]
  description     String?
  
  // Ownership
  ownerId         String?   @db.ObjectId
  status          String    @default("available") // available, sold, rented, archived
  
  // Spreadsheet Reference
  sheetRowId      Int?                    // Row in Google Sheet
  sheetLastSyncTime DateTime?
  
  // Relations
  project         Project   @relation(fields: [projectId], references: [id])
  owner           Owner?    @relation(fields: [ownerId], references: [id])
  propertyType    PropertyType? @relation(fields: [propertyTypeId], references: [id])
  contacts        Contact[]
  assignments     ProjectAssignment[]
  commissions     Commission[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([projectId, unitNumber])
  @@index([projectId])
  @@index([ownerId])
  @@index([status])
  @@index([type])
  @@fulltext([unitNumber, municipalityNumber])
}
```

### 4. Owner (Property Owner)
```prisma
model Owner {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  // Personal Info
  firstName       String
  lastName        String
  email           String?
  nationalId      String?   @unique
  nationality     String?
  
  // Contact
  primaryPhone    String
  secondaryPhone  String?
  
  // Address
  city            String?
  country         String?
  mailingAddress  String?
  
  // Status
  status          String    @default("active")
  isBadContact    Boolean   @default(false)  // "bastard" from code
  isBlacklisted   Boolean   @default(false)
  
  // Relations
  properties      Property[]
  contacts        Contact[]
  conversations   Conversation[]
  commissions     Commission[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([primaryPhone])
  @@index([secondaryPhone])
  @@index([email])
  @@index([isBadContact])
  @@fulltext([firstName, lastName])
}
```

### 5. Agent
```prisma
model Agent {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  // Agent Info
  name            String
  email           String?
  whatsappNumber  String    @unique  // e.g., "971509570067"
  
  // Agent Status & Role
  status          String    @default("active") // active, inactive, archived
  role            String    @default("agent")  // agent, supervisor, manager, admin
  expertiseAreas  String[]  // e.g., ["luxury", "villa", "investment"]
  
  // Organization
  organizationId  String    @db.ObjectId
  reportingTo     String?   @db.ObjectId      // Supervisor/Manager
  
  // Commission Info
  commissionRate  Float?                      // e.g., 2.5%
  bankDetails     BankDetails?
  
  // WhatsApp Session
  whatsappSessionPath String?
  sessionStatus   String    @default("disconnected") // connected, disconnected, error
  lastActive      DateTime?
  
  // Relations
  organization    Organization @relation(fields: [organizationId], references: [id])
  supervisor      Agent?    @relation("AgentSupervisor", fields: [reportingTo], references: [id])
  subordinates    Agent[]   @relation("AgentSupervisor")
  assignments     ProjectAssignment[]
  conversations   Conversation[]
  commissions     Commission[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([organizationId])
  @@index([whatsappNumber])
  @@index([status])
  @@index([role])
}

model BankDetails {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  agentId         String    @unique @db.ObjectId
  
  bankName        String
  accountNumber   String
  accountHolderName String
  iban            String?
  swiftCode       String?
  
  isVerified      Boolean   @default(false)
  
  agent           Agent     @relation(fields: [agentId], references: [id], onDelete: Cascade)
}
```

### 6. Contact
```prisma
model Contact {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  // Identification
  phone           String
  phoneCountry    String    @default("AE")
  phoneValidated  Boolean   @default(false)
  
  // Content
  ownerId         String?   @db.ObjectId
  propertyId      String?   @db.ObjectId
  type            String    @default("phone") // phone, email, whatsapp
  isPrimary       Boolean   @default(false)
  
  // Contact Status
  status          String    @default("valid")      // valid, invalid, do-not-contact
  isBlacklisted   Boolean   @default(false)
  
  // Validation History
  validationNotes String?
  validatedAt     DateTime?
  
  // Relations
  owner           Owner?    @relation(fields: [ownerId], references: [id])
  property        Property? @relation(fields: [propertyId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([phone, type])
  @@index([phone])
  @@index([ownerId])
  @@index([propertyId])
  @@index([status])
}
```

### 7. ProjectAssignment
```prisma
model ProjectAssignment {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  agentId         String    @db.ObjectId
  projectId       String    @db.ObjectId
  propertyId      String?   @db.ObjectId    // Optional: specific property
  
  // Assignment Details
  assignmentDate  DateTime  @default(now())
  dueDate         DateTime?
  status          String    @default("active") // active, completed, transferred
  notes           String?
  
  // Relations
  agent           Agent     @relation(fields: [agentId], references: [id])
  project         Project   @relation(fields: [projectId], references: [id])
  property        Property? @relation(fields: [propertyId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([agentId, projectId, propertyId])
  @@index([agentId])
  @@index([projectId])
}
```

### 8. Conversation
```prisma
model Conversation {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  // Participants
  agentId         String    @db.ObjectId
  ownerId         String    @db.ObjectId
  
  // Conversation Details
  whatsappChatId  String?   @unique
  status          String    @default("active") // active, closed, archived
  topic           String?   // property inquiry, commission discussion, etc.
  
  // Message Stats
  messageCount    Int       @default(0)
  
  // Timestamps
  startTime       DateTime  @default(now())
  endTime         DateTime?
  lastMessageTime DateTime?
  
  // Relations
  agent           Agent     @relation(fields: [agentId], references: [id])
  owner           Owner     @relation(fields: [ownerId], references: [id])
  messages        Message[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([agentId, ownerId])
  @@index([agentId])
  @@index([ownerId])
  @@index([status])
}
```

### 9. Message
```prisma
model Message {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  // Message Content
  conversationId  String    @db.ObjectId
  content         String
  messageType     String    @default("text") // text, image, document, etc.
  
  // Sender/Receiver
  senderId        String    @db.ObjectId    // AgentId or OwnerId
  senderType      String                    // Agent or Owner
  
  // WhatsApp Reference
  whatsappMessageId String?
  whatsappStatus  String?   // sent, delivered, read, failed
  
  // Message Analysis
  hasQuotedMsg    Boolean   @default(false)
  quotedMessageId String?   @db.ObjectId   // Reference to quoted message
  sentiment       String?                  // positive, neutral, negative
  
  // Metadata
  mediaUrl        String?
  mediaType       String?
  
  // Relations
  conversation    Conversation @relation(fields: [conversationId], references: [id])
  quotedMessage   Message?  @relation("QuotedMessages", fields: [quotedMessageId], references: [id])
  quoted          Message[] @relation("QuotedMessages")
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([conversationId])
  @@index([senderId])
  @@index([senderType])
  @@index([whatsappStatus])
  @@index([createdAt])
}
```

### 10. ProjectCampaign
```prisma
model ProjectCampaign {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  projectId       String    @db.ObjectId
  campaignName    String
  description     String?
  
  // Campaign Status
  status          String    @default("draft")  // draft, scheduled, running, completed, failed
  startDate       DateTime
  endDate         DateTime?
  
  // Campaign Stats
  totalRecipients Int       @default(0)
  successCount    Int       @default(0)
  failureCount    Int       @default(0)
  responseCount   Int       @default(0)
  
  // Campaign Details
  targetType      String    // all_owners, specific_property, recent_leads
  targetQuery     String?
  messageTemplate String?
  
  // Relations
  project         Project   @relation(fields: [projectId], references: [id])
  messages        CampaignMessage[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([projectId])
  @@index([status])
}

model CampaignMessage {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  campaignId      String    @db.ObjectId
  receiverPhone   String
  messageContent  String
  
  status          String    @default("pending") // pending, sent, delivered, failed
  sentAt          DateTime?
  deliveredAt     DateTime?
  
  // Relations
  campaign        ProjectCampaign @relation(fields: [campaignId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([campaignId])
  @@index([status])
}
```

### 11. Commission
```prisma
model Commission {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  // Commission Details
  projectId       String    @db.ObjectId
  propertyId      String    @db.ObjectId
  
  // Amount Calculation
  amount          Float
  rate            Float?    // percentage or fixed
  rateType        String    @default("percentage") // percentage, fixed
  
  // Parties Involved
  agentId         String?   @db.ObjectId
  ownerId         String?   @db.ObjectId
  
  // Status
  status          String    @default("pending")  // pending, approved, paid, disputed
  
  // Dates
  earnedDate      DateTime  @default(now())
  approvedDate    DateTime?
  
  // Relations
  project         Project   @relation(fields: [projectId], references: [id])
  property        Property  @relation(fields: [propertyId], references: [id])
  agent           Agent?    @relation(fields: [agentId], references: [id])
  owner           Owner?    @relation(fields: [ownerId], references: [id])
  payments        CommissionPayment[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([projectId])
  @@index([propertyId])
  @@index([agentId])
  @@index([status])
  @@index([earnedDate])
}

model CommissionPayment {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  commissionId    String    @db.ObjectId
  amount          Float
  
  paymentMethod   String    // bank_transfer, check, cash
  paymentDate     DateTime
  referenceNumber String?
  notes           String?
  
  // Relations
  commission      Commission @relation(fields: [commissionId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([commissionId])
}
```

### 12. PropertyType
```prisma
model PropertyType {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  organizationId  String    @db.ObjectId
  name            String    // villa, apartment, townhouse
  description     String?
  
  // Relations
  organization    Organization @relation(fields: [organizationId], references: [id])
  properties      Property[]
  
  @@unique([organizationId, name])
  @@index([organizationId])
}
```

### 13. PropertySpreadsheet (Google Sheets Sync)
```prisma
model PropertySpreadsheet {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  projectId       String    @db.ObjectId
  sheetName       String
  googleSheetId   String
  
  // Sync Status
  lastSyncTime    DateTime?
  syncStatus      String    @default("pending")
  syncError       String?
  
  // Mapping
  columnMappings  Json      // Maps sheet columns to property fields
  
  // Relations
  project         Project   @relation(fields: [projectId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([projectId])
  @@index([projectId])
}
```

### 14. WebhookLog
```prisma
model WebhookLog {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  
  organizationId  String    @db.ObjectId
  event           String    // sheet.sync, campaign.sent, etc.
  payload         Json
  
  status          String    @default("success") // success, failed, pending
  errorMessage    String?
  
  // Relations
  organization    Organization @relation(fields: [organizationId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([organizationId])
  @@index([event])
  @@index([createdAt])
}
```

---

## Part 4: Indexing Strategy (Performance)

### Critical Indexes (Already Defined Above)

```javascript
// MongoDB Index Creation Script
const indexes = [
  // Contact Lookups (Phone Number Validation)
  { collection: "Contact", index: { phone: 1 }, unique: true },
  { collection: "Contact", index: { ownerId: 1 } },
  
  // Agent WhatsApp Session
  { collection: "Agent", index: { whatsappNumber: 1 }, unique: true },
  { collection: "Agent", index: { organizationId: 1 } },
  { collection: "Agent", index: { status: 1 } },
  
  // Property Lookups
  { collection: "Property", index: { projectId: 1 } },
  { collection: "Property", index: { ownerId: 1 } },
  { collection: "Property", index: { "projectId": 1, "unitNumber": 1 }, unique: true },
  
  // Message Queries
  { collection: "Message", index: { conversationId: 1 } },
  { collection: "Message", index: { createdAt: 1 } },
  { collection: "Message", index: { senderId: 1, senderType: 1 } },
  
  // Project Campaign Tracking
  { collection: "ProjectCampaign", index: { projectId: 1 } },
  { collection: "ProjectCampaign", index: { status: 1 } },
  
  // Commission Lookups
  { collection: "Commission", index: { agentId: 1 } },
  { collection: "Commission", index: { projectId: 1 } },
  { collection: "Commission", index: { status: 1 } },
  
  // Text Search
  { collection: "Owner", index: { firstName: "text", lastName: "text" } },
  { collection: "Property", index: { unitNumber: "text", municipalityNumber: "text" } },
];
```

### Query Performance Tips

```javascript
// ✅ FAST - Uses index on phone
await Contact.findOne({ phone: "971509570067" });

// ✅ FAST - Uses compound index on projectId + unitNumber
await Property.findOne({ projectId: "...", unitNumber: "A101" });

// ✅ FAST - Uses index on conversationId + createdAt sort
await Message.find({ conversationId: "..." })
  .sort({ createdAt: -1 })
  .limit(50);

// ⚠️ SLOW - No index on email without index
// Add: { collection: "Owner", index: { email: 1 } }
```

---

## Part 5: Migration Strategy from Google Sheets

### Step 1: Data Export Structure
```javascript
// File: scripts/migrate-from-sheets.js

export interface SheetMigrationMap {
  projects: {
    source: "MyProjects.js",
    mapping: {
      ProjectID: "projectId",
      ProjectName: "name",
      ProjectSheetID: "googleSheetId"
    }
  },
  
  agents: {
    source: "Inputs/*.js",
    mapping: {
      Number: "whatsappNumber",
      Name: "name"
    }
  },
  
  properties: {
    source: "Google Sheets (dynamic)",
    columns: {
      "Column 5": "phone",
      "Column 7": "mobileNumber",
      "Column 8": "secondaryMobile"
    }
  }
}
```

### Step 2: Migration Phases

```
Phase 1: Setup & Validation (Week 1)
├─ Create MongoDB collections/indexes
├─ Write data validation rules
├─ Create rollback procedures
└─ Test on staging copy

Phase 2: Core Data Migration (Week 2)
├─ Migrate Projects (50+ projects)
├─ Migrate Agents & Organization
├─ Migrate Property Types
└─ Validate data integrity

Phase 3: Property & Owner Data (Week 3)
├─ Batch import from Google Sheets
├─ Validate phone numbers
├─ Deduplicate contacts
├─ Mark bad contacts

Phase 4: Historical Data (Week 4)
├─ Migrate commissions
├─ Migrate message history
├─ Archive old conversations
└─ Create audit trail

Phase 5: Cutover & Monitoring (Week 5)
├─ Run parallel systems
├─ Monitor data sync
├─ Handle real-time updates
├─ Gradual traffic shift
└─ Fallback procedures
```

### Step 3: Validation Rules

```javascript
// File: scripts/validation-rules.ts

export const ValidationRules = {
  Contact: {
    phone: {
      required: true,
      pattern: /^97[125]\d{9}$/,  // UAE format
      message: "Invalid phone number"
    }
  },
  
  Owner: {
    primaryPhone: {
      required: true,
      unique: true
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: false  // Optional field
    }
  },
  
  Agent: {
    whatsappNumber: {
      required: true,
      unique: true,
      pattern: /^97[125]\d{9}$/
    }
  },
  
  Project: {
    projectId: {
      required: true,
      unique: true
    }
  }
};
```

---

## Part 6: Implementation Checklist

### ✅ Database Setup
- [ ] Install Prisma
- [ ] Create schema.prisma file
- [ ] Initialize MongoDB connection
- [ ] Create migrations
- [ ] Seed initial data

### ✅ Models & Types
- [ ] Generate Prisma Client
- [ ] Create TypeScript types/interfaces
- [ ] Setup error handling
- [ ] Create custom validators

### ✅ CRUD Operations
- [ ] Repository pattern implementation
- [ ] Query builders
- [ ] Pagination utilities
- [ ] Search/filter helpers

### ✅ Data Sync
- [ ] Google Sheets → MongoDB sync
- [ ] Sync scheduler
- [ ] Conflict resolution
- [ ] Audit logging

### ✅ Performance
- [ ] Index creation
- [ ] Query optimization
- [ ] Caching strategy (Redis)
- [ ] Connection pooling

### ✅ Monitoring
- [ ] Performance metrics
- [ ] Error tracking
- [ ] Data quality checks
- [ ] Sync status dashboard

---

## Part 7: Best Practices Implementation

### Naming Conventions
```javascript
// Collections: PascalCase, singular
model Project { ... }
model Agent { ... }
model PropertyAssignment { ... }

// Fields: camelCase
firstName: String
whatsappNumber: String
lastSyncTime: DateTime

// Booleans: isXxx, hasXxx, canXxx
isBadContact: Boolean
hasQuotedMsg: Boolean
canApproveCommission: Boolean

// Status enums: lowercase with underscore
status: String @default("active") // active, inactive, archived
// ✅ Better: use enum
enum AgentStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}
```

### Soft Deletes
```prisma
model Property {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  
  // ... other fields
  
  // Soft delete pattern
  deletedAt DateTime?
  
  @@index([deletedAt])  // For filtering active records
}

// Usage in queries
const activeProperties = await Property.findMany({
  where: { deletedAt: null }
});
```

### Audit Trail
```prisma
model AuditLog {
  id          String  @id @default(auto()) @map("_id") @db.ObjectId
  
  entityType  String  // "Commission", "Agent", etc.
  entityId    String
  action      String  // "CREATED", "UPDATED", "DELETED"
  
  changes     Json    // { before: {...}, after: {...} }
  changedBy   String  // User ID
  
  createdAt   DateTime @default(now())
  
  @@index([entityType, entityId])
  @@index([changedAt])
}
```

### Data Versioning
```prisma
model ProjectVersion {
  id          String  @id @default(auto()) @map("_id") @db.ObjectId
  
  projectId   String  @db.ObjectId
  version     Int
  
  name        String
  status      String
  // ... all project fields
  
  createdBy   String
  createdAt   DateTime @default(now())
  
  @@unique([projectId, version])
}
```

### Encryption for Sensitive Data
```prisma
model Agent {
  id              String  @id @default(auto()) @map("_id") @db.ObjectId
  
  // Encrypt these fields
  nationalId      String  @db.String  // Encrypt in application
  bankAccount     String  @db.String  // Encrypt in application
  
  // Encrypted field values stored as JSON
  // Use: libsodium, TweetNaCl.js, or node-rsa
}
```

---

## Part 8: Connection Pooling Configuration

### Prisma Connection Pooling
```prisma
// prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("MONGODB_URI")
  
  // Connection pool settings (MongoDB)
  // Handled automatically by MongoDB driver
}
```

### Environment Configuration
```env
# .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?maxPoolSize=10&minPoolSize=5

# Connection options
DATABASE_URL_POOL_SIZE=10
DATABASE_URL_STATEMENT_CACHE_SIZE=250
DATABASE_URL_POOL_TIMEOUT=2
```

### Application Setup
```javascript
// src/db/prisma.ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn']
      : ['error']
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
```

---

## Part 9: Scalability Patterns

### Read/Write Splitting (Future)
```javascript
// When data volume grows beyond MongoDB single node

// Read replicas for analytics queries
const analyticsDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.MONGODB_REPLICA_READ_ONLY  // Read-only replica
    }
  }
});

// Write operations go to primary
const primaryDb = prisma;  // Primary MongoDB instance

// Usage:
const commission = await primaryDb.commission.create({...});
const stats = await analyticsDb.commission.groupBy({...});
```

### Sharding Strategy (If needed)
```javascript
// Shard key: projectId (high cardinality, even distribution)
// Sharding when: > 100GB data or > 1000 ops/sec

const shardKey = (projectId) => {
  // Determine shard based on projectId
  const shards = {
    'shard-1': ['project-1', 'project-2', ...],
    'shard-2': ['project-20', 'project-21', ...],
  };
  return findShardForProject(projectId);
};
```

### Data Archival
```javascript
// Move old data to archival collection
// Criteria: Completed campaigns > 6 months old

const archiveOldCampaigns = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const oldCampaigns = await Campaign.find({
    status: "completed",
    endDate: { $lt: sixMonthsAgo }
  });
  
  // Move to archive collection
  await CampaignArchive.insertMany(oldCampaigns);
  await Campaign.deleteMany({ _id: { $in: oldCampaigns.map(c => c._id) } });
};

// Schedule monthly:
schedule.scheduleJob('0 0 1 * *', archiveOldCampaigns);
```

---

## Part 10: Monitoring & Observability

### Performance Monitoring
```javascript
// File: src/middleware/monitoring.ts

import { performance } from 'perf_hooks';

export const mongoQueryMonitoring = async (operation, fn) => {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    logger.info({
      operation,
      duration,
      status: 'success'
    });
    
    // Alert if slow (> 1 second)
    if (duration > 1000) {
      alerts.slowQuery({ operation, duration });
    }
    
    return result;
  } catch (error) {
    logger.error({
      operation,
      error: error.message,
      duration: performance.now() - start
    });
    throw error;
  }
};
```

### Data Quality Checks
```javascript
// File: scripts/health-check.ts

export const runHealthChecks = async () => {
  const checks = [
    // Check for orphaned properties
    async () => {
      const orphaned = await Property.find({
        projectId: { $nin: await Project.distinct('id') }
      });
      return { name: 'orphaned_properties', count: orphaned.length };
    },
    
    // Check for invalid phone numbers
    async () => {
      const invalid = await Contact.find({
        phone: { $not: /^97[125]\d{9}$/ }
      });
      return { name: 'invalid_contacts', count: invalid.length };
    },
    
    // Check sync status
    async () => {
      const failed = await Project.find({
        sheetSyncStatus: 'failed'
      });
      return { name: 'failed_syncs', count: failed.length };
    }
  ];
  
  return Promise.all(checks.map(c => c()));
};
```

---

## Part 11: Environment Configuration

### Development (.env.local)
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@whitecavesdb.mongodb.net/whitecaves-dev

# Logging
LOG_LEVEL=debug
DATABASE_LOG=query

# Features
ENABLE_SYNC=true
SYNC_INTERVAL=3600
```

### Staging (.env.staging)
```env
NODE_ENV=staging
PORT=5000

MONGODB_URI=mongodb+srv://user:pass@whitecavesdb.mongodb.net/whitecaves-staging
MONGODB_REPLICA=mongodb+srv://user:pass@replica.mongodb.net/whitecaves-staging

LOG_LEVEL=info
ENABLE_REPORTING=true
```

### Production (.env.production)
```env
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb+srv://user:pass@whitecavesdb.mongodb.net/whitecaves
MONGODB_REPLICA=mongodb+srv://user:pass@replica.mongodb.net/whitecaves

LOG_LEVEL=warn
ENABLE_MONITORING=true
BACKUP_ENABLED=true
BACKUP_INTERVAL=86400
```

---

## Summary & Next Steps

### ✅ Deliverables Provided
1. **Complete Prisma Schema** - 14 models with relationships
2. **Entity Relationship Diagram** - Visual relationships
3. **Indexing Strategy** - Performance optimization
4. **Migration Plan** - 5-phase cutover from Google Sheets
5. **Best Practices** - Naming, soft deletes, encryption, versioning
6. **Scalability Patterns** - Sharding, archival, read replicas
7. **Monitoring Framework** - Health checks, performance tracking
8. **Configuration Templates** - Dev/staging/prod environments

### 🚀 Implementation Timeline
```
Week 1: Schema Setup & Validation
├─ Install dependencies
├─ Create schema.prisma
├─ Generate types
└─ Setup connection pool

Week 2-3: Migration & Data Import
├─ Export from Google Sheets
├─ Validate data quality
├─ Batch import to MongoDB
└─ Verify data integrity

Week 4: API Integration
├─ Create CRUD operations
├─ Setup query builders
├─ Add error handling
└─ Integration testing

Week 5: Monitoring & Production
├─ Deploy to staging
├─ Run health checks
├─ Monitor performance
└─ Production cutover
```

### 📋 Recommended Next Steps
1. **Install Prisma**
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

3. **Add Schema** - Use schema from Part 3 above

4. **Create Migration**
   ```bash
   npx prisma migrate dev --name initial_schema
   ```

5. **Generate Client**
   ```bash
   npx prisma generate
   ```

6. **Start Implementing** - Use CRUD examples from Part 12 (next section)

---

**Status:** ✅ Database design analysis COMPLETE  
**Next Document:** Part 12 - CRUD Operations & Repository Pattern Implementation
