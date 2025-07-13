package com.example.paymentgateway.controller;

import com.example.paymentgateway.model.Transaction;
import com.example.paymentgateway.model.User;
import com.example.paymentgateway.service.TransactionService;
import com.example.paymentgateway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody Transaction transaction, Principal principal) {
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Transaction saved = transactionService.createTransaction(user, transaction);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> getUserTransactions(Principal principal) {
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        List<Transaction> transactions = transactionService.getUserTransactions(user);
        return ResponseEntity.ok(transactions);
    }
}
