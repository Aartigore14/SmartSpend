package com.smartspend.service;
import com.smartspend.dto.AnalyticsResponse;
import com.smartspend.dto.DashboardResponse;
import com.smartspend.dto.BudgetAnalysisResponse;
import com.smartspend.entity.Notification;
import com.smartspend.entity.SavingsGoal;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
@Service
public class DashboardService {
    private final AnalyticsService analyticsService;
    private final BudgetService budgetService;
    private final SavingsGoalService savingsGoalService;
    private final NotificationService notificationService;

    public DashboardService(AnalyticsService analyticsService, BudgetService budgetService, SavingsGoalService savingsGoalService, NotificationService notificationService){
        this.analyticsService = analyticsService;
        this.budgetService = budgetService;
        this.savingsGoalService = savingsGoalService;
        this.notificationService = notificationService;
    }
    public DashboardResponse getDashboard(Long userId){
        AnalyticsResponse analytics = analyticsService.getUserAnalytics(userId);
        // Get category-wise expenses
        Map<String, Double> categoryExpenses =
                analyticsService.getCategoryWiseExpenses(userId);

        String topSpendingCategory = "None";

        if (!categoryExpenses.isEmpty()) {
            topSpendingCategory =
                    categoryExpenses.entrySet()
                            .stream()
                            .max(Map.Entry.comparingByValue())
                            .map(Map.Entry::getKey)
                            .orElse("None");
        }

        // Get budget analysis
        List<BudgetAnalysisResponse> budgetAnalysis =
                budgetService.getBudgetAnalysis(userId);

        int activeBudgets = budgetAnalysis.size();

        int budgetsExceeded = (int) budgetAnalysis.stream()
                .filter(budget ->
                        "EXCEEDED".equalsIgnoreCase(budget.getStatus()))
                .count();

        // Get savings goals
        List<SavingsGoal> savingsGoals =
                savingsGoalService.getSavingsGoalsByUser(userId);

        int activeSavingsGoals = (int) savingsGoals.stream()
                .filter(goal ->
                        !"COMPLETED".equalsIgnoreCase(goal.getStatus()))
                .count();

        // Get notifications
        List<Notification> notifications =
                notificationService.getNotificationsByUser(userId);

        int unreadNotifications = (int) notifications.stream()
                .filter(notification ->
                        !Boolean.TRUE.equals(notification.getIsRead()))
                .count();

        return new DashboardResponse(
                analytics.getTotalIncome(),
                analytics.getTotalExpense(),
                analytics.getBalance(),
                analytics.getSavingsRate(),
                analytics.getTotalTransactions(),
                topSpendingCategory,
                activeBudgets,
                budgetsExceeded,
                activeSavingsGoals,
                unreadNotifications
        );
    }
}
