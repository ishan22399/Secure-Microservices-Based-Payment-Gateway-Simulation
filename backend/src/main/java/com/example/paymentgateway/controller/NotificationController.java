package com.example.paymentgateway.controller;

import com.example.paymentgateway.model.Notification;
import com.example.paymentgateway.service.NotificationService;
import com.example.paymentgateway.service.UserService;
import com.example.paymentgateway.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> sendNotification(@RequestBody String message, Principal principal) {
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Notification notification = notificationService.sendNotification(user.getUsername(), message);
        return ResponseEntity.ok(notification);
    }

    @GetMapping
    public ResponseEntity<?> getUserNotifications(Principal principal) {
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        List<Notification> notifications = notificationService.getUserNotifications(user.getUsername());
        return ResponseEntity.ok(notifications);
    }
}
