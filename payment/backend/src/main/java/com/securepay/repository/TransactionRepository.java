package com.securepay.repository;

import com.securepay.entity.Transaction;
import com.securepay.entity.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionId(String transactionId);
    Page<Transaction> findByUserId(Long userId, Pageable pageable);
    Page<Transaction> findByMerchantId(String merchantId, Pageable pageable);
    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);
    
    long countByStatus(TransactionStatus status);
    long countByCreatedAtAfter(LocalDateTime date);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdAt >= :date")
    long countTransactionsSince(@Param("date") LocalDateTime date);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.createdAt >= :date AND t.status = 'COMPLETED'")
    BigDecimal getTotalAmountSince(@Param("date") LocalDateTime date);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = 'COMPLETED'")
    BigDecimal getTotalCompletedAmount();
    
    @Query("SELECT t FROM Transaction t WHERE t.merchantName LIKE %:search% OR t.description LIKE %:search%")
    Page<Transaction> findBySearchTerm(@Param("search") String search, Pageable pageable);
}
