# Quick Reference: White Caves Database Schema

## 🚀 What's Deployed

| Item | Status | Details |
|------|--------|---------|
| **MongoDB Collections** | ✅ Live | 14 collections in MongoDB Atlas |
| **Prisma Schema** | ✅ Deployed | 17 models with proper relationships |
| **Indexes** | ✅ Created | 70+ performance indexes |
| **Git Repository** | ✅ Pushed | Secrets cleaned, GitHub ready |
| **Prisma Client** | ✅ Generated | Ready for TypeScript/JavaScript |

---

## 📋 Model Quick Reference

### Core Tenants
```typescript
// Organization (1:N relationship)
Organization.projects → Project[]
Organization.agents → Agent[]
Organization.propertyTypes → PropertyType[]
Organization.webhooks → WebhookLog[]
```

### Projects & Properties
```typescript
Project.properties → Property[]
Property.project → Project
Property.owner → Owner
Property.contacts → Contact[]
Property.assignments → ProjectAssignment[]
Property.commissions → Commission[]
```

### People
```typescript
Agent.organization → Organization
Agent.supervisor → Agent (optional)
Agent.subordinates → Agent[]
Agent.conversations → Conversation[]
Agent.bankDetails → BankDetails

Owner.properties → Property[]
Owner.contacts → Contact[]
Owner.conversations → Conversation[]

Contact.owner → Owner (optional)
Contact.property → Property (optional)
```

### Communication
```typescript
Conversation.agent → Agent
Conversation.owner → Owner
Conversation.messages → Message[]

Message.conversation → Conversation
Message.quotedMessage → Message (optional)
Message.quoted → Message[]
```

### Campaigns
```typescript
ProjectCampaign.project → Project
ProjectCampaign.messages → CampaignMessage[]

CampaignMessage.campaign → ProjectCampaign
```

### Commissions
```typescript
Commission.project → Project
Commission.property → Property
Commission.agent → Agent (optional, SetNull)
Commission.owner → Owner (optional, SetNull)
Commission.payments → CommissionPayment[]

CommissionPayment.commission → Commission
```

### Integrations
```typescript
PropertySpreadsheet.project → Project

WebhookLog.organization → Organization
```

---

## 🔑 Key Fields by Model

### Organization
- `name` (unique)
- `email` (unique)
- `phone`, `address`, `city`, `country`

### Project
- `projectId` (unique)
- `googleSheetId` (unique)
- `sheetSyncStatus`: pending | syncing | synced | failed
- `organizationId`
- `status`: active | paused | completed | archived

### Property
- `projectId` + `unitNumber` (compound unique)
- `type`: villa | apt | townhouse | etc.
- `bedrooms`, `bathrooms`, `sqft`, `price`
- `ownerId` (optional)
- `status`: available | sold | rented | archived
- `deletedAt` (soft delete)

### Owner
- `primaryPhone` (unique)
- `nationalId` (unique, optional)
- `firstName`, `lastName`
- `isBadContact`: boolean (bastard flag)
- `isBlacklisted`: boolean
- `deletedAt` (soft delete)

### Agent
- `whatsappNumber` (unique)
- `organizationId`
- `reportingTo` (optional, self-reference)
- `status`: active | inactive | archived
- `role`: agent | supervisor | manager | admin
- `sessionStatus`: connected | disconnected | error
- `deletedAt` (soft delete)

### Contact
- `phone` + `type` (compound unique)
- `phoneCountry`: default "AE"
- `type`: phone | email | whatsapp
- `status`: valid | invalid | do-not-contact
- `isBlacklisted`: boolean
- `deletedAt` (soft delete)

### Message
- `conversationId`
- `content`, `messageType`
- `senderId`, `senderType`: Agent | Owner
- `whatsappMessageId`, `whatsappStatus`
- `sentiment`: positive | neutral | negative (optional)
- `deletedAt` (soft delete)

### Commission
- `projectId`, `propertyId`, `agentId`, `ownerId`
- `amount`, `rate`, `rateType`: percentage | fixed
- `status`: pending | approved | paid | disputed
- `earnedDate`, `approvedDate`
- `deletedAt` (soft delete)

---

## 🗄️ Important Indexes

### Unique Constraints (Auto-Indexed)
```
Organization: name, email
Project: projectId, googleSheetId
Property: projectId + unitNumber
Owner: nationalId, primaryPhone
Agent: whatsappNumber
Contact: phone + type
Conversation: agentId + ownerId, whatsappChatId
```

### Performance Indexes
```
Project.organizationId
Project.status
Property.projectId, ownerId, status
Agent.organizationId, status, role
Message.conversationId, senderId, whatsappStatus, createdAt
Commission.projectId, propertyId, status, earnedDate
```

---

## ⚡ Common Queries (Pseudocode)

### Find Agent's Conversations
```typescript
const agent = await prisma.agent.findUnique({
  where: { whatsappNumber: "971..." },
  include: { conversations: true }
})
```

