package com.example.paymentgateway.controller;

import jakarta.servlet.http.HttpServletRequest;

import com.example.paymentgateway.security.JwtBlacklist;

import com.example.paymentgateway.model.AuthRequest;
import com.example.paymentgateway.model.AuthResponse;
import com.example.paymentgateway.model.User;
import com.example.paymentgateway.security.JwtUtil;
import com.example.paymentgateway.security.CustomUserDetailsService;
import com.example.paymentgateway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired(required = false)
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtBlacklist jwtBlacklist;
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            jwtBlacklist.blacklist(token);
            return ResponseEntity.ok("Logged out and token revoked");
        }
        return ResponseEntity.badRequest().body("No token provided");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user, HttpServletRequest request) {
        System.out.println("[DEBUG] /api/auth/register called");
        System.out.println("[DEBUG] Request method: " + request.getMethod());
        System.out.println("[DEBUG] Request URI: " + request.getRequestURI());
        System.out.println("[DEBUG] Request Content-Type: " + request.getContentType());
        System.out.println("[DEBUG] User received: " + user);
        try {
            if (userService.existsByUsername(user.getUsername())) {
                System.out.println("[DEBUG] Username already exists: " + user.getUsername());
                return ResponseEntity.badRequest().body("Username already exists");
            }
            if (userService.existsByEmail(user.getEmail())) {
                System.out.println("[DEBUG] Email already exists: " + user.getEmail());
                return ResponseEntity.badRequest().body("Email already exists");
            }
            User saved = userService.registerUser(user);
            System.out.println("[DEBUG] User registered successfully: " + saved);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.out.println("[DEBUG] Exception in register: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Registration error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
