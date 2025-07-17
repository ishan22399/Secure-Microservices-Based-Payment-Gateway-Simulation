package com.securepay.service;

import com.securepay.entity.User;
import com.securepay.entity.UserRole;
import com.securepay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> getUsersByRole(UserRole role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }

    public Page<User> searchUsers(String search, Pageable pageable) {
        return userRepository.findByNameContainingOrEmailContaining(search, pageable);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, Map<String, Object> updates) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            if (updates.containsKey("name")) {
                user.setName((String) updates.get("name"));
            }
            if (updates.containsKey("email")) {
                user.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("role")) {
                user.setRole(UserRole.valueOf((String) updates.get("role")));
            }
            
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found");
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("customers", userRepository.countByRole(UserRole.CUSTOMER));
        stats.put("merchants", userRepository.countByRole(UserRole.MERCHANT));
        stats.put("admins", userRepository.countByRole(UserRole.BANK_ADMIN));
        return stats;
    }
}
