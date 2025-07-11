import com.example.paymentgateway.kafka.KafkaCompensationProducerService;
    @Autowired
    private KafkaCompensationProducerService kafkaCompensationProducerService;
import com.example.paymentgateway.kafka.KafkaSagaProducerService;
    @Autowired
    private KafkaSagaProducerService kafkaSagaProducerService;
import com.example.paymentgateway.kafka.KafkaProducerService;
    @Autowired
    private KafkaProducerService kafkaProducerService;
package com.example.paymentgateway.service;

import com.example.paymentgateway.model.Transaction;
import com.example.paymentgateway.model.User;
import com.example.paymentgateway.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    @Async
    public Transaction createTransaction(User user, Transaction transaction) {
        // Idempotency: check for existing transaction by reference (if provided)
        if (transaction.getReference() != null && !transaction.getReference().isEmpty()) {
            List<Transaction> existing = transactionRepository.findByUserId(user.getId());
            for (Transaction t : existing) {
                if (transaction.getReference().equals(t.getReference())) {
                    return t; // Idempotent: return existing transaction
                }
            }
        }
        // Business rule: check user enabled
        if (!user.isEnabled()) {
            throw new IllegalArgumentException("User account is disabled");
        }
        // Business rule: check positive amount
        if (transaction.getAmount() == null || transaction.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }
        transaction.setUser(user);
        transaction.setMerchantId(user.getMerchantId());
        transaction.setBankId(user.getBankId());
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus("PENDING");
        // Simulate async processing for long-running transactions (e.g., external payment gateway call)
        // In a real system, this would enqueue a message or call an async workflow
        Transaction saved = transactionRepository.save(transaction);
        // Publish event to Kafka for distributed saga/orchestration
        kafkaProducerService.sendTransactionEvent("Transaction created: " + saved.getId());
        // Publish saga event for distributed transaction orchestration
        kafkaSagaProducerService.sendSagaEvent("Saga start for transaction: " + saved.getId());
        // Example: if transaction fails, send compensation event
        if (saved.isFailed()) {
            kafkaCompensationProducerService.sendCompensationEvent("Compensate transaction: " + saved.getId());
        }
        return saved;
    }

    public List<Transaction> getUserTransactions(User user) {
        if (user.getMerchantId() != null) {
            return transactionRepository.findByUserIdAndMerchantId(user.getId(), user.getMerchantId());
        } else if (user.getBankId() != null) {
            return transactionRepository.findByUserIdAndBankId(user.getId(), user.getBankId());
        } else {
            return transactionRepository.findByUserId(user.getId());
        }
    }
}
