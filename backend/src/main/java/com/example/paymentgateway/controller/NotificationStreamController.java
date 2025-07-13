package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationStreamController {
    @GetMapping("/stream")
    public ResponseEntity<?> streamNotifications() {
        // TODO: Implement WebSocket/SSE logic
        return ResponseEntity.ok("Notification stream endpoint");
    }
}
