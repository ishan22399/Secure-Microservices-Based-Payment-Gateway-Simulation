package com.example.paymentgateway.repository;

import com.example.paymentgateway.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByUserId(Long userId);

    // Multi-tenant queries
    List<PaymentMethod> findByMerchantId(String merchantId);
    List<PaymentMethod> findByBankId(String bankId);
    List<PaymentMethod> findByUserIdAndMerchantId(Long userId, String merchantId);
    List<PaymentMethod> findByUserIdAndBankId(Long userId, String bankId);
}
