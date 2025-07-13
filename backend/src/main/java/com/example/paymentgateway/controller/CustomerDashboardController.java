package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/dashboard")
public class CustomerDashboardController {
    @GetMapping
    public ResponseEntity<?> getDashboardStats() {
        // TODO: Implement dashboard stats logic
        return ResponseEntity.ok("Customer dashboard stats");
    }
}
