package com.smartspend.service;

import com.smartspend.dto.BudgetAnalysisResponse;
import com.smartspend.entity.Notification;
import com.smartspend.repository.BudgetRepository;
import com.smartspend.repository.CategoryRepository;
import com.smartspend.repository.NotificationRepository;
import com.smartspend.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private BudgetService budgetService;

    @Test
    void generateBudgetAlerts_shouldCreateWarningNotification() {

        BudgetAnalysisResponse analysis =
                new BudgetAnalysisResponse(
                        "Food",
                        5500.0,
                        4500.0,
                        1000.0,
                        81.81,
                        "WARNING"
                );

        BudgetService spyService = spy(budgetService);

        doReturn(List.of(analysis))
                .when(spyService)
                .getBudgetAnalysis(1L);

        spyService.generateBudgetAlerts(1L);

        ArgumentCaptor<Notification> captor =
                ArgumentCaptor.forClass(Notification.class);

        verify(notificationRepository).save(captor.capture());

        Notification notification = captor.getValue();

        assertEquals(1L, notification.getUserId());
        assertEquals("Budget Warning", notification.getTitle());
        assertEquals("BUDGET_WARNING", notification.getType());
        assertFalse(notification.getIsRead());

        assertTrue(
                notification.getMessage().contains("82%")
        );
    }

    @Test
    void generateBudgetAlerts_shouldCreateExceededNotification() {

        BudgetAnalysisResponse analysis =
                new BudgetAnalysisResponse(
                        "Food",
                        5500.0,
                        6000.0,
                        -500.0,
                        109.09,
                        "EXCEEDED"
                );

        BudgetService spyService = spy(budgetService);

        doReturn(List.of(analysis))
                .when(spyService)
                .getBudgetAnalysis(1L);

        spyService.generateBudgetAlerts(1L);

        ArgumentCaptor<Notification> captor =
                ArgumentCaptor.forClass(Notification.class);

        verify(notificationRepository).save(captor.capture());

        Notification notification = captor.getValue();

        assertEquals(1L, notification.getUserId());
        assertEquals("Budget Exceeded", notification.getTitle());
        assertEquals("BUDGET_EXCEEDED", notification.getType());
        assertFalse(notification.getIsRead());

        assertTrue(
                notification.getMessage().contains("Food")
        );
    }

    @Test
    void generateBudgetAlerts_shouldNotCreateNotificationWhenOnTrack() {

        BudgetAnalysisResponse analysis =
                new BudgetAnalysisResponse(
                        "Food",
                        5500.0,
                        2000.0,
                        3500.0,
                        36.36,
                        "ON_TRACK"
                );

        BudgetService spyService = spy(budgetService);

        doReturn(List.of(analysis))
                .when(spyService)
                .getBudgetAnalysis(1L);

        spyService.generateBudgetAlerts(1L);

        verify(notificationRepository, never()).save(any(Notification.class));
    }
    @Test
    void generateBudgetAlerts_shouldNotCreateDuplicateWarning() {

        BudgetAnalysisResponse analysis =
                new BudgetAnalysisResponse(
                        "Food",
                        5500.0,
                        4500.0,
                        1000.0,
                        81.81,
                        "WARNING"
                );

        Notification existingNotification = new Notification();
        existingNotification.setUserId(1L);
        existingNotification.setTitle("Budget Warning");
        existingNotification.setMessage(
                "You have used 82% of your Food budget."
        );
        existingNotification.setType("BUDGET_WARNING");
        existingNotification.setIsRead(false);

        when(notificationRepository.findByUserId(1L))
                .thenReturn(List.of(existingNotification));

        BudgetService spyService = spy(budgetService);

        doReturn(List.of(analysis))
                .when(spyService)
                .getBudgetAnalysis(1L);

        spyService.generateBudgetAlerts(1L);

        verify(notificationRepository, never())
                .save(any(Notification.class));
    }
}