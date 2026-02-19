# Part 12: CRUD Operations & Repository Pattern Implementation

**File Location:** `src/repositories/` (TypeScript)

---

## Directory Structure

```
src/
├── db/
│   ├── prisma.ts              # Singleton instance
│   └── seed.ts                # Initial data seeding
│
├── repositories/
│   ├── BaseRepository.ts
│   ├── ProjectRepository.ts
│   ├── PropertyRepository.ts
│   ├── OwnerRepository.ts
│   ├── AgentRepository.ts
│   ├── ContactRepository.ts
│   ├── ConversationRepository.ts
│   ├── MessageRepository.ts
│   ├── CommissionRepository.ts
│   └── index.ts
│
├── services/
│   ├── ProjectService.ts
│   ├── PropertyService.ts
│   ├── CommissionService.ts
│   └── SyncService.ts
│
└── types/
    └── index.ts               # Shared interfaces
```

---

## 1. Database Connection (Singleton)

### File: src/db/prisma.ts

```typescript
import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
```

---

## 2. Base Repository Pattern

### File: src/repositories/BaseRepository.ts

```typescript
import { Prisma, PrismaClient } from "@prisma/client";

export interface PaginationOptions {
  skip: number;
  take: number;
}

export interface FindOptions<T> {
  where?: T;
  select?: Prisma.ProjectSelect | any;
  orderBy?: Prisma.ProjectOrderByWithRelationInput | any;
  pagination?: PaginationOptions;
}

export class BaseRepository<T, K> {
  constructor(
    private model: any,
    private prisma: PrismaClient
  ) {}

  /**
   * Find all records with optional filtering
   */
  async findAll(options?: FindOptions<K>) {
    const { where, select, orderBy, pagination } = options || {};

    return this.model.findMany({
      where,
      select,
      orderBy,
      skip: pagination?.skip || 0,
      take: pagination?.take || 100,
    });
  }

  /**
   * Find single record by ID
   */
  async findById(id: string, select?: any) {
    return this.model.findUnique({
      where: { id },
      select,
    });
  }

  /**
   * Find first record matching conditions
   */
  async findOne(where: K, select?: any) {
    return this.model.findFirst({
      where,
      select,
    });
  }

  /**
   * Count records matching conditions
   */
  async count(where?: K) {
    return this.model.count({ where });
  }

  /**
   * Create record
   */
  async create(data: Partial<T>) {
    return this.model.create({
      data,
    });
  }

  /**
   * Create multiple records
   */
  async createMany(data: Partial<T>[]) {
    return this.model.createMany({
      data,
      skipDuplicates: true,
    });
  }

  /**
   * Update record by ID
   */
  async update(id: string, data: Partial<T>) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Update multiple records
   */
  async updateMany(where: K, data: Partial<T>) {
    return this.model.updateMany({
      where,
      data,
    });
  }

  /**
   * Delete record by ID (hard delete)
   */
  async delete(id: string) {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Soft delete (mark as deleted)
   */
  async softDelete(id: string) {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Delete multiple records
   */
  async deleteMany(where: K) {
    return this.model.deleteMany({ where });
  }

  /**
   * Upsert record
   */
  async upsert(
    where: K,
    create: Partial<T>,
    update: Partial<T>
  ) {
    return this.model.upsert({
      where,
      create,
      update,
    });
  }

  /**
   * Check if record exists
   */
  async exists(where: K): Promise<boolean> {
    const record = await this.model.findFirst({ where });
    return !!record;
  }

  /**
   * Paginated search
   */
  async paginate(
    where: K,
    page: number = 1,
    pageSize: number = 20
  ) {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: pageSize,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Execute raw query
   */
  async raw(query: string, params: any[] = []) {
    return this.prisma.$queryRawUnsafe(query, ...params);
  }
}
```

---

## 3. Project Repository

### File: src/repositories/ProjectRepository.ts