### Get Project Properties
```typescript
const properties = await prisma.property.findMany({
  where: {
    projectId: projectId,
    deletedAt: null  // Soft delete filter
  },
  include: {
    owner: true,
    contacts: true
  }
})
```

### Find Conversation Messages
```typescript
const messages = await prisma.message.findMany({
  where: { conversationId: convId },
  orderBy: { createdAt: 'asc' },
  include: { quotedMessage: true }
})
```

### Calculate Agent Commissions
```typescript
const commissions = await prisma.commission.findMany({
  where: {
    agentId: agentId,
    status: { in: ['pending', 'approved'] }
  },
  include: { payments: true }
})
```

### Campaign Message Stats
```typescript
const stats = await prisma.campaignMessage.groupBy({
  by: ['status'],
  where: { campaignId: campaignId },
  _count: true
})
```

---

## 🛡️ Cascade & Delete Behavior

### Cascade Delete (deletes children)
```
Organization → Projects, Agents, PropertyTypes, WebhookLogs
Project → Properties, Assignments, Campaigns, Commissions
Agent → Assignments, Conversations, BankDetails
Property → Contacts, Assignments, Commissions
Conversation → Messages
```

### Set Null (preserves history)
```
Commission → Agent, Owner (maintains transaction records)
```

### No Action (reference integrity)
```
Agent.supervisor → Agent (prevents circular deletes)
Message.quotedMessage → Message (maintains reply chains)
```

---

## 📝 Soft Delete Pattern

Always filter deleted records:

```typescript
// Good
await prisma.owner.findMany({
  where: { deletedAt: null }
})

// Bad (includes deleted)
await prisma.owner.findMany()

// Soft delete
await prisma.owner.update({
  where: { id: ownerId },
  data: { deletedAt: new Date() }
})

// Restore
await prisma.owner.update({
  where: { id: ownerId },
  data: { deletedAt: null }
})
```

---

## 🔗 Valid Foreign Keys by Relationship

### Agent Relations
- `organizationId` → Organization.id (required)
- `reportingTo` → Agent.id (optional)

### Project Relations
- `organizationId` → Organization.id (required)

### Property Relations
- `projectId` → Project.id (required)
- `ownerId` → Owner.id (optional)
- `propertyTypeId` → PropertyType.id (optional)

### Contact Relations
- `ownerId` → Owner.id (optional)
- `propertyId` → Property.id (optional)

### Conversation Relations
- `agentId` → Agent.id (required)
- `ownerId` → Owner.id (required)

### Commission Relations
- `projectId` → Project.id (required)
- `propertyId` → Property.id (required)
- `agentId` → Agent.id (optional)
- `ownerId` → Owner.id (optional)

---

## 🚨 Breaking Change Notes

### What Changed from Previous Schema
- ✅ Added Soft Deletes to all major models
- ✅ Added Cascade Constraints properly
- ✅ Added Comprehensive Indexing
- ✅ Added Status Fields for workflow
- ✅ Added Audit Timestamps (built-in)
- ⚠️ REMOVED: Duplicate Indexes on Unique Fields
- ⚠️ REMOVED: @unique directly on fields (use constraints)
- ⚠️ CHANGED: Self-relation cascade to NoAction

### Migration Notes
- No data migration needed (new deployment)
- All previous models preserved
- Added new functionality layers
- Indexes auto-created by Prisma

---

## 📚 Documentation Links

- **Full Schema:** See `prisma/schema.prisma`
- **Deployment Summary:** `PRISMA_SCHEMA_DEPLOYMENT_SUMMARY.md`
- **Original Design:** `DATABASE_DESIGN_ANALYSIS.md`
- **CRUD Guide:** `DATABASE_CRUD_IMPLEMENTATION.md`
- **API Guide:** `DATABASE_API_SERVICES.md`

---

## ✅ Ready For

- ✅ Backend API Development (Express.js)
- ✅ Repository Pattern Implementation
- ✅ Service Layer Development
- ✅ TypeScript Type Generation
- ✅ Unit Testing
- ✅ Integration Testing
- ✅ API Documentation

---

## 🔥 Next Steps

1. **Create Repository Layer**
   ```typescript
   src/repositories/AgentRepository.ts
   src/repositories/ProjectRepository.ts
   // etc.
   ```

2. **Implement Services**
   ```typescript
   src/services/AgentService.ts
   src/services/CommissionService.ts
   // etc.
   ```

3. **Create Express Routes**
   ```typescript
   src/routes/agents.ts
   src/routes/projects.ts
   // etc.
   ```

4. **Add Validation**
   - Input validation middleware
   - Business rule validation
   - Authorization checks

5. **Write Tests**
   - Unit tests for services
   - Integration tests for APIs
   - E2E tests for workflows

---

## 📞 Support

Issues encountered?
1. Check `PRISMA_SCHEMA_DEPLOYMENT_SUMMARY.md` for known issues
2. Review relationship definitions in `prisma/schema.prisma`
3. Verify soft delete filters in queries
4. Check cascade behavior for deletes

---

**Schema Version:** 1.0  
**Deployment Date:** February 19, 2026  
**Status:** ✅ Production Ready
