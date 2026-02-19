# Part 13: Express API Services & Fast-Start Implementation Guide

---

## Quick Start: Setup in 5 Minutes

### Step 1: Install Dependencies

```bash
cd c:\Users\HP\Documents\Projects\White-Caves-DB

# Install Prisma and database client
npm install @prisma/client
npm install -D prisma

# TypeScript support (if not already installed)
npm install -D typescript @types/node ts-node

# Express & utilities
npm install express cors dotenv
npm install -D @types/express

# Development
npm install -D nodemon
```

### Step 2: Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Your data schema
- `.env` - Environment variables

### Step 3: Add MongoDB Connection

Edit `.env`:
```env
DATABASE_URL="mongodb+srv://arslanmalikgoraha_db_user:WhiteCaves2024@whitecavesdb.opetsag.mongodb.net/WhiteCavesDB?retryWrites=true&w=majority"
NODE_ENV=development
PORT=5000
```

### Step 4: Copy Schema

Copy the complete schema from `DATABASE_DESIGN_ANALYSIS.md` Part 3 into `prisma/schema.prisma`

### Step 5: Run Initial Migration

```bash
npx prisma migrate dev --name initial_schema
```

**Done!** Your database is ready.

---

## File: src/services/ProjectService.ts

```typescript
import { getRepositories } from "../repositories";
import { CreateProjectDTO } from "../types";

export class ProjectService {
  private repos = getRepositories();

  /**
   * Create new project with validation
   */
  async createProject(data: CreateProjectDTO) {
    // Validate required fields
    if (!data.projectId || !data.name || !data.googleSheetId) {
      throw new Error("Missing required fields: projectId, name, googleSheetId");
    }

    // Check for duplicates
    const existing = await this.repos.project.findByProjectId(data.projectId);
    if (existing) {
      throw new Error(`Project with ID ${data.projectId} already exists`);
    }

    // Create project
    const project = await this.repos.project.create({
      projectId: data.projectId,
      name: data.name,
      googleSheetId: data.googleSheetId,
      organizationId: data.organizationId,
      status: "active",
      sheetSyncStatus: "pending",
    });

    return project;
  }

  /**
   * Sync project data from Google Sheets
   */
  async syncProjectFromSheet(projectId: string) {
    const project = await this.repos.project.findByProjectId(projectId);
    if (!project) throw new Error("Project not found");

    try {
      // Update status to syncing
      await this.repos.project.updateSyncStatus(project.id, "syncing");

      // Get data from Google Sheets (implementation pending)
      // const sheetData = await getGoogleSheetData(project.googleSheetId);

      // Sync properties from sheet
      // await this.repos.property.syncFromSheet(project.id, sheetData);

      // Update status to synced
      await this.repos.project.updateSyncStatus(project.id, "synced");

      return { success: true, message: "Project synced successfully" };
    } catch (error) {
      await this.repos.project.updateSyncStatus(
        project.id,
        "failed",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  /**
   * Get project with full details and stats
   */
  async getProjectWithStats(id: string) {
    return this.repos.project.getProjectWithStats(id);
  }

  /**
   * Get project's commission summary
   */
  async getProjectCommissions(projectId: string) {
    return this.repos.commission.getProjectSummary(projectId);
  }

  /**
   * Deactivate project
   */
  async deactivateProject(projectId: string) {
    return this.repos.project.update(projectId, {
      status: "archived",
    });
  }
}
```

---

## File: src/services/PropertyService.ts

