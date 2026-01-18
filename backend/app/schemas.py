
from app.extensions import ma
from app.models import *
from marshmallow import fields

class PropertySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Property
        load_instance = True
    
    units = fields.Integer(attribute="units_count")
    imageUrl = fields.String(attribute="image_url")
    waterRate = fields.Float(attribute="water_rate")
    electricityRate = fields.Float(attribute="electricity_rate")
    streetName = fields.String(attribute="street_name")
    mpesaType = fields.String(attribute="mpesa_type")
    paybillNumber = fields.String(attribute="paybill_number")
    penaltyType = fields.String(attribute="penalty_type")
    taxRate = fields.Float(attribute="tax_rate")
    managementFeeType = fields.String(attribute="management_fee_type")
    companyName = fields.String(attribute="company_name")
    paymentInstructions = fields.String(attribute="payment_instructions")
    ownerPhone = fields.String(attribute="owner_phone")
    recurringBills = fields.Raw(attribute="recurring_bills") # JSON list

class PropertyGroupingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PropertyGrouping
        load_instance = True
    
    managerName = fields.String(attribute="manager_name")
    propertyIds = fields.Method("get_property_ids")

    def get_property_ids(self, obj):
        return [p.id for p in obj.properties]

class UnitSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Unit
        load_instance = True
        include_fk = True

    rentAmount = fields.Float(attribute="rent_amount")
    propertyId = fields.Integer(attribute="property_id")
    propertyName = fields.String(attribute="property_obj.name", dump_only=True)
    taxRate = fields.Float(attribute="tax_rate")
    recurringBills = fields.Raw(attribute="recurring_bills")

class TenantSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Tenant
        load_instance = True
        include_fk = True

    property = fields.String(attribute="property_obj.name", dump_only=True)
    unit = fields.String(attribute="unit_obj.name", dump_only=True)
    propertyId = fields.Integer(attribute="property_id")
    unitId = fields.Integer(attribute="unit_id")
    leaseEndDate = fields.String(attribute="lease_end_date")
    leaseStartDate = fields.String(attribute="lease_start_date")
    avatarUrl = fields.String(attribute="avatar_url")
    firstName = fields.String(attribute="first_name")
    lastName = fields.String(attribute="last_name")
    
    # Expanded fields
    depositType = fields.String(attribute="deposit_type")
    depositPaid = fields.Float(attribute="deposit_paid")
    depositReturned = fields.Float(attribute="deposit_returned")
    accountNumber = fields.String(attribute="account_number")
    nationalId = fields.String(attribute="national_id")
    kraPin = fields.String(attribute="kra_pin")
    penaltyType = fields.String(attribute="penalty_type")
    moveInDate = fields.String(attribute="move_in_date")
    moveOutDate = fields.String(attribute="move_out_date")
    
    # Nested JSON
    otherPhones = fields.Raw(attribute="other_phones")
    nextOfKin = fields.Raw(attribute="next_of_kin")
    bankPayers = fields.Raw(attribute="bank_payers")

class InvoiceItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = InvoiceItem
        load_instance = True

class InvoiceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Invoice
        load_instance = True

    invoiceNumber = fields.String(attribute="invoice_number")
    dueDate = fields.String(attribute="due_date")
    totalAmount = fields.Float(attribute="total_amount")
    tenantName = fields.String(attribute="tenant.name", dump_only=True)
    property = fields.String(attribute="tenant.property_obj.name", dump_only=True)
    unit = fields.String(attribute="tenant.unit_obj.name", dump_only=True)
    items = fields.Nested(InvoiceItemSchema, many=True)

class PaymentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        load_instance = True

    paymentId = fields.String(attribute="payment_id")
    tenantName = fields.String(attribute="tenant.name", dump_only=True)
    propertyName = fields.String(attribute="property_obj.name", dump_only=True)
    unitName = fields.String(attribute="unit_obj.name", dump_only=True)

class ExpenseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Expense
        load_instance = True

    property = fields.String(attribute="property_obj.name", dump_only=True)
    unit = fields.String(attribute="unit_obj.name", dump_only=True)

class RecurringExpenseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RecurringExpense
        load_instance = True

    property = fields.String(attribute="property_obj.name", dump_only=True)
    nextDueDate = fields.String(attribute="next_due_date")

class UtilitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Utility
        load_instance = True
    
    propertyName = fields.String(attribute="property_obj.name", dump_only=True)
    unitName = fields.String(attribute="unit_obj.name", dump_only=True)
    previousReading = fields.Float(attribute="previous_reading")
    currentReading = fields.Float(attribute="current_reading")

class MaintenanceRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MaintenanceRequest
        load_instance = True

    propertyName = fields.String(attribute="property_obj.name", dump_only=True)
    unitName = fields.String(attribute="unit_obj.name", dump_only=True)
    assignedTo = fields.String(attribute="assigned_to")

class MpesaTransactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MpesaTransaction
        load_instance = True
    
    tenant = fields.String(attribute="tenant_name_snapshot")

class MessageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Message
        load_instance = True
    
    recipientGroup = fields.String(attribute="recipient_group")
    property = fields.String(attribute="property_name")
    unit = fields.String(attribute="unit_name")

class BillingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Billing
        load_instance = True

class TeamMemberSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TeamMember
        load_instance = True

class AuditLogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = AuditLog
        load_instance = True
    
    fullName = fields.String(attribute="username")
    ipAddress = fields.String(attribute="ip_address")

class SystemSettingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SystemSetting
        load_instance = True

class FeedbackSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Feedback
        load_instance = True
    
    username = fields.String(attribute="user.name", dump_only=True)
    createdAt = fields.String(attribute="created_at")

class DocumentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
        load_instance = True
    
    tenantName = fields.String(attribute="tenant.name", dump_only=True)
    propertyName = fields.String(attribute="property_obj.name", dump_only=True)
    fileUrl = fields.String(attribute="file_url")
    uploadDate = fields.String(attribute="upload_date")
