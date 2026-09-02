package com.smartspend.dto;

public class AnalyticsResponse {

    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private Double savingsRate;
    private Integer totalTransactions;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(
            Double totalIncome,
            Double totalExpense,
            Double balance,
            Double savingsRate,
            Integer totalTransactions) {

        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.savingsRate = savingsRate;
        this.totalTransactions = totalTransactions;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(Double savingsRate) {
        this.savingsRate = savingsRate;
    }

    public Integer getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Integer totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
}