```typescript
import { Prisma, Project } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import prisma from "../db/prisma";

export class ProjectRepository extends BaseRepository<
  Project,
  Prisma.ProjectWhereInput
> {
  constructor() {
    super(prisma.project, prisma);
  }

  /**
   * Find project by ID (numeric)
   */
  async findByProjectId(projectId: number) {
    return prisma.project.findUnique({
      where: { projectId },
      include: {
        properties: true,
        assignments: {
          include: { agent: true },
        },
        campaigns: true,
      },
    });
  }

  /**
   * Find all active projects
   */
  async findActiveProjects() {
    return prisma.project.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            properties: true,
            assignments: true,
          },
        },
      },
    });
  }

  /**
   * Get project with full stats
   */
  async getProjectWithStats(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            properties: {
              where: { status: "available" },
            },
            assignments: true,
            campaigns: true,
            commissions: true,
          },
        },
        properties: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        assignments: {
          include: { agent: { select: { name: true } } },
        },
      },
    });

    return {
      ...project,
      stats: {
        availableProperties: project?._count.properties || 0,
        activeAgents: project?._count.assignments || 0,
        activeCampaigns: project?._count.campaigns || 0,
        totalCommissions: project?._count.commissions || 0,
      },
    };
  }

  /**
   * Search projects by name
   */
  async searchProjects(query: string) {
    return prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });
  }

  /**
   * Update sync status
   */
  async updateSyncStatus(
    id: string,
    status: "pending" | "syncing" | "synced" | "failed",
    error?: string
  ) {
    return prisma.project.update({
      where: { id },
      data: {
        sheetSyncStatus: status,
        lastSyncTime: new Date(),
        ...(error && { description: error }), // Store error if failed
      },
    });
  }

  /**
   * Get projects needing sync
   */
  async getProjectsNeedingSync(minIntervalSeconds: number = 3600) {
    const threshold = new Date(
      Date.now() - minIntervalSeconds * 1000
    );

    return prisma.project.findMany({
      where: {
        OR: [
          { lastSyncTime: null },
          { lastSyncTime: { lt: threshold } },
          { sheetSyncStatus: "failed" },
        ],
      },
      orderBy: { lastSyncTime: "asc" },
      take: 10,
    });
  }
}
```

---

## 4. Property Repository

### File: src/repositories/PropertyRepository.ts

```typescript
import { Prisma, Property } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import prisma from "../db/prisma";

export class PropertyRepository extends BaseRepository<
  Property,
  Prisma.PropertyWhereInput
> {
  constructor() {
    super(prisma.property, prisma);
  }

  /**
   * Find property by unit number in project
   */
  async findByUnitNumber(projectId: string, unitNumber: string) {
    return prisma.property.findUnique({
      where: {
        projectId_unitNumber: { projectId, unitNumber },
      },
      include: { owner: true, contacts: true },
    });
  }

  /**
   * Find properties by owner
   */
  async findByOwner(ownerId: string) {
    return prisma.property.findMany({
      where: { ownerId },
      include: { project: true, contacts: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find available properties in project
   */
  async findAvailableInProject(
    projectId: string,
    limit: number = 50
  ) {
    return prisma.property.findMany({
      where: {
        projectId,
        status: "available",
      },
      select: {
        id: true,
        unitNumber,
        type: true,
        bedrooms: true,
        price: true,
      },
      take: limit,
    });
  }

  /**
   * Search properties by criteria
   */
  async searchProperties(criteria: {
    projectId?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
  }) {
    return prisma.property.findMany({
      where: {
        ...(criteria.projectId && { projectId: criteria.projectId }),
        ...(criteria.type && { type: criteria.type }),
        ...(criteria.minPrice && {
          price: { gte: criteria.minPrice },
        }),
        ...(criteria.maxPrice && {
          price: { lte: criteria.maxPrice },
        }),
        ...(criteria.minBedrooms && {
          bedrooms: { gte: criteria.minBedrooms },
        }),
      },
      include: { project: true, owner: true },
      orderBy: { price: "asc" },
    });
  }

  /**
   * Get property with full details
   */
  async getPropertyDetails(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: {
        project: true,
        owner: {
          include: {
            contacts: true,
            commissions: {
              where: { propertyId: id },
            },
          },
        },
        contacts: true,
        assignments: {
          include: { agent: true },
        },
        commissions: {
          include: { agent: true },
        },
      },
    });
  }

  /**
   * Update property owner
   */
  async assignOwner(propertyId: string, ownerId: string) {
    return prisma.property.update({
      where: { id: propertyId },
      data: { ownerId },
      include: { owner: true },
    });
  }

  /**
   * Get properties with missing owners
   */
  async findWithoutOwners(projectId?: string) {
    return prisma.property.findMany({
      where: {
        ownerId: null,
        ...(projectId && { projectId }),
      },
      include: { project: true, contacts: true },
    });
  }

  /**
   * Batch update from sheet sync
   */
  async syncFromSheet(
    projectId: string,
    properties: Partial<Property>[]
  ) {
    // Use transaction for atomicity
    return prisma.$transaction(
      properties.map((prop) =>
        prisma.property.upsert({
          where: {
            projectId_unitNumber: {
              projectId,
              unitNumber: prop.unitNumber || "",
            },
          },
          create: {
            projectId,
            ...prop,
          } as Prisma.PropertyCreateInput,
          update: {
            ...prop,
            sheetLastSyncTime: new Date(),
          },
        })
      )
    );
  }
}
```

