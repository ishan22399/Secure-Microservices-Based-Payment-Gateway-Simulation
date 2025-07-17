package com.securepay.controller;

import com.securepay.entity.User;
import com.securepay.entity.UserRole;
import com.securepay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('BANK_ADMIN')")
    public ResponseEntity<?> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<User> users;

            if (search != null && !search.isEmpty()) {
                users = userService.searchUsers(search, pageable);
            } else if (role != null) {
                users = userService.getUsersByRole(UserRole.valueOf(role.toUpperCase()), pageable);
            } else {
                users = userService.getAllUsers(pageable);
            }

            return ResponseEntity.ok(Map.of(
                "users", users.getContent(),
                "totalElements", users.getTotalElements(),
                "totalPages", users.getTotalPages(),
                "currentPage", users.getNumber(),
                "stats", userService.getUserStats()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch users"));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('BANK_ADMIN')")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user"));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BANK_ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            User updatedUser = userService.updateUser(id, updates);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User updated successfully",
                "user", updatedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
