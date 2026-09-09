package com.smartspend.controller;

import com.smartspend.entity.Notification;
import com.smartspend.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    private MockMvc mockMvc;
    private Notification notification;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(notificationController)
                .build();

        notification = new Notification();
        notification.setId(1L);
        notification.setUserId(1L);
        notification.setTitle("Budget Warning");
        notification.setMessage("You have used 80% of your Food budget.");
        notification.setType("BUDGET_WARNING");
        notification.setIsRead(false);
    }

    @Test
    void createNotification_shouldReturnCreatedNotification() throws Exception {

        when(notificationService.createNotification(any(Notification.class)))
                .thenReturn(notification);

        String requestBody = """
                {
                    "userId": 1,
                    "title": "Budget Warning",
                    "message": "You have used 80% of your Food budget.",
                    "type": "BUDGET_WARNING",
                    "isRead": false
                }
                """;

        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Budget Warning"))
                .andExpect(jsonPath("$.type").value("BUDGET_WARNING"));

        verify(notificationService).createNotification(any(Notification.class));
    }

    @Test
    void getNotificationsByUser_shouldReturnNotifications() throws Exception {

        when(notificationService.getNotificationsByUser(1L))
                .thenReturn(List.of(notification));

        mockMvc.perform(get("/api/notifications/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Budget Warning"));

        verify(notificationService).getNotificationsByUser(1L);
    }

    @Test
    void getNotificationById_shouldReturnNotification() throws Exception {

        when(notificationService.getNotificationById(1L))
                .thenReturn(notification);

        mockMvc.perform(get("/api/notifications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1));

        verify(notificationService).getNotificationById(1L);
    }

    @Test
    void markAsRead_shouldReturnUpdatedNotification() throws Exception {

        notification.setIsRead(true);

        when(notificationService.markAsRead(1L))
                .thenReturn(notification);

        mockMvc.perform(put("/api/notifications/1/read"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isRead").value(true));

        verify(notificationService).markAsRead(1L);
    }

    @Test
    void markAllAsRead_shouldReturnNoContent() throws Exception {

        doNothing().when(notificationService).markAllAsRead(1L);

        mockMvc.perform(put("/api/notifications/user/1/read-all"))
                .andExpect(status().isNoContent());

        verify(notificationService).markAllAsRead(1L);
    }

    @Test
    void deleteNotification_shouldReturnNoContent() throws Exception {

        doNothing().when(notificationService).deleteNotification(1L);

        mockMvc.perform(delete("/api/notifications/1"))
                .andExpect(status().isNoContent());

        verify(notificationService).deleteNotification(1L);
    }
}