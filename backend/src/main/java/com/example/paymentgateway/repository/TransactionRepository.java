package com.example.paymentgateway.repository;

import com.example.paymentgateway.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);

    // Multi-tenant queries
    List<Transaction> findByMerchantId(String merchantId);
    List<Transaction> findByBankId(String bankId);
    List<Transaction> findByUserIdAndMerchantId(Long userId, String merchantId);
    List<Transaction> findByUserIdAndBankId(Long userId, String bankId);
}
