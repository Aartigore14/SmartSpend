package com.smartspend.service;

import com.smartspend.entity.Notification;
import com.smartspend.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Create notification
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Get all notifications for a user
    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // Get notification by ID
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Notification not found"
                        ));
    }

    // Mark notification as read
    public Notification markAsRead(Long id) {
        Notification notification = getNotificationById(id);
        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }

    // Mark all notifications as read for a user
    public void markAllAsRead(Long userId) {
        List<Notification> notifications =
                notificationRepository.findByUserId(userId);

        for (Notification notification : notifications) {
            notification.setIsRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    // Delete notification
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Notification not found"
            );
        }

        notificationRepository.deleteById(id);
    }
}