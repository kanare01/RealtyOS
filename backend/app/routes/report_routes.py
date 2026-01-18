
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services import ReportService

report_bp = Blueprint('reports', __name__)

@report_bp.route('/financials/monthly', methods=['GET'])
@jwt_required()
def monthly_financials():
    year = request.args.get('year', default=None, type=int)
    data = ReportService.get_monthly_financials(year)
    return jsonify(data)
