package com.securepay.controller;

import com.securepay.entity.PaymentMethod;
import com.securepay.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment-methods")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getPaymentMethods(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "false") boolean activeOnly,
            @RequestParam Long userId) {
        try {
            List<PaymentMethod> paymentMethods;
            if (activeOnly) {
                paymentMethods = paymentMethodService.getActivePaymentMethodsByUserId(userId);
            } else {
                paymentMethods = paymentMethodService.getPaymentMethodsByUserId(userId);
            }

            return ResponseEntity.ok(Map.of(
                "paymentMethods", paymentMethods,
                "total", paymentMethods.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch payment methods"));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        try {
            PaymentMethod savedMethod = paymentMethodService.createPaymentMethod(paymentMethod);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment method added successfully",
                "paymentMethod", savedMethod
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", "Failed to add payment method"));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> updatePaymentMethod(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            PaymentMethod updatedMethod = paymentMethodService.updatePaymentMethod(id, updates);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment method updated successfully",
                "paymentMethod", updatedMethod
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentMethod(@PathVariable Long id) {
        try {
            paymentMethodService.deletePaymentMethod(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment method deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
