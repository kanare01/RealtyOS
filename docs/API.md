
# RealtyOS API Documentation

## Authentication & Users
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | Authenticate and retrieve JWT token. | Public |
| `POST` | `/api/auth/register` | Register a new admin (Rate limited). | Public |
| `GET` | `/api/auth/me` | Get current user profile. | User |
| `PUT` | `/api/auth/me` | Update current user profile. | User |
| `POST` | `/api/auth/change-password` | Change current user's password. | User |
| `GET` | `/api/team-members` | List all team members. | Admin |
| `POST` | `/api/team-members` | Create a new team member. | Admin |

## Properties & Units
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/properties` | List all properties. | User |
| `POST` | `/api/properties` | Create a new property. | Manager |
| `PUT` | `/api/properties/<id>` | Update property details. | Manager |
| `DELETE` | `/api/properties/<id>` | Delete a property. | Admin |
| `GET` | `/api/units` | List all units. | User |
| `POST` | `/api/units` | Create units (Single or Bulk). | Manager |

## Tenants
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tenants` | List all tenants. | User |
| `POST` | `/api/tenants` | Add a new tenant (or Bulk import). | User |
| `PUT` | `/api/tenants/<id>` | Update tenant details (move-out, etc). | User |
| `DELETE` | `/api/tenants/<id>` | Delete/Archive a tenant. | Manager |

## Financials
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/invoices` | List invoices. | User |
| `POST` | `/api/invoices` | Create an invoice. | User |
| `GET` | `/api/payments` | List payments. | User |
| `POST` | `/api/payments` | Record a manual payment. | User |
| `POST` | `/api/mpesa/stkpush` | Trigger MPESA STK Push. | User |
| `POST` | `/api/mpesa/simulate-callback` | Simulate MPESA IPN (Dev). | Public |
| `GET` | `/api/reports/financials/monthly` | Get monthly revenue stats. | User |

## Operations
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/maintenance` | List maintenance requests. | User |
| `POST` | `/api/maintenance` | Create maintenance request. | User |
| `POST` | `/api/messages/send` | Send SMS/Email to tenants. | User |
| `POST` | `/api/files/upload` | Upload document/receipt. | User |

## System & Maintenance
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/system/status` | Check DB and Scheduler health. | Admin |
| `POST` | `/api/system/maintenance` | Trigger maintenance (prune logs). | Admin |
| `GET` | `/api/audit-logs` | View system activity logs. | Admin |
| `GET` | `/api/feedback` | View user feedback. | Admin |
| `POST` | `/api/feedback` | Submit user feedback. | User |
