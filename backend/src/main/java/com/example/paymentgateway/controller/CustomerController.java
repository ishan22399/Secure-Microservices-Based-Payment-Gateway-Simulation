package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @GetMapping
    public ResponseEntity<?> listCustomers() {
        // TODO: Implement list customers
        return ResponseEntity.ok("List of customers");
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Object request) {
        // TODO: Implement create customer
        return ResponseEntity.ok("Customer created");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable String id) {
        // TODO: Implement get customer
        return ResponseEntity.ok("Customer details for " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable String id, @RequestBody Object request) {
        // TODO: Implement update customer
        return ResponseEntity.ok("Customer updated for " + id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        // TODO: Implement delete customer
        return ResponseEntity.ok("Customer deleted for " + id);
    }
}
