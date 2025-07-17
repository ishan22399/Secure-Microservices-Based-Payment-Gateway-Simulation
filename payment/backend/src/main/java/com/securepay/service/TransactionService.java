package com.securepay.service;

import com.securepay.entity.Transaction;
import com.securepay.entity.TransactionStatus;
import com.securepay.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Page<Transaction> getAllTransactions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return transactionRepository.findAll(pageable);
    }

    public Page<Transaction> getTransactionsByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return transactionRepository.findByUserId(userId, pageable);
    }

    public Page<Transaction> getTransactionsByMerchantId(String merchantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return transactionRepository.findByMerchantId(merchantId, pageable);
    }

    public Transaction createTransaction(Transaction transaction) {
        transaction.setStatus(TransactionStatus.PENDING);
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Simulate processing
        processTransaction(savedTransaction);
        
        return savedTransaction;
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction updateTransactionStatus(Long id, TransactionStatus status) {
        Optional<Transaction> transactionOpt = transactionRepository.findById(id);
        if (transactionOpt.isPresent()) {
            Transaction transaction = transactionOpt.get();
            transaction.setStatus(status);
            return transactionRepository.save(transaction);
        }
        throw new RuntimeException("Transaction not found");
    }

    public List<Transaction> getRecentTransactions(int limit) {
        return transactionRepository.findAll(PageRequest.of(0, limit, Sort.by("createdAt").descending())).getContent();
    }

    public Map<String, Object> getTransactionStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime thisMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        
        stats.put("totalTransactions", transactionRepository.count());
        stats.put("completedTransactions", transactionRepository.countByStatus(TransactionStatus.COMPLETED));
        stats.put("pendingTransactions", transactionRepository.countByStatus(TransactionStatus.PENDING));
        stats.put("failedTransactions", transactionRepository.countByStatus(TransactionStatus.FAILED));
        
        BigDecimal totalAmount = transactionRepository.getTotalAmountSince(thisMonth);
        stats.put("totalAmount", totalAmount != null ? totalAmount : BigDecimal.ZERO);
        
        stats.put("todayTransactions", transactionRepository.countTransactionsSince(today));
        stats.put("monthTransactions", transactionRepository.countTransactionsSince(thisMonth));
        
        return stats;
    }

    @Async
    public void processTransaction(Transaction transaction) {
        // Simulate async processing
        try {
            Thread.sleep(2000); // Simulate processing time
            
            // Simulate success/failure (90% success rate)
            if (Math.random() < 0.9) {
                transaction.setStatus(TransactionStatus.COMPLETED);
            } else {
                transaction.setStatus(TransactionStatus.FAILED);
            }
            
            transactionRepository.save(transaction);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