```typescript
import { getRepositories } from "../repositories";

export class PropertyService {
  private repos = getRepositories();

  /**
   * Search properties with filters
   */
  async searchProperties(criteria: any) {
    return this.repos.property.searchProperties(criteria);
  }

  /**
   * Assign property to owner
   */
  async assignOwner(propertyId: string, ownerPhone: string) {
    // Find or create owner
    const owner = await this.repos.owner.findOrCreateByPhone(ownerPhone);

    // Assign to property
    return this.repos.property.assignOwner(propertyId, owner.id);
  }

  /**
   * Get properties needing contact info
   */
  async getPropertiesWithoutOwners(projectId?: string) {
    return this.repos.property.findWithoutOwners(projectId);
  }

  /**
   * Get detailed property info
   */
  async getPropertyDetails(propertyId: string) {
    return this.repos.property.getPropertyDetails(propertyId);
  }

  /**
   * Sync properties from Google Sheet
   */
  async syncPropertiesFromSheet(projectId: string) {
    // Implementation would sync from actual Google Sheets data
    // This is a placeholder for the sync logic
    return {
      success: true,
      message: "Properties sync triggered",
    };
  }
}
```

---

## File: src/services/CommissionService.ts

```typescript
import { getRepositories } from "../repositories";

export class CommissionService {
  private repos = getRepositories();

  /**
   * Calculate commission for property sale
   */
  async calculateCommission(
    projectId: string,
    propertyId: string,
    agentId: string,
    salePrice: number,
    commissionRate: number = 2.5
  ) {
    const amount = (salePrice * commissionRate) / 100;

    const commission = await this.repos.commission.create({
      projectId,
      propertyId,
      agentId,
      amount,
      rate: commissionRate,
      rateType: "percentage",
      status: "pending",
      earnedDate: new Date(),
    });

    return commission;
  }

  /**
   * Approve pending commission
   */
  async approveCommission(commissionId: string) {
    const commission = await this.repos.commission.findById(commissionId);
    if (!commission) throw new Error("Commission not found");

    return this.repos.commission.approve(commissionId);
  }

  /**
   * Pay commission
   */
  async payCommission(
    commissionId: string,
    amount: number,
    method: "bank_transfer" | "check" | "cash",
    reference?: string
  ) {
    // Verify commission exists and is approved
    const commission = await this.repos.commission.findById(commissionId);
    if (!commission) throw new Error("Commission not found");
    if (commission.status !== "approved")
      throw new Error("Commission must be approved before payment");

    // Record the payment
    return this.repos.commission.recordPayment(
      commissionId,
      amount,
      method,
      reference
    );
  }

  /**
   * Get agent earnings for period
   */
  async getAgentEarnings(agentId: string, startDate: Date, endDate: Date) {
    return this.repos.commission.calculateAgentEarnings(
      agentId,
      startDate,
      endDate
    );
  }

  /**
   * Get pending commissions for review
   */
  async getPendingCommissions(agentId?: string) {
    if (agentId) {
      return this.repos.commission.findPendingForAgent(agentId);
    }

    // Get all pending commissions
    return this.repos.commission.findAll({
      where: { status: "pending" } as any,
    });
  }
}
```

---

## File: src/services/AgentService.ts

```typescript
import { getRepositories } from "../repositories";

export class AgentService {
  private repos = getRepositories();

  /**
   * Update WhatsApp session status
   */
  async updateWhatsAppSession(
    agentId: string,
    status: "connected" | "disconnected" | "error",
    sessionPath?: string
  ) {
    return this.repos.agent.updateWhatsAppSession(agentId, status, sessionPath);
  }

  /**
   * Get agent performance dashboard
   */
  async getPerformanceDashboard(agentId: string) {
    const [stats, profile] = await Promise.all([
      this.repos.agent.getAgentStats(agentId),
      this.repos.agent.getAgentProfile(agentId),
    ]);

    return {
      agent: profile,
      stats,
    };
  }

  /**
   * Get team performance report
   */
  async getTeamPerformance(supervisorId: string) {
    return this.repos.agent.getTeamPerformance(supervisorId);
  }

  /**
   * Deactivate agent
   */
  async deactivateAgent(agentId: string) {
    return this.repos.agent.deactivate(agentId);
  }
}
```

---

## File: src/routes/projectRoutes.ts

