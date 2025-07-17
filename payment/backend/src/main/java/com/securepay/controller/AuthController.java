package com.securepay.controller;

import com.securepay.dto.LoginRequest;
import com.securepay.dto.RegisterRequest;
import com.securepay.entity.User;
import com.securepay.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.findByEmail(request.getEmail());
            // In a real application, you would validate the password here
            if (user != null && user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        // In a real application, you would retrieve the current user from a session or context
        // For now, we'll return a dummy user or handle as per your application's logic
        return ResponseEntity.ok(new User()); // Return a dummy user or null
    }
}