---

## 5. Owner Repository

### File: src/repositories/OwnerRepository.ts

```typescript
import { Prisma, Owner } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import prisma from "../db/prisma";

export class OwnerRepository extends BaseRepository<
  Owner,
  Prisma.OwnerWhereInput
> {
  constructor() {
    super(prisma.owner, prisma);
  }

  /**
   * Find owner by phone number
   */
  async findByPhone(phone: string) {
    return prisma.owner.findUnique({
      where: { primaryPhone: phone },
      include: { properties: true, contacts: true },
    });
  }

  /**
   * Find or create owner by phone
   */
  async findOrCreateByPhone(
    phone: string,
    data?: Partial<Owner>
  ) {
    return prisma.owner.upsert({
      where: { primaryPhone: phone },
      update: {},
      create: {
        primaryPhone: phone,
        firstName: data?.firstName || "Unknown",
        lastName: data?.lastName || "",
        ...data,
      },
    });
  }

  /**
   * Search owners by name
   */
  async searchByName(firstName: string, lastName?: string) {
    return prisma.owner.findMany({
      where: {
        AND: [
          { firstName: { contains: firstName, mode: "insensitive" } },
          ...(lastName
            ? [{ lastName: { contains: lastName, mode: "insensitive" } }]
            : []),
        ],
      },
      include: { properties: true },
      take: 10,
    });
  }

  /**
   * Find bad contacts ("bastards")
   */
  async findBadContacts() {
    return prisma.owner.findMany({
      where: { isBadContact: true },
      select: { id: true, primaryPhone: true, firstName: true },
      take: 100,
    });
  }

  /**
   * Mark owner as bad contact
   */
  async markAsBadContact(ownerId: string, reason?: string) {
    return prisma.owner.update({
      where: { id: ownerId },
      data: {
        isBadContact: true,
        // Store reason in conversations/messages
      },
    });
  }

  /**
   * Find blacklisted owners
   */
  async findBlacklisted() {
    return prisma.owner.findMany({
      where: { isBlacklisted: true },
    });
  }

  /**
   * Get owner with full profile
   */
  async getOwnerProfile(id: string) {
    return prisma.owner.findUnique({
      where: { id },
      include: {
        properties: {
          include: { project: true },
        },
        contacts: true,
        conversations: {
          include: { agent: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        commissions: {
          include: { project: true },
          orderBy: { earnedDate: "desc" },
        },
      },
    });
  }

  /**
   * Get owner statistics
   */
  async getOwnerStats(ownerId: string) {
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        _count: {
          select: {
            properties: true,
            contacts: true,
            conversations: true,
            commissions: true,
          },
        },
        commissions: {
          where: { status: "paid" },
          select: { amount: true },
        },
      },
    });

    const totalCommissionsPaid = owner?.commissions.reduce(
      (sum, c) => sum + c.amount,
      0
    ) || 0;

    return {
      ownerName: `${owner?.firstName} ${owner?.lastName}`,
      properties: owner?._count.properties || 0,
      contacts: owner?._count.contacts || 0,
      conversations: owner?._count.conversations || 0,
      commissionsPaid: totalCommissionsPaid,
      totalCommissions: owner?._count.commissions || 0,
    };
  }
}
```

---

## 6. Agent Repository

### File: src/repositories/AgentRepository.ts

