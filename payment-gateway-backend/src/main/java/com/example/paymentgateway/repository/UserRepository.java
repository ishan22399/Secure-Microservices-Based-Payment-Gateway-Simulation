package com.example.paymentgateway.repository;

import com.example.paymentgateway.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Multi-tenant queries
    List<User> findByMerchantId(String merchantId);
    List<User> findByBankId(String bankId);
    Optional<User> findByIdAndMerchantId(Long id, String merchantId);
    Optional<User> findByIdAndBankId(Long id, String bankId);
}
