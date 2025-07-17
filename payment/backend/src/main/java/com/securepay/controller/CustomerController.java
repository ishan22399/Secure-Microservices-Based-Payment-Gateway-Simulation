package com.securepay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CustomerController {

    @GetMapping
    public ResponseEntity<?> getCustomers(
            @RequestParam(required = false) String merchantId) {
        try {
            List<Map<String, Object>> customers = generateMockCustomers();
            return ResponseEntity.ok(Map.of(
                "customers", customers,
                "total", customers.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch customers"));
        }
    }

    private List<Map<String, Object>> generateMockCustomers() {
        List<Map<String, Object>> customers = new ArrayList<>();

        Map<String, Object> customer1 = new HashMap<>();
        customer1.put("id", "CUST_001");
        customer1.put("name", "John Smith");
        customer1.put("email", "john.smith@email.com");
        customer1.put("phone", "+1-555-0123");
        customer1.put("location", "New York, NY");
        customer1.put("totalSpent", 2450.0);
        customer1.put("transactionCount", 12);
        customer1.put("lastTransaction", "2024-01-10T14:32:15Z");
        customer1.put("status", "active");
        customer1.put("joinDate", "2023-06-15T10:00:00Z");
        customers.add(customer1);

        Map<String, Object> customer2 = new HashMap<>();
        customer2.put("id", "CUST_002");
        customer2.put("name", "Sarah Johnson");
        customer2.put("email", "sarah.j@email.com");
        customer2.put("phone", "+1-555-0456");
        customer2.put("location", "Los Angeles, CA");
        customer2.put("totalSpent", 1890.5);
        customer2.put("transactionCount", 8);
        customer2.put("lastTransaction", "2024-01-08T09:15:30Z");
        customer2.put("status", "active");
        customer2.put("joinDate", "2023-08-22T14:30:00Z");
        customers.add(customer2);

        Map<String, Object> customer3 = new HashMap<>();
        customer3.put("id", "CUST_003");
        customer3.put("name", "Mike Wilson");
        customer3.put("email", "mike.wilson@email.com");
        customer3.put("totalSpent", 750.25);
        customer3.put("transactionCount", 3);
        customer3.put("lastTransaction", "2023-12-20T16:45:00Z");
        customer3.put("status", "inactive");
        customer3.put("joinDate", "2023-11-10T11:20:00Z");
        customers.add(customer3);

        return customers;
    }
}
