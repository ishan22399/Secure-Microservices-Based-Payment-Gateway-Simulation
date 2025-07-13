package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Object request) {
        // TODO: Implement logic to send reset email/OTP
        return ResponseEntity.ok("Reset link sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Object request) {
        // TODO: Implement logic to reset password
        return ResponseEntity.ok("Password reset successful");
    }
}