```typescript
import { Prisma, Agent } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import prisma from "../db/prisma";

export class AgentRepository extends BaseRepository<
  Agent,
  Prisma.AgentWhereInput
> {
  constructor() {
    super(prisma.agent, prisma);
  }

  /**
   * Find agent by WhatsApp number
   */
  async findByWhatsAppNumber(whatsappNumber: string) {
    return prisma.agent.findUnique({
      where: { whatsappNumber },
      include: {
        assignments: { include: { project: true } },
        commissions: true,
      },
    });
  }

  /**
   * Find active agents by organization
   */
  async findActiveByOrganization(organizationId: string) {
    return prisma.agent.findMany({
      where: {
        organizationId,
        status: "active",
      },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            assignments: true,
            commissions: true,
          },
        },
      },
    });
  }

  /**
   * Get agent with assignments and stats
   */
  async getAgentProfile(agentId: string) {
    return prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        assignments: {
          include: { project: true, property: true },
          orderBy: { assignmentDate: "desc" },
        },
        commissions: {
          include: { project: true, property: true },
          orderBy: { earnedDate: "desc" },
          take: 10,
        },
        conversations: {
          include: { owner: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        supervisor: {
          select: { id: true, name: true },
        },
      },
    });
  }

  /**
   * Get agent performance stats
   */
  async getAgentStats(agentId: string) {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        _count: {
          select: {
            assignments: true,
            conversations: { where: { status: { ne: "closed" } } },
            commissions: true,
          },
        },
        commissions: {
          where: { status: "paid" },
          select: { amount: true },
        },
      },
    });

    const totalEarnings = agent?.commissions.reduce(
      (sum, c) => sum + c.amount,
      0
    ) || 0;

    return {
      name: agent?.name,
      role: agent?.role,
      status: agent?.status,
      activeAssignments: agent?._count.assignments || 0,
      activeConversations: agent?._count.conversations || 0,
      totalCommissions: agent?._count.commissions || 0,
      totalEarnings,
      commissionRate: agent?.commissionRate,
      lastActive: agent?.lastActive,
    };
  }

  /**
   * Update WhatsApp session
   */
  async updateWhatsAppSession(
    agentId: string,
    sessionStatus: "connected" | "disconnected" | "error",
    sessionPath?: string
  ) {
    return prisma.agent.update({
      where: { id: agentId },
      data: {
        sessionStatus,
        ...(sessionPath && { whatsappSessionPath: sessionPath }),
        lastActive: sessionStatus === "connected" ? new Date() : undefined,
      },
    });
  }

  /**
   * Deactivate agent
   */
  async deactivate(agentId: string) {
    return prisma.agent.update({
      where: { id: agentId },
      data: { status: "inactive" },
    });
  }

  /**
   * Find agents by expertise area
   */
  async findByExpertise(area: string) {
    return prisma.agent.findMany({
      where: { expertiseAreas: { has: area } },
      include: {
        _count: { select: { assignments: true } },
      },
    });
  }

  /**
   * Get team performance (by supervisor)
   */
  async getTeamPerformance(supervisorId: string) {
    return prisma.agent.findMany({
      where: {
        reportingTo: supervisorId,
        status: "active",
      },
      include: {
        _count: {
          select: {
            assignments: true,
            conversations: true,
            commissions: true,
          },
        },
        commissions: {
          where: { status: "paid" },
          select: { amount: true },
        },
      },
    });
  }
}
```

---

## 7. Commission Repository

### File: src/repositories/CommissionRepository.ts

```typescript
import { Prisma, Commission } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import prisma from "../db/prisma";

export class CommissionRepository extends BaseRepository<
  Commission,
  Prisma.CommissionWhereInput
> {
  constructor() {
    super(prisma.commission, prisma);
  }

  /**
   * Find pending commissions for agent
   */
  async findPendingForAgent(agentId: string) {
    return prisma.commission.findMany({
      where: {
        agentId,
        status: "pending",
      },
      include: {
        project: true,
        property: true,
      },
      orderBy: { earnedDate: "desc" },
    });
  }

  /**
   * Calculate agent earnings for period
   */
  async calculateAgentEarnings(
    agentId: string,
    startDate: Date,
    endDate: Date
  ) {
    const commissions = await prisma.commission.findMany({
      where: {
        agentId,
        status: "paid",
        earnedDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { payments: true },
    });

    const totalEarned = commissions.reduce(
      (sum, c) => sum + c.amount,
      0
    );
    const totalPaid = commissions.reduce(
      (sum, c) =>
        sum +
        c.payments.reduce(
          (psum, p) => psum + p.amount,
          0
        ),
      0
    );

    return {
      totalEarned,
      totalPaid,
      balance: totalEarned - totalPaid,
      commissionCount: commissions.length,
      commissions,
    };
  }

  /**
   * Get project commission summary
   */
  async getProjectSummary(projectId: string) {
    const commissions = await prisma.commission.findMany({
      where: { projectId },
      include: { agent: true, owner: true },
    });

    const byStatus = {
      pending: commissions.filter(c => c.status === "pending"),
      approved: commissions.filter(c => c.status === "approved"),
      paid: commissions.filter(c => c.status === "paid"),
    };

    return {
      project: projectId,
      total: commissions.length,
      byStatus: {
        pending: {
          count: byStatus.pending.length,
          amount: byStatus.pending.reduce((sum, c) => sum + c.amount, 0),
        },
        approved: {
          count: byStatus.approved.length,
          amount: byStatus.approved.reduce((sum, c) => sum + c.amount, 0),
        },
        paid: {
          count: byStatus.paid.length,
          amount: byStatus.paid.reduce((sum, c) => sum + c.amount, 0),
        },
      },
      totalAmount: commissions.reduce((sum, c) => sum + c.amount, 0),
    };
  }

  /**
   * Approve commission
   */
  async approve(commissionId: string) {
    return prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: "approved",
        approvedDate: new Date(),
      },
    });
  }

  /**
   * Record payment
   */
  async recordPayment(
    commissionId: string,
    amount: number,
    method: string,
    reference?: string
  ) {
    return prisma.$transaction([
      prisma.commissionPayment.create({
        data: {
          commissionId,
          amount,
          paymentMethod: method,
          paymentDate: new Date(),
          referenceNumber: reference,
        },
      }),
      prisma.commission.update({
        where: { id: commissionId },
        data: {
          status: amount >= (await this.getRemainingBalance(commissionId))
            ? "paid"
            : "pending",
        },
      }),
    ]);
  }

  /**
   * Get remaining balance on commission
   */
  async getRemainingBalance(commissionId: string): Promise<number> {
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId },
      include: { payments: true },
    });

    if (!commission) return 0;

    const paid = commission.payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );
    return commission.amount - paid;
  }

  /**
   * Dispute commission
   */
  async dispute(commissionId: string, reason: string) {
    return prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: "disputed",
      },
    });
  }
}
```

