package com.securepay.service;

import com.securepay.dto.RegisterRequest;
import com.securepay.entity.Permission;
import com.securepay.entity.User;
import com.securepay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Store password as plain text
        user.setRole(request.getRole());
        user.setCompanyName(request.getCompanyName()); // Set company name for merchants

        // Assign permissions based on role
        Set<Permission> permissions = new HashSet<>();
        switch (user.getRole()) {
            case CUSTOMER:
                permissions.add(Permission.READ_TRANSACTIONS);
                permissions.add(Permission.CREATE_TRANSACTION);
                permissions.add(Permission.READ_PAYMENT_METHODS);
                permissions.add(Permission.CREATE_PAYMENT_METHOD);
                permissions.add(Permission.DELETE_PAYMENT_METHOD);
                permissions.add(Permission.READ_NOTIFICATIONS);
                permissions.add(Permission.MANAGE_PROFILE);
                break;
            case MERCHANT:
                permissions.add(Permission.READ_TRANSACTIONS);
                permissions.add(Permission.CREATE_TRANSACTION);
                permissions.add(Permission.READ_PAYMENT_LINKS);
                permissions.add(Permission.CREATE_PAYMENT_LINK);
                permissions.add(Permission.READ_ANALYTICS);
                permissions.add(Permission.READ_CUSTOMERS);
                permissions.add(Permission.MANAGE_PROFILE);
                break;
            case BANK_ADMIN:
                permissions.add(Permission.READ_TRANSACTIONS);
                permissions.add(Permission.MANAGE_USERS);
                permissions.add(Permission.MANAGE_MERCHANTS);
                permissions.add(Permission.READ_ANALYTICS);
                permissions.add(Permission.READ_AUDIT_LOGS);
                permissions.add(Permission.MANAGE_SYSTEM_SETTINGS);
                permissions.add(Permission.READ_NOTIFICATIONS);
                break;
        }
        user.setPermissions(permissions.stream().collect(Collectors.toList()));

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
