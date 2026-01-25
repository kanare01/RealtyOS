
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma
export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Basic Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// --- API Routes (Placeholders until logic files are created) ---

// Properties Route
app.get('/api/properties', async (req: Request, res: Response) => {
  try {
    // Mock Org ID 1 for now
    const properties = await prisma.property.findMany({
      where: { organizationId: 1 },
      include: { units: true }
    });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Tenants Route
app.get('/api/tenants', async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: { unit: { include: { property: true } } }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
