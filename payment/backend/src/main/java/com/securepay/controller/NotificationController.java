package com.securepay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestParam String userId,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset) {

        List<Map<String, Object>> notifications = generateMockNotifications(userId, type, unreadOnly);
        
        // Apply pagination
        int start = Math.min(offset, notifications.size());
        int end = Math.min(offset + limit, notifications.size());
        List<Map<String, Object>> paginatedNotifications = notifications.subList(start, end);

        Map<String, Object> response = new HashMap<>();
        response.put("notifications", paginatedNotifications);
        response.put("total", notifications.size());
        response.put("unreadCount", notifications.stream().mapToInt(n -> (Boolean) n.get("read") ? 0 : 1).sum());
        response.put("hasMore", offset + limit < notifications.size());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNotification(
            @PathVariable String id,
            @RequestBody Map<String, Object> updateData) {

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification updated successfully");
        response.put("notificationId", id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@RequestParam String userId) {
        // In a real application, you would update the database here
        // For now, we'll just return a success response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "All notifications marked as read for user: " + userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, Object> notificationData) {
        Map<String, Object> newNotification = new HashMap<>();
        newNotification.put("id", "notif_" + System.currentTimeMillis());
        newNotification.putAll(notificationData);
        newNotification.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        newNotification.put("read", false);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification created successfully");
        response.put("notification", newNotification);

        return ResponseEntity.ok(response);
    }

    private List<Map<String, Object>> generateMockNotifications(String userId, String type, boolean unreadOnly) {
        List<Map<String, Object>> notifications = new ArrayList<>();

        // Base notifications
        Map<String, Object> notif1 = new HashMap<>();
        notif1.put("id", "notif_001");
        notif1.put("userId", userId);
        notif1.put("title", "Welcome to SecurePay");
        notif1.put("message", "Your account has been successfully created and verified.");
        notif1.put("type", "success");
        notif1.put("read", false);
        notif1.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        notifications.add(notif1);

        Map<String, Object> notif2 = new HashMap<>();
        notif2.put("id", "notif_002");
        notif2.put("userId", userId);
        notif2.put("title", "Security Alert");
        notif2.put("message", "New login detected from a different device.");
        notif2.put("type", "warning");
        notif2.put("read", false);
        notif2.put("timestamp", LocalDateTime.now().minusHours(1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        notifications.add(notif2);

        Map<String, Object> notif3 = new HashMap<>();
        notif3.put("id", "notif_003");
        notif3.put("userId", userId);
        notif3.put("title", "Payment Processed");
        notif3.put("message", "Your payment of $150.00 has been successfully processed.");
        notif3.put("type", "success");
        notif3.put("read", true);
        notif3.put("timestamp", LocalDateTime.now().minusHours(2).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        notifications.add(notif3);

        // Filter by type if specified
        if (type != null) {
            notifications = notifications.stream()
                    .filter(n -> type.equals(n.get("type")))
                    .collect(ArrayList::new, (list, item) -> list.add(item), ArrayList::addAll);
        }

        // Filter by read status if unreadOnly is true
        if (unreadOnly) {
            notifications = notifications.stream()
                    .filter(n -> !(Boolean) n.get("read"))
                    .collect(ArrayList::new, (list, item) -> list.add(item), ArrayList::addAll);
        }

        return notifications;
    }
}
