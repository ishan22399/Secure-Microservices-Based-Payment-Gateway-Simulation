package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/customer/dashboard")
public class CustomerDashboardController {
    @GetMapping
    public ResponseEntity<?> getDashboardStats() {
        // Mock dashboard stats data
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTransactions", 42);
        stats.put("totalAmount", 12345.67);
        stats.put("pendingPayments", 3);
        stats.put("successfulPayments", 39);
        stats.put("failedPayments", 0);
        stats.put("lastLogin", "2025-07-15T10:00:00Z");
        return ResponseEntity.ok(stats);
    }
}
