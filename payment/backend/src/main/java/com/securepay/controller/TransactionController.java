package com.securepay.controller;

import com.securepay.entity.Transaction;
import com.securepay.entity.TransactionStatus;
import com.securepay.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasRole('BANK_ADMIN') or hasRole('MERCHANT')")
    public ResponseEntity<?> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Transaction> transactions = transactionService.getAllTransactions(page, size);
            return ResponseEntity.ok(Map.of(
                "content", transactions.getContent(),
                "totalElements", transactions.getTotalElements(),
                "totalPages", transactions.getTotalPages(),
                "currentPage", transactions.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch transactions"));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('MERCHANT')")
    public ResponseEntity<?> createTransaction(@RequestBody Transaction transaction) {
        try {
            Transaction savedTransaction = transactionService.createTransaction(transaction);
            return ResponseEntity.ok(savedTransaction);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", "Failed to create transaction: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('BANK_ADMIN') or hasRole('MERCHANT') or hasRole('CUSTOMER')")
    public ResponseEntity<?> getTransaction(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        if (transaction.isPresent()) {
            return ResponseEntity.ok(transaction.get());
        }
        return ResponseEntity.status(404).body(Map.of("error", "Transaction not found"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('BANK_ADMIN')")
    public ResponseEntity<?> updateTransactionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusData) {
        try {
            TransactionStatus status = TransactionStatus.valueOf(statusData.get("status"));
            Transaction updatedTransaction = transactionService.updateTransactionStatus(id, status);
            return ResponseEntity.ok(updatedTransaction);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", "Failed to update transaction status"));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentTransactions(
            @RequestParam(defaultValue = "5") int limit) {
        List<Transaction> recentTransactions = transactionService.getRecentTransactions(limit);
        return ResponseEntity.ok(recentTransactions);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getTransactionStats() {
        Map<String, Object> stats = transactionService.getTransactionStats();
        return ResponseEntity.ok(stats);
    }
}
