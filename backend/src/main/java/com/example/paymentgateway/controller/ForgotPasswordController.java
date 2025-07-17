package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Mock: pretend to send email/OTP
        System.out.println("[DEBUG] Forgot password requested for email: " + request.getEmail());
        // In real implementation, generate token/OTP and send email
        return ResponseEntity.ok(Map.of(
            "message", "Reset link or OTP sent to email",
            "email", request.getEmail()
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Mock: pretend to reset password if token/OTP matches
        System.out.println("[DEBUG] Reset password for email: " + request.getEmail() + ", token: " + request.getToken());
        // In real implementation, validate token/OTP and update password
        if (request.getToken() == null || request.getToken().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or missing token/OTP"));
        }
        return ResponseEntity.ok(Map.of(
            "message", "Password reset successful",
            "email", request.getEmail()
        ));
    }

    // DTOs for request bodies
    public static class ForgotPasswordRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ResetPasswordRequest {
        private String email;
        private String token;
        private String newPassword;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
