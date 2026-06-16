from flask import Blueprint, jsonify
from backend.models.property import Property
from backend.models.unit import Unit
from backend.models.tenant import Tenant
from backend.models.financial import Invoice, Payment, Expense, RecurringExpense
from backend.models.operations import Maintenance, Settings

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/data', methods=['GET'])
def get_all_data():
    try:
        properties = Property.get_all()
        units = Unit.get_all()
        tenants = Tenant.get_all()
        expenses = Expense.get_all()
        recurringExpenses = RecurringExpense.get_all()
        invoices = Invoice.get_all()
        payments = Payment.get_all()
        maintenance = Maintenance.get_all()
        settings_dict = Settings.get_global()

        return jsonify({
            "properties": properties,
            "units": units,
            "tenants": tenants,
            "expenses": expenses,
            "recurringExpenses": recurringExpenses,
            "invoices": invoices,
            "payments": payments,
            "maintenance": maintenance,
            "settings": settings_dict
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        tenants = Tenant.get_all() or []
        totalArrears = 0
        tenantsArrearsCount = 0
        totalAdvance = 0
        tenantsAdvanceCount = 0

        for t in tenants:
            bal = t.get("balance") or 0
            if bal > 0:
                totalArrears += bal
                tenantsArrearsCount += 1
            elif bal < 0:
                totalAdvance += abs(bal)
                tenantsAdvanceCount += 1

        units = Unit.get_all() or []
        totalUnitsCount = len(units)
        occupiedUnitsCount = len([u for u in units if u.get("status") == 'Occupied'])

        occupancyRate = 0
        if totalUnitsCount > 0:
            occupancyRate = round((occupiedUnitsCount / totalUnitsCount) * 100, 1)

        return jsonify({
            "totalArrears": totalArrears,
            "tenantsArrearsCount": tenantsArrearsCount,
            "totalAdvance": totalAdvance,
            "tenantsAdvanceCount": tenantsAdvanceCount,
            "occupancyRate": occupancyRate,
            "totalUnits": totalUnitsCount,
            "occupiedUnits": occupiedUnitsCount
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