```typescript
import express, { Request, Response } from "express";
import { ProjectService } from "../services/ProjectService";

const router = express.Router();
const projectService = new ProjectService();

/**
 * POST /api/projects
 * Create new project
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json({
      success: true,
      data: project,
      message: "Project created successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

/**
 * GET /api/projects/:id
 * Get project with stats
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const project = await projectService.getProjectWithStats(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch project",
    });
  }
});

/**
 * POST /api/projects/:id/sync
 * Sync project from Google Sheets
 */
router.post("/:id/sync", async (req: Request, res: Response) => {
  try {
    const result = await projectService.syncProjectFromSheet(req.params.id);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * GET /api/projects/:id/commissions
 * Get project commission summary
 */
router.get("/:id/commissions", async (req: Request, res: Response) => {
  try {
    const commissions = await projectService.getProjectCommissions(
      req.params.id
    );
    res.json({
      success: true,
      data: commissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch commissions",
    });
  }
});

export default router;
```

---

## File: src/routes/commissionRoutes.ts

```typescript
import express, { Request, Response } from "express";
import { CommissionService } from "../services/CommissionService";

const router = express.Router();
const commissionService = new CommissionService();

/**
 * POST /api/commissions
 * Create commission for property sale
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      propertyId,
      agentId,
      salePrice,
      commissionRate,
    } = req.body;

    const commission = await commissionService.calculateCommission(
      projectId,
      propertyId,
      agentId,
      salePrice,
      commissionRate || 2.5
    );

    res.status(201).json({
      success: true,
      data: commission,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Creation failed",
    });
  }
});

/**
 * POST /api/commissions/:id/approve
 * Approve pending commission
 */
router.post("/:id/approve", async (req: Request, res: Response) => {
  try {
    const commission = await commissionService.approveCommission(req.params.id);
    res.json({
      success: true,
      data: commission,
      message: "Commission approved",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Approval failed",
    });
  }
});

/**
 * POST /api/commissions/:id/pay
 * Record commission payment
 */
router.post("/:id/pay", async (req: Request, res: Response) => {
  try {
    const { amount, method, reference } = req.body;

    const result = await commissionService.payCommission(
      req.params.id,
      amount,
      method,
      reference
    );

    res.json({
      success: true,
      data: result,
      message: "Payment recorded",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    });
  }
});

/**
 * GET /api/commissions/pending
 * Get pending commissions
 */
router.get("/pending", async (req: Request, res: Response) => {
  try {
    const agentId = req.query.agentId as string;
    const commissions = await commissionService.getPendingCommissions(agentId);

    res.json({
      success: true,
      data: commissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch commissions",
    });
  }
});

/**
 * GET /api/commissions/agent/:agentId/earnings
 * Get agent earnings for period
 */
router.get("/agent/:agentId/earnings", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "startDate and endDate are required",
      });
    }

    const earnings = await commissionService.getAgentEarnings(
      req.params.agentId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to calculate earnings",
    });
  }
});

export default router;
```

---

## File: src/routes/agentRoutes.ts

```typescript
import express, { Request, Response } from "express";
import { AgentService } from "../services/AgentService";

const router = express.Router();
const agentService = new AgentService();

/**
 * POST /api/agents/:id/whatsapp-session
 * Update WhatsApp session status
 */
router.post("/:id/whatsapp-session", async (req: Request, res: Response) => {
  try {
    const { status, sessionPath } = req.body;

    const agent = await agentService.updateWhatsAppSession(
      req.params.id,
      status,
      sessionPath
    );

    res.json({
      success: true,
      data: agent,
      message: `WhatsApp session ${status}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    });
  }
});

/**
 * GET /api/agents/:id/dashboard
 * Get agent performance dashboard
 */
router.get("/:id/dashboard", async (req: Request, res: Response) => {
  try {
    const dashboard = await agentService.getPerformanceDashboard(req.params.id);

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard",
    });
  }
});

/**
 * GET /api/agents/:id/team-performance
 * Get team performance (for supervisors)
 */
