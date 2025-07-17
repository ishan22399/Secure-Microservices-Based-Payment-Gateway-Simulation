package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class OtpController {

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody OtpRequest request) {
        // Mock: pretend to send OTP
        System.out.println("[DEBUG] OTP requested for: " + request.getEmail());
        // In real implementation, generate and send OTP
        return ResponseEntity.ok(java.util.Map.of(
            "message", "OTP sent",
            "email", request.getEmail()
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest request) {
        // Mock: pretend to verify OTP
        System.out.println("[DEBUG] Verifying OTP for: " + request.getEmail() + ", otp: " + request.getOtp());
        // In real implementation, check OTP validity
        if (request.getOtp() == null || request.getOtp().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Invalid or missing OTP"));
        }
        return ResponseEntity.ok(java.util.Map.of(
            "message", "OTP verified",
            "email", request.getEmail()
        ));
    }

    // DTOs for request bodies
    public static class OtpRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class OtpVerifyRequest {
        private String email;
        private String otp;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }
}
