# RealtyOS Enterprise Architecture Blueprint
## Transforming RealtyOS into a Production-Grade, Multi-Tenant SaaS Property Management Ecosystem

This blueprint outlines the complete system audit, structural gap analysis, database entity relationship diagrams, API specs, and the multi-phased path to transforming RealtyOS from private portfolio tool to an enterprise SaaS platform.

---

## 1. Core Architecture Analysis

### Current State
RealtyOS runs as a full-stack **Express + Vite** application in a single instance container. 
- **Frontend**: Single-page React application with client-driven states serviced by `/contexts/DataContext.tsx`. State fetching is un-paginated and assumes small dataset limits.
- **Backend**: `/server.ts` exposes simple JSON REST endpoints over in-memory mutable javascript structures (`let data`).
- **Persistence**: Stateless in-memory store. Data resets are highly vulnerable to container restarts or crashes.
- **Scaling Capability**: None. Because variables are bound in-memory to a single node thread, scaling to multiple containers or running behind an ingress load balancer breaks state consistency instantly.

### Target State
A highly available, **Multi-Tenant SaaS Engine** structured using a decoupled API microservices architecture, backing cloud-native databases, and maintaining real-time edge integration.
- **Framework**: Decoupled clean architectural layer (backed by highly modular Express or NestJS design patterns) with absolute Separation of Concerns.
- **Database**: PostgreSQL with multi-tenant row-level partitioning (or schema isolation per Organization) driven securely by Prisma ORM.
- **Cache & Message Broker**: Redis layer for handling state caches, session tracking (JWT Token Blacklists), rate-limits, and async event distribution queues (e.g., triggers for Africa's Talking SMS SMS, MPESA verification, and CRM lead capture).

---

## 2. Dependency Audit & Gap Analysis

To convert this framework into the specified systems, the following package dependencies must be introduced and cataloged:

| Dependency Package | Standard Purpose | Gap addressed | Status |
| :--- | :--- | :--- | :--- |
| `@prisma/client` & `prisma` | Database ORM | Replace inconsistent arrays with schema-enforced transactions, cascading foreign keys, and indexes. | **Missing** |
| `pg` / `pg-pool` | PostgreSQL Client | Communication conduit between Node backend and physical storage instances. | **Missing** |
| `ioredis` | Redis Connection Engine | Cache layer, distributed session locks, and job queues. | **Missing** |
| `bcrypt` | Cryptographic Salt & Hash | Resolves cleartext password breach exposure in standard state. | **Missing** |
| `jsonwebtoken` | Session Isolation (JWT) | Replaces custom dummy strings with cryptographically signed bearer tokens. | **Missing** |
| `zoho-node-sdk` / `bullmq` | Queue Work Manager | Background jobs orchestration (such as invoicing generators and MPESA status polls). | **Missing** |
| `clsx` & `tailwind-merge` | CSS Class Merging | Style overriding consistency for customized white-label styles. | **Pre-installed** |
| `lucide-react` | Scalable Vector Icons | Replaces custom SVG elements with semantic icons. | **Pre-installed** |

---

## 3. Schema Conflicts & Integrity Mapping

A direct comparison of current in-memory model interfaces and robust Relational Database systems highlights severe mapping gaps:

1. **Owner-Property Direct Bindings**: Properties currently exist in isolation without a direct foreign key connection back to an owning `Organization` or `Branch`. This permits unauthorized tenants or unauthorized actors to fetch non-affiliated property lists.
2. **Tenant Lease Decoupling**: Currently, tenants have fields like `leaseEndDate` and `depositPaid` on the root entity itself. If a tenant renews a lease with different rental increments or changes units, the historical records are overwritten. There is no historical `Lease` transaction table.
3. **Arrears vs Payments Calculations**: The current project tracks an internal `balance` field on the Tenant record. Modifying this field procedurally via math updates is fragile. It must be computed dynamically using ledger records (Double-Entry Debit/Credit ledger balances) to prevent transaction drift.

---

## 4. Security Gap Audit (OWASP Standards)

Our audit of the codebase identified key vulnerability vectors:

- **Missing Role-Based Access Controls (RBAC)**: All endpoints in `/server.ts` lack authentication checks and security guards. Anyone accessing `/api/data` or submitting a payload via POST `/api/properties` can edit administrative systems.
- **No Input Type Validations**: No schema validations (e.g., using `zod` or class-validators) exist for inputs on the backend endpoints. Floating amounts, negative numeric rents, or XSS scripts on street addresses bypass sanitization gates easily.
- **JWT Lifetimes & Session Invalidation**: Current session authentication utilizes a single hardcoded dummy token returned on login. There is no active expiration, refresh rotation, or validation layer.

---

## 5. Horizontally Scalable Strategy

To handle high volumes, RealtyOS must operate under an **Isolated Event-Driven State**:
1. **Multi-Tenant Partitioning**: Implement `organizationId` matching indexes across ALL entities. Every single query executed by the server must be strictly bound using a tenant-isolation where-clause:
   ```sql
   SELECT * FROM "Properties" WHERE "organizationId" = $1 AND "id" = $2;
   ```
2. **Read-Write Splitting**: Route standard analytics queries to a Read-replica, keeping the Primary node dedicated exclusively to high-throughput transactions (MPESA webhook callbacks, rent collection, invoice generation).
3. **Queue Processing Offload**: High-intensity tasks (SMS broadcasts, invoice PDF compiles, and report downloads) are pushed immediately onto Redis-backed queue loops (BullMQ workers), isolation-guaranteeing server responsiveness.

---

## 6. Enterprise Database Entity-Relationship (ERD) Specification

```
                          ┌────────────────────────┐
                          │     Organizations      │
                          └───────────┬────────────┘
                                      │ 1:N
                          ┌───────────▼────────────┐
                          │        Branches        │
                          └───────────┬────────────┘
                                      │ 1:N
                          ┌───────────▼────────────┐
                          │       Properties       │
                          └───────────┬────────────┘
                                      │ 1:N
                          ┌───────────▼────────────┐
                          │         Units          │
                          └───────────┬────────────┘
                                      │ 1:N
                          ┌───────────▼────────────┐
                          │        Tenants         │
                          └───────────┬────────────┘
                                      │ 1:N
             ┌────────────────────────┼────────────────────────┐
             │ 1:N                    │ 1:N                    │ 1:N
   ┌─────────▼────────┐     ┌─────────▼────────┐     ┌─────────▼────────┐
   │      Leases      │     │    Invoices      │     │     Payments     │
   └─────────┬────────┘     └─────────┬────────┘     └──────────────────┘
             │ 1:N                    │ 1:N (FIFO mapping)
   ┌─────────▼────────┐     ┌─────────▼────────┐
   │   Inspections    │     │  Double Entry    │
   └──────────────────┘     │  General Ledger  │
                            └──────────────────┘
```

### Full DDL SQL Schema Specification (PostgreSQL Enforced)

```sql
-- PostgreSQL Enterprise Database Schema Definitions

CREATE TYPE "UserRole" AS ENUM ('SystemAdmin', 'OrgAdmin', 'PropertyManager', 'Accountant', 'Tenant', 'Vendor');
CREATE TYPE "LeaseStatus" AS ENUM ('Draft', 'PendingApproval', 'Active', 'RenewalDue', 'Expired', 'Terminated');
CREATE TYPE "InvoiceStatus" AS ENUM ('Paid', 'Unpaid', 'PartiallyPaid', 'Overdue', 'Cancelled');
CREATE TYPE "MaintenanceStatus" AS ENUM ('Open', 'Assigned', 'InProgress', 'Completed', 'Cancelled');
CREATE TYPE "MpesaStatus" AS ENUM ('Pending', 'Success', 'Failed');

-- 1. Organizations (Multi-Tenant Roots)
CREATE TABLE "Organizations" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "subdomain" VARCHAR(100) UNIQUE NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Branches
CREATE TABLE "Branches" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) UNIQUE NOT NULL,
    "location" TEXT
);

-- 3. Users (Multi-Tenant Affiliated)
CREATE TABLE "Users" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Tenant',
    "phone" VARCHAR(50),
    "mfaSecret" VARCHAR(255),
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "isBlocked" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Properties
CREATE TABLE "Properties" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "branchId" INT REFERENCES "Branches"("id") ON DELETE SET NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100),
    "waterRate" DECIMAL(10, 2) DEFAULT 0.00,
    "electricityRate" DECIMAL(10, 2) DEFAULT 0.00,
    "paybillNumber" VARCHAR(50),
    "isArchived" BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5. Units
CREATE TABLE "Units" (
    "id" SERIAL PRIMARY KEY,
    "propertyId" INT REFERENCES "Properties"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "rentAmount" DECIMAL(10, 2) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Vacant',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. Tenants
CREATE TABLE "Tenants" (
    "id" SERIAL PRIMARY KEY,
    "userId" INT REFERENCES "Users"("id") ON DELETE SET NULL,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50) NOT NULL,
    "identityNumber" VARCHAR(50),
    "kraPin" VARCHAR(50),
    "balance" DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- 7. Leases (The Core Lifecycles)
CREATE TABLE "Leases" (
    "id" SERIAL PRIMARY KEY,
    "tenantId" INT REFERENCES "Tenants"("id") ON DELETE CASCADE,
    "unitId" INT REFERENCES "Units"("id") ON DELETE CASCADE,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "rentEscalationPercentage" DECIMAL(5, 2) DEFAULT 0.00,
    "securityDepositAmount" DECIMAL(10, 2) NOT NULL,
    "status" "LeaseStatus" NOT NULL DEFAULT 'Draft',
    "signatureUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 8. Invoices
CREATE TABLE "Invoices" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "tenantId" INT REFERENCES "Tenants"("id") ON DELETE CASCADE,
    "unitId" INT REFERENCES "Units"("id") ON DELETE CASCADE,
    "invoiceNumber" VARCHAR(100) UNIQUE NOT NULL,
    "date" DATE NOT NULL,
    "dueDate" DATE NOT NULL,
    "subTotal" DECIMAL(10, 2) NOT NULL,
    "taxAmount" DECIMAL(10, 2) DEFAULT 0.00,
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'Unpaid'
);

-- 9. Payments
CREATE TABLE "Payments" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "tenantId" INT REFERENCES "Tenants"("id") ON DELETE CASCADE,
    "amount" DECIMAL(10, 2) NOT NULL,
    "method" VARCHAR(50) NOT NULL DEFAULT 'MPESA',
    "transactionReference" VARCHAR(100) UNIQUE NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
    "date" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 10. Ledger Entries (Double-Entry Engine)
CREATE TABLE "ChartOfAccounts" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL -- Asset, Liability, Equity, Revenue, Expense
);

CREATE TABLE "JournalEntries" (
    "id" SERIAL PRIMARY KEY,
    "organizationId" INT REFERENCES "Organizations"("id") ON DELETE CASCADE,
    "reference" VARCHAR(100) NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT
);

CREATE TABLE "LedgerLines" (
    "id" SERIAL PRIMARY KEY,
    "journalEntryId" INT REFERENCES "JournalEntries"("id") ON DELETE CASCADE,
    "accountId" INT REFERENCES "ChartOfAccounts"("id"),
    "debit" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "credit" DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- 11. Maintenance Requests
CREATE TABLE "MaintenanceRequests" (
    "id" SERIAL PRIMARY KEY,
    "propertyId" INT REFERENCES "Properties"("id") ON DELETE CASCADE,
    "unitId" INT REFERENCES "Units"("id") ON DELETE CASCADE,
    "tenantId" INT REFERENCES "Tenants"("id") ON DELETE CASCADE,
    "priority" VARCHAR(50) NOT NULL DEFAULT 'Medium',
    "category" VARCHAR(100) NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'Open',
    "costAmount" DECIMAL(10, 2) DEFAULT 0.00,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 12. MPESA C2B/B2C Real-time Transactions Ledger
CREATE TABLE "MpesaTransactions" (
    "id" SERIAL PRIMARY KEY,
    "merchantRequestId" VARCHAR(100),
    "checkoutRequestId" VARCHAR(100),
    "phoneNumber" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "mpesaReceiptNumber" VARCHAR(100) UNIQUE,
    "status" "MpesaStatus" NOT NULL DEFAULT 'Pending',
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Core API Endpoints Specification

Deploy the ultimate set of secure APIs designed to service the front components:

```yaml
# API Specification Map
- /api/auth/login: [POST] Authentication gateway, returns signed Enterprise Context configuration.
- /api/properties:
    - [GET] Fetch organizations properties with cursor limits & page settings.
    - [POST] Create fully verified organization properties.
- /api/units:
    - [GET] Fetch property unit data with status matrices.
    - [POST] Create or bulk upload units.
- /api/tenants:
    - [GET] Listing active tenant portfolios, balances, and contact details.
    - [POST] Bulk registry or single tenant on-boarder.
- /api/leases:
    - [GET] Listing historic/active lease transactions.
    - [POST] Register a new lease lifecycle (Draft / Active) with rent escalate parameters.
    - [PUT] Lease status updates & terminations.
- /api/invoices:
    - [GET] System generated, un-paid, and overdue rent summaries.
    - [POST] Register manual billing occurrences onto tenant accounts.
- /api/payments:
    - [POST] Execute manual ledger matching or initiate an MPESA STK push session.
- /api/accounting:
    - [GET] Fetch dynamic Chart of Accounts, Profit & Loss sheets, and current Balance Sheets.
- /api/mpesa/c2b-webhook:
    - [POST] Real-time callback processor matching incoming Paybill payments with tenant portfolios.
```

---

## 8. Integrated Execution Plan (Phased Roadmap)

We will execute the implementation sequentially, keeping each code modification building perfectly:

1. **Phase A (Core Database Setup & Schema Support)**: Expand backend API nodes to mock and process complete relational models (Leases, Ledgers, Organizations).
2. **Phase B (Security Layer)**: Introduce secure controllers, strict parameters checking, and input validation bounds.
3. **Phase C (Lease Lifecycle Portal)**: Deploy Frontend Lease Managers with digital checklists, digital signature pads, and Move-In/Move-Out inspections.
4. **Phase D (Enterprise Ledger Accounting)**: Build the full general ledger view presenting chart of accounts, with real double-entry calculations.
5. **Phase E (Verification & Delivery)**: Run global compiler validation, resolving all package compilation scripts.

---
*Prepared by RealtyOS Enterprise Solutions Engineering Group.*