router.get("/:id/team-performance", async (req: Request, res: Response) => {
  try {
    const team = await agentService.getTeamPerformance(req.params.id);

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch team performance",
    });
  }
});

export default router;
```

---

## File: src/routes/index.ts

```typescript
import express from "express";
import projectRoutes from "./projectRoutes";
import commissionRoutes from "./commissionRoutes";
import agentRoutes from "./agentRoutes";

const router = express.Router();

router.use("/projects", projectRoutes);
router.use("/commissions", commissionRoutes);
router.use("/agents", agentRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

export default router;
```

---

## File: src/middleware/errorHandler.ts

```typescript
import express, { Request, Response, NextFunction } from "express";

interface ServiceError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ServiceError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[${new Date().toISOString()}] Error:`, {
    statusCode,
    message,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

---

## File: src/server.ts

```typescript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./db/prisma";
import apiRoutes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected");

    // Start listening
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
```

---

## File: package.json (scripts section)

```json
{
  "scripts": {
    "dev": "nodeemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 🚀 Start Development Server

```bash
# Install nodemon for auto-reload
npm install -D nodemon

# Start dev server
npm run dev

# Output should show:
# ✅ Database connected
# ✅ Server running on http://localhost:5000
```

---

## 📋 API Endpoints Quick Reference

### Projects
```
POST   /api/projects                    - Create project
GET    /api/projects/:id                - Get project with stats
POST   /api/projects/:id/sync           - Sync from Google Sheets
GET    /api/projects/:id/commissions    - Get project commissions
```

### Commissions
```
POST   /api/commissions                 - Create commission
POST   /api/commissions/:id/approve     - Approve commission
POST   /api/commissions/:id/pay         - Record payment
GET    /api/commissions/pending         - Get pending commissions
GET    /api/commissions/agent/:id/earnings - Get agent earnings
```

### Agents
```
POST   /api/agents/:id/whatsapp-session - Update WhatsApp status
GET    /api/agents/:id/dashboard        - Get performance dashboard
GET    /api/agents/:id/team-performance - Get team stats
```

---

## Testing the API

### Create Commission
```bash
curl -X POST http://localhost:5000/api/commissions \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project123",
    "propertyId": "property456",
    "agentId": "agent789",
    "salePrice": 500000,
    "commissionRate": 2.5
  }'
```

### Approve Commission
```bash
curl -X POST http://localhost:5000/api/commissions/commission123/approve
```

### Record Payment
```bash
curl -X POST http://localhost:5000/api/commissions/commission123/pay \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 12500,
    "method": "bank_transfer",
    "reference": "TXN-001"
  }'
```

---

## ✅ Implementation Checklist

- [ ] Create `src/` directory structure
- [ ] Copy Prisma schema from Part 3
- [ ] Install dependencies: `npm install @prisma/client express cors`
- [ ] Create `src/db/prisma.ts`
- [ ] Create repositories in `src/repositories/`
- [ ] Create services in `src/services/`
- [ ] Create routes in `src/routes/`
- [ ] Create `src/server.ts`
- [ ] Run migration: `npx prisma migrate dev --name initial`
- [ ] Start server: `npm run dev`
- [ ] Test endpoints with curl

---

## Next Steps

1. **Frontend Integration**
   - Update Redux actions to call these endpoints
   - Create API client service

2. **WhatsApp Bot Integration**
   - Update message handler to create `Message` records
   - Update conversation tracking with new schema

3. **Google Sheets Sync**
   - Implement actual sheet sync in ProjectService
   - Schedule periodic syncs with node-cron

4. **Testing**
   - Create integration tests with Jest
   - Test all CRUD operations
   - Test error scenarios

5. **Monitoring**
   - Add error tracking (Sentry)
   - Add performance monitoring
   - Create logging dashboard

---

**Status:** ✅ Express API services COMPLETE  
**Next:** Frontend integration & testing