---

## 8. Contact Repository

### File: src/repositories/ContactRepository.ts

```typescript
import { Prisma, Contact } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import prisma from "../db/prisma";

export class ContactRepository extends BaseRepository<
  Contact,
  Prisma.ContactWhereInput
> {
  constructor() {
    super(prisma.contact, prisma);
  }

  /**
   * Find contact by phone
   */
  async findByPhone(phone: string) {
    return prisma.contact.findUnique({
      where: { phone_type: { phone, type: "phone" } },
      include: { owner: true, property: true },
    });
  }

  /**
   * Validate phone number format
   */
  async validatePhoneFormat(phone: string): Promise<{
    valid: boolean;
    country: string;
    number: string;
  }> {
    // UAE format validation example
    const uaePattern = /^971([0-9]){9}$/;
    const pkPattern = /^92[0-9]{10}$/;

    if (uaePattern.test(phone)) {
      return { valid: true, country: "AE", number: phone };
    } else if (pkPattern.test(phone)) {
      return { valid: true, country: "PK", number: phone };
    }

    return { valid: false, country: "", number: "" };
  }

  /**
   * Find invalid contacts for review
   */
  async findInvalidContacts() {
    return prisma.contact.findMany({
      where: {
        OR: [
          { status: "invalid" },
          { isBlacklisted: true },
        ],
      },
      include: { owner: true, property: true },
      take: 100,
    });
  }

  /**
   * Mark contact as do-not-contact
   */
  async markAsDoNotContact(contactId: string, reason?: string) {
    return prisma.contact.update({
      where: { id: contactId },
      data: {
        status: "do-not-contact",
        isBlacklisted: true,
        validationNotes: reason,
      },
    });
  }

  /**
   * Get contacts by owner
   */
  async getOwnerContacts(ownerId: string) {
    return prisma.contact.findMany({
      where: { ownerId, status: "valid" },
      orderBy: { isPrimary: "desc" },
    });
  }

  /**
   * Get primary contact for owner
   */
  async getPrimaryContact(ownerId: string) {
    return prisma.contact.findFirst({
      where: { ownerId, isPrimary: true },
    });
  }

  /**
   * Deduplicate contacts
   */
  async deduplicatePhones() {
    const duplicates = await prisma.$queryRaw`
      SELECT phone, type, COUNT(*) as count
      FROM "Contact"
      GROUP BY phone, type
      HAVING COUNT(*) > 1
    `;

    return duplicates;
  }
}
```

---

## 9. Message Repository

### File: src/repositories/MessageRepository.ts

