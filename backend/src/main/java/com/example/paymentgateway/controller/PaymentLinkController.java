package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment-links")
public class PaymentLinkController {

    private final java.util.Map<String, PaymentLink> paymentLinks = new java.util.HashMap<>();

    @PostMapping
    public ResponseEntity<?> createPaymentLink(@RequestBody PaymentLinkRequest request) {
        String id = java.util.UUID.randomUUID().toString();
        PaymentLink link = new PaymentLink(id, request.getAmount(), request.getDescription(), "ACTIVE");
        paymentLinks.put(id, link);
        return ResponseEntity.ok(link);
    }

    @GetMapping
    public ResponseEntity<?> listPaymentLinks() {
        return ResponseEntity.ok(new java.util.ArrayList<>(paymentLinks.values()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentLink(@PathVariable String id) {
        PaymentLink link = paymentLinks.get(id);
        if (link == null) {
            return ResponseEntity.status(404).body(java.util.Map.of("error", "Payment link not found"));
        }
        return ResponseEntity.ok(link);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePaymentLink(@PathVariable String id, @RequestBody PaymentLinkRequest request) {
        PaymentLink link = paymentLinks.get(id);
        if (link == null) {
            return ResponseEntity.status(404).body(java.util.Map.of("error", "Payment link not found"));
        }
        link.setAmount(request.getAmount());
        link.setDescription(request.getDescription());
        return ResponseEntity.ok(link);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentLink(@PathVariable String id) {
        PaymentLink removed = paymentLinks.remove(id);
        if (removed == null) {
            return ResponseEntity.status(404).body(java.util.Map.of("error", "Payment link not found"));
        }
        return ResponseEntity.ok(java.util.Map.of("message", "Payment link deleted", "id", id));
    }

    // DTOs for request/response
    public static class PaymentLinkRequest {
        private double amount;
        private String description;
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class PaymentLink {
        private String id;
        private double amount;
        private String description;
        private String status;
        public PaymentLink(String id, double amount, String description, String status) {
            this.id = id;
            this.amount = amount;
            this.description = description;
            this.status = status;
        }
        public String getId() { return id; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
