package com.smartspend.dto;

public class InsightResponse {

    private double totalExpense;
    private double totalIncome;
    private double balance;
    private String topSpendingCategory;
    private double topCategoryAmount;
    private String insight;
    private String suggestion;

    public InsightResponse(
            double totalExpense,
            double totalIncome,
            double balance,
            String topSpendingCategory,
            double topCategoryAmount,
            String insight,
            String suggestion) {

        this.totalExpense = totalExpense;
        this.totalIncome = totalIncome;
        this.balance = balance;
        this.topSpendingCategory = topSpendingCategory;
        this.topCategoryAmount = topCategoryAmount;
        this.insight = insight;
        this.suggestion = suggestion;
    }

    public double getTotalExpense() {
        return totalExpense;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public double getBalance() {
        return balance;
    }

    public String getTopSpendingCategory() {
        return topSpendingCategory;
    }

    public double getTopCategoryAmount() {
        return topCategoryAmount;
    }

    public String getInsight() {
        return insight;
    }

    public String getSuggestion() {
        return suggestion;
    }
}