```typescript
import { Prisma, Message } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import prisma from "../db/prisma";

export class MessageRepository extends BaseRepository<
  Message,
  Prisma.MessageWhereInput
> {
  constructor() {
    super(prisma.message, prisma);
  }

  /**
   * Get conversation messages (paginated)
   */
  async getConversationMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });
  }

  /**
   * Get recent messages from agent
   */
  async getAgentMessages(agentId: string, limit: number = 20) {
    return prisma.message.findMany({
      where: {
        senderType: "Agent",
        senderId: agentId,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { conversation: true },
    });
  }

  /**
   * Find unread messages
   */
  async findUnread(conversationId: string) {
    return prisma.message.findMany({
      where: {
        conversationId,
        whatsappStatus: { ne: "read" },
      },
    });
  }

  /**
   * Search messages by content
   */
  async searchByContent(conversationId: string, query: string) {
    return prisma.message.findMany({
      where: {
        conversationId,
        content: { contains: query, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  /**
   * Get message stats for conversation
   */
  async getConversationStats(conversationId: string) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      select: {
        senderType: true,
        whatsappStatus: true,
        createdAt: true,
      },
    });

    return {
      totalMessages: messages.length,
      agentMessages: messages.filter(m => m.senderType === "Agent").length,
      ownerMessages: messages.filter(m => m.senderType === "Owner").length,
      deliveredMessages: messages.filter(m => m.whatsappStatus === "delivered").length,
      failedMessages: messages.filter(m => m.whatsappStatus === "failed").length,
      firstMessage: messages.length > 0 ? messages[messages.length - 1].createdAt : null,
      lastMessage: messages.length > 0 ? messages[0].createdAt : null,
    };
  }
}
```

---

## 10. Repository Index

### File: src/repositories/index.ts

```typescript
export { BaseRepository } from "./BaseRepository";
export { ProjectRepository } from "./ProjectRepository";
export { PropertyRepository } from "./PropertyRepository";
export { OwnerRepository } from "./OwnerRepository";
export { AgentRepository } from "./AgentRepository";
export { ContactRepository } from "./ContactRepository";
export { CommissionRepository } from "./CommissionRepository";
export { MessageRepository } from "./MessageRepository";

// Singleton instances
let projectRepo: ProjectRepository;
let propertyRepo: PropertyRepository;
let ownerRepo: OwnerRepository;
let agentRepo: AgentRepository;
let contactRepo: ContactRepository;
let commissionRepo: CommissionRepository;
let messageRepo: MessageRepository;

export const getRepositories = () => {
  if (!projectRepo) projectRepo = new ProjectRepository();
  if (!propertyRepo) propertyRepo = new PropertyRepository();
  if (!ownerRepo) ownerRepo = new OwnerRepository();
  if (!agentRepo) agentRepo = new AgentRepository();
  if (!contactRepo) contactRepo = new ContactRepository();
  if (!commissionRepo) commissionRepo = new CommissionRepository();
  if (!messageRepo) messageRepo = new MessageRepository();

  return {
    project: projectRepo,
    property: propertyRepo,
    owner: ownerRepo,
    agent: agentRepo,
    contact: contactRepo,
    commission: commissionRepo,
    message: messageRepo,
  };
};
```

---

## Usage Examples

### Example 1: Create Commission and Record Payment

```typescript
import { getRepositories } from "../repositories";

async function createCommissionAndPay(
  projectId: string,
  propertyId: string,
  agentId: string,
  amount: number
) {
  const repos = getRepositories();
  
  try {
    // Create commission
    const commission = await repos.commission.create({
      projectId,
      propertyId,
      agentId,
      amount,
      rate: 2.5,
      rateType: "percentage",
      status: "pending",
      earnedDate: new Date(),
    });

    // Record payment
    await repos.commission.recordPayment(
      commission.id,
      amount,
      "bank_transfer",
      "TXN-001"
    );

    return commission;
  } catch (error) {
    console.error("Commission creation failed:", error);
    throw error;
  }
}
```

### Example 2: Find or Create Owner

```typescript
async function findOrCreateOwner(phone: string) {
  const repos = getRepositories();
  
  const owner = await repos.owner.findOrCreateByPhone(phone, {
    firstName: "Unknown",
    primaryPhone: phone,
  });
  
  return owner;
}
```

### Example 3: Get Agent Performance

```typescript
async function getAgentPerformance(agentId: string) {
  const repos = getRepositories();
  
  const stats = await repos.agent.getAgentStats(agentId);
  const earnings = await repos.commission.calculateAgentEarnings(
    agentId,
    new Date("2024-01-01"),
    new Date("2024-12-31")
  );
  
  return { ...stats, earnings };
}
```

---

**Status:** ✅ CRUD & Repository implementation COMPLETE  
**Next:** Service layer and API endpoints

