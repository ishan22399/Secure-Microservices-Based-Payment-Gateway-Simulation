package com.example.paymentgateway.controller;

import com.example.paymentgateway.model.PaymentMethod;
import com.example.paymentgateway.model.User;
import com.example.paymentgateway.service.PaymentMethodService;
import com.example.paymentgateway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {
    @Autowired
    private PaymentMethodService paymentMethodService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> addPaymentMethod(@RequestBody PaymentMethod paymentMethod, Principal principal) {
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        PaymentMethod saved = paymentMethodService.addPaymentMethod(user, paymentMethod);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> getUserPaymentMethods(Principal principal) {
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        List<PaymentMethod> methods = paymentMethodService.getUserPaymentMethods(user);
        return ResponseEntity.ok(methods);
    }
}
