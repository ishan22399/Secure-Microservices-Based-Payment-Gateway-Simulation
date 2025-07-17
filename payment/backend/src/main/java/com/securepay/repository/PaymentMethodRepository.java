package com.securepay.repository;

import com.securepay.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByUserId(Long userId);
    List<PaymentMethod> findByUserIdAndIsActive(Long userId, Boolean isActive);
    List<PaymentMethod> findByUserIdAndType(Long userId, String type);
}
