package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionExportController {
    @GetMapping("/export")
    public ResponseEntity<?> exportTransactions() {
        // TODO: Implement export logic
        return ResponseEntity.ok("Exported transactions");
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<?> refundTransaction(@PathVariable String id) {
        // TODO: Implement refund logic
        return ResponseEntity.ok("Refunded transaction " + id);
    }
}
