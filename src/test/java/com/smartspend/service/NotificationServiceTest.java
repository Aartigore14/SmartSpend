package com.smartspend.service;

import com.smartspend.entity.Notification;
import com.smartspend.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private Notification notification;

    @BeforeEach
    void setUp() {
        notification = new Notification();
        notification.setId(1L);
        notification.setUserId(1L);
        notification.setTitle("Budget Warning");
        notification.setMessage("You have used 80% of your Food budget.");
        notification.setType("BUDGET_WARNING");
        notification.setIsRead(false);
    }

    @Test
    void createNotification_shouldSaveNotification() {

        when(notificationRepository.save(notification))
                .thenReturn(notification);

        Notification result =
                notificationService.createNotification(notification);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Budget Warning", result.getTitle());

        verify(notificationRepository).save(notification);
    }

    @Test
    void getNotificationsByUser_shouldReturnUserNotifications() {

        when(notificationRepository.findByUserId(1L))
                .thenReturn(List.of(notification));

        List<Notification> result =
                notificationService.getNotificationsByUser(1L);

        assertEquals(1, result.size());
        assertEquals("Budget Warning", result.get(0).getTitle());

        verify(notificationRepository).findByUserId(1L);
    }

    @Test
    void getNotificationById_shouldReturnNotification() {

        when(notificationRepository.findById(1L))
                .thenReturn(Optional.of(notification));

        Notification result =
                notificationService.getNotificationById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(notificationRepository).findById(1L);
    }

    @Test
    void getNotificationById_shouldThrowExceptionWhenNotFound() {

        when(notificationRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResponseStatusException.class,
                () -> notificationService.getNotificationById(99L)
        );

        verify(notificationRepository).findById(99L);
    }

    @Test
    void markAsRead_shouldMarkNotificationAsRead() {

        notification.setIsRead(false);

        when(notificationRepository.findById(1L))
                .thenReturn(Optional.of(notification));

        when(notificationRepository.save(notification))
                .thenReturn(notification);

        Notification result =
                notificationService.markAsRead(1L);

        assertTrue(result.getIsRead());

        verify(notificationRepository).findById(1L);
        verify(notificationRepository).save(notification);
    }

    @Test
    void markAllAsRead_shouldMarkAllUserNotificationsAsRead() {

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setUserId(1L);
        notification2.setTitle("Savings Goal");
        notification2.setMessage("You are making good progress.");
        notification2.setType("SAVINGS_GOAL");
        notification2.setIsRead(false);

        when(notificationRepository.findByUserId(1L))
                .thenReturn(List.of(notification, notification2));

        notificationService.markAllAsRead(1L);

        assertTrue(notification.getIsRead());
        assertTrue(notification2.getIsRead());

        verify(notificationRepository).findByUserId(1L);
        verify(notificationRepository).saveAll(
                List.of(notification, notification2)
        );
    }

    @Test
    void deleteNotification_shouldDeleteExistingNotification() {

        when(notificationRepository.existsById(1L))
                .thenReturn(true);

        notificationService.deleteNotification(1L);

        verify(notificationRepository).existsById(1L);
        verify(notificationRepository).deleteById(1L);
    }

    @Test
    void deleteNotification_shouldThrowExceptionWhenNotFound() {

        when(notificationRepository.existsById(99L))
                .thenReturn(false);

        assertThrows(
                ResponseStatusException.class,
                () -> notificationService.deleteNotification(99L)
        );

        verify(notificationRepository).existsById(99L);
        verify(notificationRepository, never()).deleteById(99L);
    }
}