package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    // Simple in-memory store for demonstration
    private final Map<String, Customer> customerStore = new HashMap<>();

    @GetMapping
    public ResponseEntity<List<Customer>> listCustomers() {
        return ResponseEntity.ok(new ArrayList<>(customerStore.values()));
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        String id = UUID.randomUUID().toString();
        customer.setId(id);
        customerStore.put(id, customer);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable String id) {
        Customer customer = customerStore.get(id);
        if (customer == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        }
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable String id, @RequestBody Customer updated) {
        Customer customer = customerStore.get(id);
        if (customer == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        }
        updated.setId(id);
        customerStore.put(id, updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        Customer removed = customerStore.remove(id);
        if (removed == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        }
        return ResponseEntity.ok(Map.of("message", "Customer deleted", "id", id));
    }

    // Simple Customer model for demonstration
    public static class Customer {
        private String id;
        private String name;
        private String email;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
