package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping
    public ResponseEntity<?> initiatePayment(@RequestBody PaymentRequest request) {
        // Mock: pretend to initiate payment
        String paymentId = java.util.UUID.randomUUID().toString();
        System.out.println("[DEBUG] Payment initiated for: " + request.getAmount() + " by " + request.getPayer());
        PaymentResponse response = new PaymentResponse(paymentId, "PENDING", request.getAmount(), request.getPayer(), request.getPayee());
        // In real implementation, save payment and start processing
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String id) {
        // Mock: pretend to fetch payment status
        System.out.println("[DEBUG] Fetching payment status for: " + id);
        // In real implementation, fetch payment from DB
        PaymentResponse response = new PaymentResponse(id, "PENDING", 100.0, "payer@example.com", "payee@example.com");
        return ResponseEntity.ok(response);
    }

    // DTOs for request/response
    public static class PaymentRequest {
        private double amount;
        private String payer;
        private String payee;
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getPayer() { return payer; }
        public void setPayer(String payer) { this.payer = payer; }
        public String getPayee() { return payee; }
        public void setPayee(String payee) { this.payee = payee; }
    }

    public static class PaymentResponse {
        private String paymentId;
        private String status;
        private double amount;
        private String payer;
        private String payee;
        public PaymentResponse(String paymentId, String status, double amount, String payer, String payee) {
            this.paymentId = paymentId;
            this.status = status;
            this.amount = amount;
            this.payer = payer;
            this.payee = payee;
        }
        public String getPaymentId() { return paymentId; }
        public String getStatus() { return status; }
        public double getAmount() { return amount; }
        public String getPayer() { return payer; }
        public String getPayee() { return payee; }
    }
}
