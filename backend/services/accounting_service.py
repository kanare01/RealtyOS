import json
from backend.models.financial import ChartOfAccount, JournalEntry

class AccountingService:
    @staticmethod
    def adjust_chart_balances(lines):
        """Update account portfolios based on lines of a journal entry."""
        for line in lines:
            code = line.get("accountCode")
            debit = float(line.get("debit", 0))
            credit = float(line.get("credit", 0))

            coa = ChartOfAccount.get_by_code(code)
            if not coa:
                raise ValueError(f"Chart of account code {code} does not exist inside organization portfolio")

            # Assets and Expenses increase on Debit, decrease on Credit.
            # Liabilities, Equities, and Revenues increase on Credit, decrease on Debit.
            if coa["type"] in ["Asset", "Expense"]:
                ChartOfAccount.update_balance(code, debit - credit, is_asset_or_expense=True)
            else:
                ChartOfAccount.update_balance(code, credit - debit, is_asset_or_expense=False)

    @classmethod
    def record_manual_accrual(cls, je_id, date, reference, description, lines):
        # Assertions
        total_debit = sum(float(l.get("debit", 0)) for l in lines)
        total_credit = sum(float(l.get("credit", 0)) for l in lines)

        if abs(total_debit - total_credit) > 0.01:
            raise ValueError(f"Double-entry unbalance error. Total Debits (KES {total_debit}) must precisely match Total Credits (KES {total_credit})")

        # Perform balance modifications
        cls.adjust_chart_balances(lines)

        # Create the journal record
        return JournalEntry.create(je_id, date, reference, description, lines)
