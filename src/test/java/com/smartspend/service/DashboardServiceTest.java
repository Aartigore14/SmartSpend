package com.smartspend.service;

import com.smartspend.dto.AnalyticsResponse;
import com.smartspend.dto.BudgetAnalysisResponse;
import com.smartspend.dto.DashboardResponse;
import com.smartspend.entity.Notification;
import com.smartspend.entity.SavingsGoal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private AnalyticsService analyticsService;

    @Mock
    private BudgetService budgetService;

    @Mock
    private SavingsGoalService savingsGoalService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private DashboardService dashboardService;

    private Long userId;

    @BeforeEach
    void setUp() {
        userId = 1L;
    }

    @Test
    void getDashboard_shouldReturnCorrectDashboardData() {

        AnalyticsResponse analytics = new AnalyticsResponse(
                50000.0,
                30000.0,
                20000.0,
                40.0,
                10
        );

        when(analyticsService.getUserAnalytics(userId))
                .thenReturn(analytics);

        when(analyticsService.getCategoryWiseExpenses(userId))
                .thenReturn(Map.of(
                        "Food", 12000.0,
                        "Travel", 5000.0,
                        "Shopping", 8000.0
                ));

        List<BudgetAnalysisResponse> budgets = List.of(
                new BudgetAnalysisResponse(
                        "Food",
                        15000.0,
                        12000.0,
                        3000.0,
                        80.0,
                        "WARNING"
                ),
                new BudgetAnalysisResponse(
                        "Travel",
                        10000.0,
                        12000.0,
                        -2000.0,
                        120.0,
                        "EXCEEDED"
                )
        );

        when(budgetService.getBudgetAnalysis(userId))
                .thenReturn(budgets);

        SavingsGoal activeGoal = new SavingsGoal();
        activeGoal.setStatus("ACTIVE");

        SavingsGoal completedGoal = new SavingsGoal();
        completedGoal.setStatus("COMPLETED");

        when(savingsGoalService.getSavingsGoalsByUser(userId))
                .thenReturn(List.of(activeGoal, completedGoal));

        Notification unreadNotification = new Notification();
        unreadNotification.setIsRead(false);

        Notification readNotification = new Notification();
        readNotification.setIsRead(true);

        when(notificationService.getNotificationsByUser(userId))
                .thenReturn(List.of(
                        unreadNotification,
                        readNotification
                ));

        DashboardResponse result =
                dashboardService.getDashboard(userId);

        assertEquals(50000.0, result.getTotalIncome());
        assertEquals(30000.0, result.getTotalExpense());
        assertEquals(20000.0, result.getBalance());
        assertEquals(40.0, result.getSavingsRate());
        assertEquals(10, result.getTotalTransactions());

        assertEquals("Food", result.getTopSpendingCategory());

        assertEquals(2, result.getActiveBudgets());
        assertEquals(1, result.getBudgetsExceeded());

        assertEquals(1, result.getActiveSavingsGoals());

        assertEquals(1, result.getUnreadNotifications());

        verify(analyticsService).getUserAnalytics(userId);
        verify(analyticsService).getCategoryWiseExpenses(userId);
        verify(budgetService).getBudgetAnalysis(userId);
        verify(savingsGoalService).getSavingsGoalsByUser(userId);
        verify(notificationService).getNotificationsByUser(userId);
    }

    @Test
    void getDashboard_shouldReturnNoneWhenNoCategoryExpensesExist() {

        AnalyticsResponse analytics = new AnalyticsResponse(
                50000.0,
                0.0,
                50000.0,
                100.0,
                2
        );

        when(analyticsService.getUserAnalytics(userId))
                .thenReturn(analytics);

        when(analyticsService.getCategoryWiseExpenses(userId))
                .thenReturn(Map.of());

        when(budgetService.getBudgetAnalysis(userId))
                .thenReturn(List.of());

        when(savingsGoalService.getSavingsGoalsByUser(userId))
                .thenReturn(List.of());

        when(notificationService.getNotificationsByUser(userId))
                .thenReturn(List.of());

        DashboardResponse result =
                dashboardService.getDashboard(userId);

        assertEquals("None", result.getTopSpendingCategory());
        assertEquals(0, result.getActiveBudgets());
        assertEquals(0, result.getBudgetsExceeded());
        assertEquals(0, result.getActiveSavingsGoals());
        assertEquals(0, result.getUnreadNotifications());
    }

    @Test
    void getDashboard_shouldCountOnlyExceededBudgets() {

        AnalyticsResponse analytics = new AnalyticsResponse(
                40000.0,
                25000.0,
                15000.0,
                37.5,
                8
        );

        when(analyticsService.getUserAnalytics(userId))
                .thenReturn(analytics);

        when(analyticsService.getCategoryWiseExpenses(userId))
                .thenReturn(Map.of("Food", 10000.0));

        List<BudgetAnalysisResponse> budgets = List.of(
                new BudgetAnalysisResponse(
                        "Food",
                        10000.0,
                        12000.0,
                        -2000.0,
                        120.0,
                        "EXCEEDED"
                ),
                new BudgetAnalysisResponse(
                        "Travel",
                        10000.0,
                        5000.0,
                        5000.0,
                        50.0,
                        "ON_TRACK"
                ),
                new BudgetAnalysisResponse(
                        "Shopping",
                        5000.0,
                        4500.0,
                        500.0,
                        90.0,
                        "WARNING"
                )
        );

        when(budgetService.getBudgetAnalysis(userId))
                .thenReturn(budgets);

        when(savingsGoalService.getSavingsGoalsByUser(userId))
                .thenReturn(List.of());

        when(notificationService.getNotificationsByUser(userId))
                .thenReturn(List.of());

        DashboardResponse result =
                dashboardService.getDashboard(userId);

        assertEquals(3, result.getActiveBudgets());
        assertEquals(1, result.getBudgetsExceeded());
    }

    @Test
    void getDashboard_shouldCountOnlyActiveSavingsGoalsAndUnreadNotifications() {

        AnalyticsResponse analytics = new AnalyticsResponse(
                30000.0,
                10000.0,
                20000.0,
                66.67,
                5
        );

        when(analyticsService.getUserAnalytics(userId))
                .thenReturn(analytics);

        when(analyticsService.getCategoryWiseExpenses(userId))
                .thenReturn(Map.of("Food", 5000.0));

        when(budgetService.getBudgetAnalysis(userId))
                .thenReturn(List.of());

        SavingsGoal activeGoal1 = new SavingsGoal();
        activeGoal1.setStatus("ACTIVE");

        SavingsGoal activeGoal2 = new SavingsGoal();
        activeGoal2.setStatus("ACTIVE");

        SavingsGoal completedGoal = new SavingsGoal();
        completedGoal.setStatus("COMPLETED");

        when(savingsGoalService.getSavingsGoalsByUser(userId))
                .thenReturn(List.of(
                        activeGoal1,
                        activeGoal2,
                        completedGoal
                ));

        Notification unread1 = new Notification();
        unread1.setIsRead(false);

        Notification unread2 = new Notification();
        unread2.setIsRead(false);

        Notification read = new Notification();
        read.setIsRead(true);

        when(notificationService.getNotificationsByUser(userId))
                .thenReturn(List.of(
                        unread1,
                        unread2,
                        read
                ));

        DashboardResponse result =
                dashboardService.getDashboard(userId);

        assertEquals(2, result.getActiveSavingsGoals());
        assertEquals(2, result.getUnreadNotifications());
    }
}