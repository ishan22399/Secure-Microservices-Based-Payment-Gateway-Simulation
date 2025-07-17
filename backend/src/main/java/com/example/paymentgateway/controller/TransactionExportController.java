package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionExportController {
    @GetMapping("/export")
    public ResponseEntity<?> exportTransactions() {
        // Mock: return CSV string as file download
        String csv = "id,amount,status\n1,100.0,COMPLETED\n2,50.0,FAILED\n3,200.0,PENDING";
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=transactions.csv")
            .header("Content-Type", "text/csv")
            .body(csv);
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<?> refundTransaction(@PathVariable String id) {
        // Mock: pretend to refund transaction
        System.out.println("[DEBUG] Refunding transaction: " + id);
        // In real implementation, update transaction status and process refund
        return ResponseEntity.ok(java.util.Map.of(
            "message", "Refund processed",
            "transactionId", id
        ));
    }
}
