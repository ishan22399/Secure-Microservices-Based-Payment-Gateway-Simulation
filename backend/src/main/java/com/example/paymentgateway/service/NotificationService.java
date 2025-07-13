package com.example.paymentgateway.service;

import com.example.paymentgateway.model.Notification;
import com.example.paymentgateway.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(String username, String message) {
        Notification notification = new Notification();
        notification.setUsername(username);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String username) {
        return notificationRepository.findByUsername(username);
    }
}
