package com.smartspend.dto;

public class BudgetAnalysisResponse {
    private  String category;
    private Double budgetAmount;
    private Double spendAmount;
    private Double remainingAmount;
    private Double percentageUsed;
    private String status;
    public BudgetAnalysisResponse(String category, Double budgetAmount, Double spendAmount, Double remainingAmount, Double percentageUsed, String status){
        this.category = category;
        this.budgetAmount = budgetAmount;
        this.spendAmount = spendAmount;
        this.remainingAmount = remainingAmount;
        this.percentageUsed = percentageUsed;
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public Double getBudgetAmount() {
        return budgetAmount;
    }

    public Double getSpendAmount() {
        return spendAmount;
    }

    public Double getRemainingAmount() {
        return remainingAmount;
    }

    public Double getPercentageUsed() {
        return percentageUsed;
    }

    public String getStatus() {
        return status;
    }
}
