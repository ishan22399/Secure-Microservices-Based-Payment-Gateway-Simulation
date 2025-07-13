package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @PostMapping
    public ResponseEntity<?> initiatePayment(@RequestBody Object request) {
        // TODO: Implement payment initiation logic
        return ResponseEntity.ok("Payment initiated");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String id) {
        // TODO: Implement payment status logic
        return ResponseEntity.ok("Payment status for " + id);
    }
}
