package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment-links")
public class PaymentLinkController {
    @PostMapping
    public ResponseEntity<?> createPaymentLink(@RequestBody Object request) {
        // TODO: Implement create payment link
        return ResponseEntity.ok("Payment link created");
    }

    @GetMapping
    public ResponseEntity<?> listPaymentLinks() {
        // TODO: Implement list payment links
        return ResponseEntity.ok("List of payment links");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentLink(@PathVariable String id) {
        // TODO: Implement get payment link
        return ResponseEntity.ok("Payment link details for " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePaymentLink(@PathVariable String id, @RequestBody Object request) {
        // TODO: Implement update payment link
        return ResponseEntity.ok("Payment link updated for " + id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentLink(@PathVariable String id) {
        // TODO: Implement delete payment link
        return ResponseEntity.ok("Payment link deleted for " + id);
    }
}
