
from app import create_app, db
from app.models import Property, Unit, Tenant, RecurringExpense, TeamMember, Invoice, InvoiceItem, Payment
from datetime import datetime, timedelta
import random

app = create_app()

def seed_staging_data():
    with app.app_context():
        print("🌱 Seeding Staging Data...")
        
        # 1. Clear existing data (Optional: comment out if you want to append)
        db.drop_all()
        db.create_all()

        # 2. Create Admin User
        admin = TeamMember(name="System Admin", email="admin@realtyos.com", username="admin", role="Admin")
        admin.set_password("admin123")
        db.session.add(admin)

        # 3. Create Properties
        props = []
        for i in range(1, 4):
            p = Property(
                name=f"Staging Heights {i}",
                address=f"{i * 10} Staging Blvd, Nairobi",
                city="Nairobi",
                type="Residential",
                units_count=10,
                water_rate=150,
                electricity_rate=25
            )
            db.session.add(p)
            props.append(p)
        db.session.commit()

        # 4. Create Units & Tenants
        unit_categories = ["1 Bedroom", "2 Bedroom", "Studio"]
        for prop in props:
            for u_num in range(1, 11):
                cat = random.choice(unit_categories)
                rent = 15000 if cat == "1 Bedroom" else 25000 if cat == "2 Bedroom" else 10000
                
                unit = Unit(
                    name=f"H{prop.id}-{u_num:02d}",
                    rent_amount=rent,
                    property_id=prop.id,
                    category=cat,
                    status="Vacant"
                )
                db.session.add(unit)
                db.session.commit() # Commit to get ID

                # Occupy 70% of units
                if random.random() > 0.3:
                    tenant = Tenant(
                        name=f"Tenant {unit.name}",
                        first_name="John",
                        last_name=f"Doe {unit.name}",
                        email=f"tenant{unit.id}@test.com",
                        phone=f"+254700{unit.id:06d}",
                        property_id=prop.id,
                        unit_id=unit.id,
                        balance=0,
                        status="Active",
                        lease_start_date="2023-01-01",
                        lease_end_date=(datetime.now() + timedelta(days=random.randint(-5, 60))).strftime('%Y-%m-%d')
                    )
                    unit.status = "Occupied"
                    db.session.add(tenant)
                    
                    # Create some history (Invoice & Payment)
                    inv = Invoice(
                        invoice_number=f"INV-STG-{unit.id}",
                        date=datetime.now().strftime('%Y-%m-01'),
                        due_date=datetime.now().strftime('%Y-%m-05'),
                        total_amount=rent,
                        status="Paid",
                        tenant_id=tenant.id,
                        property_id=prop.id,
                        unit_id=unit.id
                    )
                    db.session.add(inv)
                    
                    pay = Payment(
                        payment_id=f"PAY-STG-{unit.id}",
                        date=datetime.now().strftime('%Y-%m-02'),
                        amount=rent,
                        method="Mpesa",
                        status="confirmed",
                        tenant_id=tenant.id,
                        property_id=prop.id,
                        unit_id=unit.id
                    )
                    db.session.add(pay)

        # 5. Create Recurring Expenses (Due Today for testing)
        today = datetime.now().strftime('%Y-%m-%d')
        rec_exp = RecurringExpense(
            description="Garbage Collection (Staging)",
            amount=2500,
            frequency="Monthly",
            next_due_date=today, # Critical for testing scheduler
            category="Utilities",
            property_id=props[0].id,
            status="Active"
        )
        db.session.add(rec_exp)

        db.session.commit()
        print("✅ Staging Data Seeded Successfully.")
        print("👉 Admin Login: admin@realtyos.com / admin123")
        print("👉 Recurring Expense created due TODAY to test scheduler.")

if __name__ == "__main__":
    seed_staging_data()
