package com.example.paymentgateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class OtpController {
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody Object request) {
        // TODO: Implement OTP request logic
        return ResponseEntity.ok("OTP sent");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Object request) {
        // TODO: Implement OTP verification logic
        return ResponseEntity.ok("OTP verified");
    }
}
