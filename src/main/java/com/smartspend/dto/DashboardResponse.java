package com.smartspend.dto;

public class DashboardResponse {
    private double totalIncome;
    private double totalExpense;
    private double balance;
    private double savingRate;
    private int totalTransactions;
    private String topSpendingCategory;
    private int activeBudget;
    private int budgetsExceeded;
    private int activeSavingsGoals;
    private int unreadNotification;
    public DashboardResponse( double totalIncome, double totalExpense, double balance, double savingRate, int totalTransactions, String topSpendingCategory, int activeBudget, int budgetsExceeded, int activeSavingsGoals, int unreadNotification){
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.savingRate = savingRate;
        this.totalTransactions = totalTransactions;
        this.topSpendingCategory = topSpendingCategory;
        this.activeBudget = activeBudget;
        this.budgetsExceeded = budgetsExceeded;
        this.activeSavingsGoals = activeSavingsGoals;
        this.unreadNotification = unreadNotification;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public double getBalance() {
        return balance;
    }

    public double getTotalExpense() {
        return totalExpense;
    }

    public double getSavingRate() {
        return savingRate;
    }

    public int getTotalTransactions() {
        return totalTransactions;
    }

    public String getTopSpendingCategory() {
        return topSpendingCategory;
    }

    public int getActiveBudget() {
        return activeBudget;
    }

    public int getBudgetsExceeded() {
        return budgetsExceeded;
    }

    public int getActiveSavingsGoals() {
        return activeSavingsGoals;
    }

    public int getUnreadNotifications() {
        return unreadNotification;
    }
    public double getSavingsRate(){
        return savingRate;
    }
    public int getActiveBudgets(){
        return activeBudget;
    }
}
