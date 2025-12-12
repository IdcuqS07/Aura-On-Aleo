
@router.post("/assess-public")
async def assess_risk_public(request: RiskAssessmentRequest):
    """Public risk assessment (no API key required)"""
    try:
        from ai_risk_oracle import AIRiskOracle
        oracle = AIRiskOracle()
        result = await oracle.assess_risk(request.wallet_address)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
